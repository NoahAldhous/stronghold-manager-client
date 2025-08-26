"use client";
import { useState } from "react";

export default function LoginForm() {
  //create state object for login details
  const [loginDetails, setLoginDetails] = useState({
    email: "",
    password: "",
  });

  //triggered on click of submit button
  async function handleSubmit(e) {
    //prevent browser from reloading page
    e.preventDefault();

    //Read the form data
    const form = e.target;

    const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/login`, {
        method: form.method,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(loginDetails)
    });

    //if login success, will return an access token
    const token = await data.json()

    console.log(token)
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
      <button type="submit">Login</button>
    </form>
  );
}
