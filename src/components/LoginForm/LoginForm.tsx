"use client";
import { useState } from "react";
import { useAuth } from "contexts/AuthContext";
import styles from "./styles.module.scss";
import Link from "next/link";

export default function LoginForm() {
  //create state object for login details
  const [loginDetails, setLoginDetails] = useState({
    email: "",
    password: "",
  });

  //TODO: add an error message pop up in log in fails
  const [error, setError] = useState<string | null>(null);
  //TODO: add animated 'logging you in' message whilst loading is true for user assurance
  const [loading, setLoading] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(true)

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

    try {
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

      //and login in the user, setting context and storing the token in local storage
      login(data.access_token);
  
    } catch (err) {
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

  return (
    <div className={styles.formContainer}>
      <form className={styles.loginForm} method="post" onSubmit={handleSubmit}>
        <h3>Welcome to Stronghold Manager</h3>
        <p>Enter your details to log in</p>
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
      </form>
      <p>First time?</p>
      <Link href = "/register">Sign Up</Link>
    </div>
  );
}
