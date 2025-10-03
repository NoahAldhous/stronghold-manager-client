"use client";

import Link from "next/link";
import styles from "./styles.module.scss"
import { useAuth } from "contexts/AuthContext";
import ScreenEffect from "components/ScreenEffect/ScreenEffect";
import { useState } from "react";

export default function NavBar(){

    const { role, logout } = useAuth();

    const[screenEffect, setScreenEffect] = useState(true);


    return (
        <div className={styles.navbar}>
            <h1 className={styles.title}>Stronghold Manager</h1>
            <section className={styles.buttonContainer}>
                <Link className={`${styles.button} ${styles.link}`}  href="/">Home</Link>
                <button className={styles.button} onClick={() => {setScreenEffect(!screenEffect)}}>Toggle Screen Effect</button>
                <button className={styles.button} onClick={logout}>Log Out</button>
                {role == "admin" ? <Link className={`${styles.button} ${styles.link}`} href="/admin">admin</Link> : null}
                { screenEffect ? <ScreenEffect/> : null}
            </section>
        </div>
    )
}