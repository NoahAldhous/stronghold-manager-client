"use client"

import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

type TokenPayloadType = {
    sub: string;
    role: string;
    user_name: string;
    expiration: number;
}

//Define shape of auth context
type AuthContextType = {
    isLoggedIn: boolean;
    accessToken: string | null;
    refreshToken: string | null;
    userId: string | null;
    role: string | null;
    userName: string | null;
    loading: boolean;
    login: (accessToken: string, refreshToken: string) => void;
    logout: () => void;
};

//Create context with default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

//Create AuthProvider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    //Decode and derive values from token
    let decodedToken: TokenPayloadType | null = null;
    if (accessToken) {
        try {
            decodedToken = jwtDecode<TokenPayloadType>(accessToken); 
        } catch (err) {
            console.error("Invalid token", err)
        }
    }

    //Derive logged in state from if token exists or not
    const isLoggedIn = !!accessToken
    const userId = decodedToken?.sub || null;
    const role = decodedToken?.role || null;
    const userName = decodedToken?.user_name || null;

    //On mount, try to restore session from localStorage
    useEffect(() => {
        const savedAccess = localStorage.getItem("accessToken");
        const savedRefresh = localStorage.getItem("refreshToken");
        
        if (savedAccess) setAccessToken(savedAccess);
        if (savedRefresh) setRefreshToken(savedRefresh);

        setLoading(false);
    }, []);

    //Login function
    function login(newAccess:string, newRefresh:string) {
        setAccessToken(newAccess);
        setRefreshToken(newRefresh);
        localStorage.setItem("accessToken", newAccess);
        localStorage.setItem("refreshToken", newRefresh);
    };

    //Logout function
    function logout() {
        setAccessToken(null);
        setRefreshToken(null);
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, accessToken, refreshToken, userId, role, userName, loading, login, logout }}>
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