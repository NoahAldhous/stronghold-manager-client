"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "contexts/AuthContext";
import LoginForm from "components/LoginForm/LoginForm";
import SignUpForm from "components/SignUpForm/SignUpForm";

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [noStrongholds, setNoStrongholds] = useState(false);
  const router = useRouter();
  const { isLoggedIn, logout, userId } = useAuth();

  //redirect user to login/signup page if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    } else {
      fetchStrongholdsByUserId();
    }
  }, [isLoggedIn]);

  async function fetchStrongholdsByUserId() {
    try {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/strongholds/user/${userId}`);

    if (!res.ok) {
        throw new Error("There was a problem getting a response.");
    }

    const data = await res.json();
    console.log(data.data)
    if (data.data.length === 0) {
        setNoStrongholds(true);
    } else {
    }
    } catch (err) {
    console.log(err.message);
    } finally {
    setLoading(false);
    }
  }

  return (
    <>
      <h1>This is the homepage!</h1>
      <h2>You should only be here if you are logged in!</h2>
      <button onClick={logout}>Log Out</button>
      {noStrongholds ? (
        <p>you have no strongholds! boo!</p>
      ) : (
        <p>here are your strongholds:</p>
      )}
      {/* <LoginForm/>
        <SignUpForm/> */}
    </>
  );
}
