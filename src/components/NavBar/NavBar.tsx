"use client";

import Link from "next/link";
import styles from "./styles.module.scss"
import { useAuth } from "contexts/AuthContext";

export default function NavBar(){

    const { logout } = useAuth();

    return (
        <div className={styles.navbar}>
            <h1>Stronghold Manager</h1>
            <section className={styles.buttonContainer}>
                <Link href="/">Home</Link>
                <button onClick={logout}>Log Out</button>
            </section>
        </div>
    )
}