"use client"
import LoginForm from "components/LoginForm/LoginForm"
import SignUpForm from "components/SignUpForm/SignUpForm"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "contexts/AuthContext"

export default function Page(){

    const router = useRouter();
    const { isLoggedIn } = useAuth();

    //if user is logged in, redirect to homepage
    //TODO: adjust logic so user is redirected to page they were trying to access, rather than homepage

    useEffect(() => {
        if ( isLoggedIn ) {
            router.push("/")
        }
    },[isLoggedIn])

    return <>
        <h1>Welcome to Login</h1>
        <h2>or signup, if you dont have an account</h2>
        <LoginForm/>
        <SignUpForm/>
    </>
}