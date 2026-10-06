import { Router } from "express";
import AuthMiddleware from "../middlewares/auth.middleware";
import { getAllWorkers } from "../controllers/client.controller";

const clientRouter = Router()

clientRouter.get("/workers",AuthMiddleware,getAllWorkers)

export default clientRouter