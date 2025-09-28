"use client";
import { useState } from "react";
import { useAuth } from "contexts/AuthContext";
import styles from "./styles.module.scss";
import Link from "next/link";
import LoadingLock from "components/LoadingUI/LoadingLock/LoadingLock";

type userCredentialsType = {
  name: string | undefined;
  email: string | undefined;
  password: string | undefined;
}

type loginDetailsType = {
  email: string | undefined;
  password: string | undefined;
}

export default function LoginForm() {

  //switch between login or signup
  const [loginOrSignup, setLoginOrSignup] = useState("login");

  //state object for sign up form
  const [userCredentials, setUserCredentials] = useState<userCredentialsType>({
    name: "",
    email: "",
    password: ""
  })

  //create state object for login details
  const [loginDetails, setLoginDetails] = useState<loginDetailsType>({
    email: "",
    password: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  //get auth login function from AuthContext
  const { login } = useAuth();

  //triggered on click of login button
  async function handleLoginSubmit(e) {
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
  function handleLoginEmailChange(e: { target: { value: string } }) {
    setError(null);
    setLoginDetails({
      ...loginDetails,
      email: e.target.value,
    });
  }

  async function handleSignupSubmit(e) {
    //prevent browser from reloading page
    e.preventDefault()
    setError(null);
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

  //uses spread operator to only change the password value
  function handleLoginPasswordChange(e: { target: { value: string } }) {
    setError(null);
    setLoginDetails({
      ...loginDetails,
      password: e.target.value,
    });
  }

  //uses spread operator to only change the email value
  function handleSignupUserNameChange(e: { target: { value: string } }) {
    setError(null);
    setUserCredentials({
    ...userCredentials,
    name: e.target.value,
    });
}

//uses spread operator to only change the email value
function handleSignupEmailChange(e: { target: { value: string } }) {
  setError(null);
    setUserCredentials({
    ...userCredentials,
    email: e.target.value,
    });
}

//uses spread operator to only change the password value
function handleSignupPasswordChange(e: { target: { value: string } }) {
    setError(null);
    setUserCredentials({
    ...userCredentials,
    password: e.target.value,
    });
}

  return (
    <div className={styles.formContainer}>
      <p className={styles.loginText}>{loginOrSignup == "login" ? "Enter your details to log in" : "Create a free account"}</p>
      {loading == true ? <section className={styles.loadingContainer}>
          <LoadingLock/>
        </section>:
        loginOrSignup == "login" ?
          <form className={styles.formBody} method="post" onSubmit={handleLoginSubmit}>
                <input
                  className={styles.formInput}
                  required
                  type="email"
                  name="email"
                  placeholder={"email"}
                  value={loginDetails.email}
                  onChange={handleLoginEmailChange}
                />
                <input
                  className={styles.formInput}
                  required
                  type="password"
                  name="password"
                  placeholder="password"
                  value={loginDetails.password}
                  onChange={handleLoginPasswordChange}
                />
            <button className={styles.button} type="submit">Log In</button>
          </form> :
          <form className={styles.formBody} method="post" onSubmit={handleSignupSubmit}>
            <input
              className={styles.formInput}
              required
              type="text"
              name="name"
              placeholder="username"
              value={userCredentials.name}
              onChange={handleSignupUserNameChange}
            />
            <input
              className={styles.formInput}
              required
              type="email"
              name="email"
              placeholder="email"
              value={userCredentials.email}
              onChange={handleSignupEmailChange}
            />
            <input
              className={styles.formInput}
              required
              type="password"
              name="password"
              placeholder="password"
              value={userCredentials.password}
              onChange={handleSignupPasswordChange}
            />
            <button className={styles.button} type="submit">Sign Up</button>
          </form>
      }
      { !loading ? <section className={styles.errorContainer}>
        <p className={styles.errorMessage}>{error}</p>
      </section> :
      null}
      <section className={styles.signupText}>
        <p>{loginOrSignup == "login" ? "New to these lands?" : "Already have an account?"}</p>
        <button className={styles.button} onClick={() => {setLoginOrSignup(loginOrSignup == "login" ? "signup" : "login"), setError(null)}}>{loginOrSignup == "login" ? "Sign Up" : "Login"}</button>
      </section>
    </div>
  );
}
