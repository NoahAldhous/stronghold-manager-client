"use client";
import UnitCard from "components/UnitCard/UnitCard";
import styles from "./styles.module.scss";
import { useState } from 'react';
import type { Unit } from "types";
import { useAuth } from "contexts/AuthContext";

export default function Page(){

    const { userId } = useAuth();

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

    return <main className={styles.main}>
        <section className={styles.selectionContainer}>hello world!</section>
        <section className={styles.cardContainer}>
            <UnitCard unit={unit}/>
        </section>
    </main>
}