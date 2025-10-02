"use client"

import LoadingSkeleton from "components/LoadingUI/LoadingSkeleton";
//provides a protected wrapper around all routes INSIDE the auth context wrapper, redirecting if user is not logged in.

import { useAuth } from "contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedLayout({ children }: { children: React.ReactNode}) {
    const { isLoggedIn, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !isLoggedIn) {
            router.push("/login")
        }
    },[loading, isLoggedIn, router])

    if(loading) {
        return <LoadingSkeleton/>
    }

    if(!isLoggedIn) {
        return null; //prevent any flickering whilst redirect happens
    }

    return (
        <main>
            {children}
        </main>
    )
}