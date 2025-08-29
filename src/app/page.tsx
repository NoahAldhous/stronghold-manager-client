"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "contexts/AuthContext"
import LoginForm from "components/LoginForm/LoginForm"
import SignUpForm from "components/SignUpForm/SignUpForm"

export default function Page(){

    const router = useRouter();
    const { isLoggedIn, logout } = useAuth();

    useEffect(() => {
        if ( !isLoggedIn ) {
            router.push("/login")
        }
    },[isLoggedIn])

    return <>
        <h1>This is the homepage!</h1>
        <h2>You should only be here if you're logged in!</h2>
        <button onClick={logout}>Log Out</button>
        {/* <LoginForm/>
        <SignUpForm/> */}
    </>
}