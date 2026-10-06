import { Response } from "express";
import { SessionInterface } from "../middlewares/auth.middleware";
import AuthModel from "../models/auth.model"; 
import { CatchError } from "../utils/error";

export const getAllWorkers = async (req: SessionInterface, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = 4;
        const skip = (page - 1) * limit;
        
        const search = req.query.search as string;
        const location = req.query.location as string;

        const matchQuery: any = { role: "servant" };
        if (location) matchQuery.mainRoad = location;

        let pipeline: any[] = [];
        
        if (search) {
            const searchRegex = new RegExp(search, 'i');
            matchQuery.$or = [
                { fullname: searchRegex },
                { skills: searchRegex }
            ];

            pipeline.push({ $match: matchQuery });
            
            pipeline.push({
                $addFields: {
                    matchScore: {
                        $cond: [
                            // 1. Exact Name Match (Score: 3) - HIGHEST PRIORITY
                            { $eq: [{ $toLower: "$fullname" }, search.toLowerCase()] }, 3,
                            {
                                $cond: [
                                    // 2. Name Starts With Search (Score: 2)
                                    { $regexMatch: { input: "$fullname", regex: new RegExp(`^${search}`, 'i') } }, 2,
                                    // 3. Skill or Partial Match (Score: 1)
                                    1
                                ]
                            }
                        ]
                    }
                }
            });
            
            pipeline.push({ $sort: { matchScore: -1, fullname: 1 } });
        } 
        else {
            pipeline.push({ $match: matchQuery });
            pipeline.push({ $sort: { createdAt: -1 } });
        }

        const results = await AuthModel.aggregate([
            ...pipeline,
            {
                $facet: {
                    metadata: [{ $count: "total" }],
                    data: [
                        { $skip: skip },
                        { $limit: limit },
                        { $project: { password: 0, refreshToken: 0, __v: 0 } }
                    ]
                }
            }
        ]);

        const totalWorkers = results[0].metadata[0]?.total || 0;
        const workers = results[0].data;
        const totalPages = Math.ceil(totalWorkers / limit);

        res.status(200).json({ 
            workers, 
            pagination: {
                totalWorkers,
                totalPages,
                currentPage: page,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        });
    } 
    catch (err) {
        CatchError(err,res,"Failed to fetch workers")
    }
};