"use client"

import { useAuth } from "contexts/AuthContext";
import styles from "./styles.module.scss";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthFetch } from "auth/authFetch";

export default function Page(){

    const { role, isLoggedIn } = useAuth()

    const authFetch = useAuthFetch();

    const router = useRouter();

    const [loading, setLoading] = useState(false)

    const [users, setUsers] = useState([{
        user_name: "",
        email: "",
        created_at: "",
        role:""
    }])

    async function fetchUsers(){
        try {
            const res = await authFetch(
                `${process.env.NEXT_PUBLIC_API_URL}/users/`);
        
            if (!res.ok) {
                throw new Error("There was a problem getting a response.");
            }
        
            const data = await res.json();
            console.log(data.data)
              setUsers(data.data)
            } catch (err) {
            console.log(err.message);
            } finally {
            setLoading(false);
            }
    }

    useEffect(() => {
        if (!isLoggedIn) {
          router.push("/login");
        } else {
          fetchUsers();
        }
      }, [isLoggedIn]);

    return <main>
        <div>hello world</div>
        {role == "admin" ?
            users.map((item, index) =>
                <div key={index}>
                    <div>name:{item.user_name}</div>
                    <div>email:{item.email}</div>
                    <div>created at {item.created_at}</div>
                    <div>role: {item.role}</div>
                    <br/>
                </div>
            )
            : null
         }
    </main>
}