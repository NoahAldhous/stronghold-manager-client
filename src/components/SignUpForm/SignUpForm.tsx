"use client";
import { useState } from "react";
import { useAuth } from "contexts/AuthContext";

type userCredentialsType = {
    name: string | undefined;
    email: string | undefined;
    password: string | undefined;
}

export default function SignUpForm(){
    //state object for sign up form
    const [userCredentials, setUserCredentials] = useState<userCredentialsType>({
        name: "",
        email: "",
        password: ""
    })

    //use to render loading message whilst making request to server
    const [loading, setLoading] = useState(false);
    // render error message if request fails/email in user
    const [error, setError] = useState<string | null>(null);

    //get context + auth functions from AuthContext
    const { userName, isLoggedIn, userId, role, login, logout} = useAuth();

    async function handleSubmit(e) {
        //prevent browser from reloading page
        e.preventDefault()
        setLoading(true)

        //Read the form data
        const form = e.target;

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/register`,{
                method: form.method,
                headers: {
                    "Content-Type": "application/json",                    
                },
                body:JSON.stringify(userCredentials)
            });
            // if response does not return 200 status
            if (!res.ok) {
                if (res.status == 409){
                    throw new Error("Email already in use")
                } else {
                    throw new Error("Something went wrong")
                }
            }

            //if sign up is a success, will return access token
            const data = await res.json();

            //and log in the user, updating context and storing token in local storage
            login(data.access_token)
            
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    //uses spread operator to only change the email value
    function handleUserNameChange(e: { target: { value: string } }) {
        setUserCredentials({
        ...userCredentials,
        name: e.target.value,
        });
    }

    //uses spread operator to only change the email value
    function handleEmailChange(e: { target: { value: string } }) {
        setUserCredentials({
        ...userCredentials,
        email: e.target.value,
        });
    }

    //uses spread operator to only change the password value
    function handlePasswordChange(e: { target: { value: string } }) {
        setUserCredentials({
        ...userCredentials,
        password: e.target.value,
        });
    }

    return (
        <form method="post" onSubmit={handleSubmit}>
            <p>Username:{userCredentials.name}</p>
            <p>Email:{userCredentials.email}</p>
            <p>Password:{userCredentials.password}</p>
            <label>
                Username:
                <input
                    required
                    type="text"
                    name="name"
                    value={userCredentials.name}
                    onChange={handleUserNameChange}
                />
            </label>
            <label>
                Email:
                <input
                required
                type="email"
                name="email"
                value={userCredentials.email}
                onChange={handleEmailChange}
                />
            </label>
            <label>
                Password:
                <input
                required
                type="password"
                name="password"
                value={userCredentials.password}
                onChange={handlePasswordChange}
                />
            </label>
            <button type="submit">Sign Up</button>
            <p>error message: {error}</p>
        </form>
    )
}
