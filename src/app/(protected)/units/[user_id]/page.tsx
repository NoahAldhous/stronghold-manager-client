"use client";
import { useAuth } from "contexts/AuthContext";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import styles from "./styles.module.scss";
import type { Units, Unit } from "types";
import UnitCard from "components/UnitCard/UnitCard";
import Link from "next/link";
import LoadingCard from "components/LoadingUI/LoadingCard/LoadingCard";

export default function Page({
    params,
}: {
    params: Promise<{user_id: string}>;
}) {
    const { user_id } = use(params);
    const [loading, setLoading] = useState<boolean>(false);
    const [units, setUnits] = useState<Units | null>(null);
    
    const router = useRouter();
    const { isLoggedIn, userId } = useAuth();

    //redirect user to login/signup page if no token
    useEffect(() => {
        if(!isLoggedIn) {
            router.push("/login");
            //if logged in user and route dont match, redirect to home page.
        } else if(userId !== user_id){
            router.push("/");
        } else {
            fetchUnitsByUserId(user_id)
        }
    }, [isLoggedIn]);

    async function fetchUnitsByUserId(user_id: string){
        if (!units) {
            setLoading(true);

            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/units/user/${user_id}`
                );

                if (!res.ok) {
                    throw new Error("There was a problem fetching unit data.");
                }

                const data = await res.json();
                setUnits(data.units);
            } catch (err) {
                console.log(err.message);
            } finally {
                setLoading(false);
            }
        }
    }

    return (
        <main className={styles.main}>
            <section className={styles.unitNav}>
                <section className={styles.filterContainer}>
                    <button>filter 1</button>
                    <button>filter 2</button>
                    <button>filter 3</button>
                </section>
                <section className={styles.buttonContainer}>
                    <Link className={styles.link} href="/unit/create">create a unit</Link>
                </section>
            </section>
            {loading ? 
                <section className={styles.unitBody}>
                    {
                        Array.from({length: 6}).map((_, index) => (
                            <span key={index} className={styles.loading}>
                                <LoadingCard/>
                            </span>
                        ))
                    }
                </section>
            :
                <section className={styles.unitBody}>
                    {units?.map((unit, index) => 
                        <UnitCard key={index} unit={unit}/>
                        
                    )}
                </section>
            }
            <section className={styles.footer}></section>
        </main>
    )
}