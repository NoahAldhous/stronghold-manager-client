"use client";
import { useState } from "react";
import { useAuth } from "contexts/AuthContext";

export default function LoginForm() {
  //create state object for login details
  const [loginDetails, setLoginDetails] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  //get context + auth functions from AuthContext
  const { userName, isLoggedIn, userId, role, login, logout} = useAuth();

  //triggered on click of login button
  async function handleSubmit(e) {
    //prevent browser from reloading page
    e.preventDefault();
    setError(null);
    setLoading(true)

    //Read the form data
    const form = e.target;

    try{

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/login`, {
          method: form.method,
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(loginDetails)
      });
  
      if (!res.ok) {
        throw new Error("Invalid Credentials")
      }

      //if login success, will return an access token
      const data = await res.json();

      login(data.access_token);
  
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }

    
  }

  //uses spread operator to only change the email value
  function handleEmailChange(e: { target: { value: string } }) {
    setLoginDetails({
      ...loginDetails,
      email: e.target.value,
    });
  }

  //uses spread operator to only change the password value
  function handlePasswordChange(e: { target: { value: string } }) {
    setLoginDetails({
      ...loginDetails,
      password: e.target.value,
    });
  }

  //logs out the user, removing their auth token from local storage
  function handleLogout() {
    logout()
  }

  return (
    <form method="post" onSubmit={handleSubmit}>
      <p>Email state:{loginDetails.email}</p>
      <p>Password state:{loginDetails.password}</p>
      <label>
        Email:
        <input
          type="email"
          name="email"
          value={loginDetails.email}
          onChange={handleEmailChange}
        />
      </label>
      <label>
        Password:
        <input
          type="password"
          name="password"
          value={loginDetails.password}
          onChange={handlePasswordChange}
        />
      </label>
      <button type="submit">Log In</button>
      <p>{isLoggedIn ? "logged in!" : "not logged in"}</p>
      <p>role: {role}</p>
      <p> welcome, {userName}!</p>
      <button type="button" onClick={handleLogout}>Log out</button>
    </form>
  );
}
