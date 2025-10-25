"use client";
import UnitCard from "components/UnitCard/UnitCard";
import styles from "./styles.module.scss";
import { useEffect, useState } from 'react';
import type { Unit, Ancestry } from "types";
import { useAuth } from "contexts/AuthContext";

export default function Page(){

    const { userId } = useAuth();

    const [ loading, setLoading ] = useState<boolean>(false);

    const [unit, setUnit] = useState<Unit>({
        ancestry: {
            name: "",
            attackBonus: 0,
            powerBonus: 0,
            defenseBonus: 0,
            toughnessBonus: 0,
            moraleBonus: 0
        },
        equipment: {
            name: "",
            defenseBonus: 0,
            powerBonus: 0
        },
        experience: {
            name: "",
            attackBonus: 0,
            toughnessBonus: 0,
            moraleBonus: 0
        },
        type: {
            name: "",
            attackBonus: 0,
            powerBonus: 0,
            defenseBonus: 0,
            toughnessBonus: 0,
            moraleBonus: 0,
            costModifier: 0
        },
        casualties: 0,
        isMercenary: false,
        name: "",
        size: {
            costModifier: 0,
            sizeLevel: 0,
            unitSize: 0
        },
        stronghold_id: null,
        traits: [],
        user_id: Number(userId)
    });

    const [ancestries, setAncestries] = useState<Ancestry[] | null>(null)

    const [requestData, setRequestData] = useState({
        user_id: unit.user_id,
        unit_name: unit.name,
        stronghold_id: unit.stronghold_id,
        ancestry: unit.ancestry.name,
        experience: unit.experience.name,
        equipment: unit.equipment.name,
        unit_type: unit.type.name,
        size_level: unit.size.sizeLevel,
        casualties: unit.casualties,
        mercenary: unit.isMercenary
    })

    // FETCH FUNCTIONS

    async function fetchUnitAncestries(): Promise<void>{
        if(!ancestries){
            setLoading(true);

            try{
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/units/ancestries`);
                
                if (!res.ok) {
                    throw new Error("There was a problem fetching this data");
                }

                const data = await res.json();
                console.log(data)
                setAncestries(data.ancestries)
            } catch (err) {
                console.log(err.message)
            } finally {
                setLoading(false);
            }

        }
    }

    useEffect(() => {
        if(!ancestries){
            fetchUnitAncestries();
        }
    }, [ancestries])

    return <main className={styles.main}>
        <section className={styles.selectionContainer}>
            <section className={styles.form}>
                <p>name:</p>
                <label htmlFor="ancestry-select">ancestry:</label>
                <select name="ancestries" id="ancestry-select">
                    {ancestries?.map((ancestry, index) =>
                        <option key={index} value={ancestry.name}>{ancestry.name}</option>
                    )}
                </select>
                <p>experience:</p>
                <p>equipment:</p>
                <p>size:</p>
                <p>mercenary?:</p>
                <p>stronghold:</p>
                <p>name:</p>
            </section>
        </section>
        <section className={styles.cardContainer}>
            <UnitCard unit={unit}/>
        </section>
    </main>
}