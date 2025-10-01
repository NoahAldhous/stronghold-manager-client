"use client";

import Link from "next/link";
import styles from "./styles.module.scss"
import { useAuth } from "contexts/AuthContext";

export default function NavBar({setScreenEffect, screenEffect}){

    const { role, logout } = useAuth();

    return (
        <div className={styles.navbar}>
            <h1 className={styles.title}>Stronghold Manager</h1>
            <section className={styles.buttonContainer}>
                <Link className={`${styles.button} ${styles.link}`}  href="/">Home</Link>
                <button className={styles.button} onClick={() => {setScreenEffect(!screenEffect)}}>Toggle Screen Effect</button>
                <button className={styles.button} onClick={logout}>Log Out</button>
                {role == "admin" ? <Link className={`${styles.button} ${styles.link}`} href="/admin">admin</Link> : null}
            </section>
        </div>
    )
}