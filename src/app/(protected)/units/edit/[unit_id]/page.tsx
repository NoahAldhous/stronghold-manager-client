"use client";
import styles from "./styles.module.scss";
import UnitCard from "components/UnitCard/UnitCard";
import UnitEditor from "components/UnitEditor/UnitEditor";
import { use, useState, useEffect } from "react";
import type { Unit } from "types";

export default function Page({ params } : { params: Promise<{unit_id: string}> }) {
    const { unit_id } = use(params);

    const [unit, setUnit] = useState<Unit | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    async function fetchUnit(id : string){
        if (!unit) {
            setLoading(true);

            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/units/${id}`
                );

                if (!res.ok){
                    throw new Error("There was a problem fetching the unit, please try again.")
                }

                const data = await res.json();
                setUnit(data.unit);
            } catch (err){
                console.log(err.message);
            } finally {
                setLoading(false);
                
            }
        }
    }

    useEffect(() => {
        if (!unit) {
            console.log('fetching unit', unit_id)
            fetchUnit(unit_id)
        }
        if (unit){
            console.log("Unit", unit)
        }
    }, [unit])

    return <main className={styles.main}>
        {
            !loading && unit ?
                <UnitEditor unit={unit} setUnit={setUnit} mode={"edit"}/>
            : null
        }
        {
            !loading && unit ?
                <UnitCard unit={unit} clickable={false}/>
            : null
        }
    </main>
}