"use client"

import { createContext, ReactNode, useContext, useEffect, useState } from "react"
import api from "../lib/api"

interface User {
    id: string,
    fullname: string,
    email: string,
    mobile: string,
    role: string,
    image: string | null
}

interface AuthContextType {
    user: User | null,
    isLoading: boolean,
    checkSession: ()=> Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({children}:{children: ReactNode}) =>{
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    const checkSession = async ()=>{
        try{
            const {data} = await api.get("/auth/session")
            setUser(data)
        }
        catch(err){
            setUser(null)
        }
        finally{
            setIsLoading(false)
        }
    }

    useEffect(()=>{
        checkSession()
    },[])

    return(
        <AuthContext.Provider value={{user,isLoading,checkSession}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = ()=>{
    const context = useContext(AuthContext)
    if(context === undefined){
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}