"use client"

import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

type TokenPayloadType = {
    sub: string;
    role: string;
    user_name: string;
}

//Define shape of auth context
type AuthContextType = {
    isLoggedIn: boolean;
    token: string | null;
    userId: string | null;
    role: string | null;
    userName: string | null;
    login: (newToken: string) => void;
    logout: () => void;
};

//Create context with default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

//Create AuthProvider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(null);

    //Decode and derive values from token
    let decodedToken: TokenPayloadType | null = null;
    if (token) {
        try {
            decodedToken = jwtDecode<TokenPayloadType>(token); 
        } catch (err) {
            console.error("Invalid token", err)
        }
    }

    //Derive logged in state from if token exists or not
    const isLoggedIn = !!token
    const userId = decodedToken?.sub || null;
    const role = decodedToken?.role || null;
    const userName = decodedToken?.user_name || null;

    //On mount, try to restore session from localStorage
    useEffect(() => {
        const savedToken = localStorage.getItem("token")
        if (savedToken) setToken(savedToken)
    }, []);

    //Login function
    function login(newToken:string) {
        setToken(newToken)
        localStorage.setItem("token", newToken)
    };

    //Logout function
    function logout() {
        setToken(null);
        localStorage.removeItem("token")
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, token, userId, role, userName, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

//Custom hook for consuming auth
export function useAuth() {
    const context = useContext(AuthContext);
    if(!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
}