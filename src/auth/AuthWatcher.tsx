"use client";

import { useAuth } from "contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function AuthWatcher(){
    const { isLoggedIn, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    //define routes that should be protected
    const publicRoutes = ["/login"];

    useEffect(() => {
        if (loading) return;
        //only redirect user if user is not logged in and not on a public page
        if (!isLoggedIn && !publicRoutes.includes(pathname ?? "")) {
            router.push("/login");
        }
    }, [isLoggedIn, pathname, router]);

    return null;
}