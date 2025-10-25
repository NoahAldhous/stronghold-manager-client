"use client";
import UnitCard from "components/UnitCard/UnitCard";
import styles from "./styles.module.scss";
import { useEffect, useState } from 'react';
import type { Unit, Ancestry, ExperienceLevel } from "types";
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
    const [experienceLevels, setExperienceLevels] = useState<ExperienceLevel[] | null>(null)

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

    // FUNCTIONS

    function handleSelectChange(objectKey: string, objectValue: string){
        setUnit({
            ...unit, 
            [objectKey]: {
                ...unit[objectKey],
                name: objectValue
            }})
    }


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

    async function fetchUnitExperience(): Promise<void>{
        if(!ancestries){
            setLoading(true);

            try{
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/units/experience_levels`);
                
                if (!res.ok) {
                    throw new Error("There was a problem fetching this data");
                }

                const data = await res.json();
                console.log(data)
                setExperienceLevels(data.experience_levels)
            } catch (err) {
                console.log(err.message)
            } finally {
                setLoading(false);
            }

        }
    }

    // USE EFFECT

    useEffect(() => {
        if(!ancestries){
            fetchUnitAncestries();
            fetchUnitExperience();
        }
    }, [ancestries])

    return <main className={styles.main}>
        <section className={styles.selectionContainer}>
            <section className={styles.form}>
                <p>name:</p>
                <label htmlFor="ancestry-select">ancestry:</label>
                <select onChange={(e) => handleSelectChange("ancestry", e.target.value)} name="ancestries" id="ancestry-select">
                    <option value="select ancestry">select ancestry</option>
                    {ancestries?.map((ancestry, index) =>
                        <option key={index} value={ancestry.name}>{ancestry.name}</option>
                    )}
                </select>
                <p>experience:</p>
                <label htmlFor="experience-select">experience:</label>
                <select onChange={(e) => handleSelectChange("experience", e.target.value)} name="experience" id="experience-select">
                    <option value="select experience level">select experience level</option>
                    {experienceLevels?.map((experienceLevel, index) =>
                        <option key={index} value={experienceLevel.levelName}>{experienceLevel.levelName}</option>
                    )}
                </select>
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