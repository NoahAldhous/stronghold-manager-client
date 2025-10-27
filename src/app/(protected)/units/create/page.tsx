"use client";
import UnitCard from "components/UnitCard/UnitCard";
import styles from "./styles.module.scss";
import { useEffect, useState } from 'react';
import type { Unit, Ancestry, ExperienceLevel, EquipmentLevel, SizeLevel, UnitType } from "types";
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

    const [ancestries, setAncestries] = useState<Ancestry[] | null>(null);
    const [experienceLevels, setExperienceLevels] = useState<ExperienceLevel[] | null>(null);
    const [equipmentLevels, setEquipmentLevels] = useState<EquipmentLevel[] | null>(null);
    const [sizeLevels, setSizeLevels] = useState<SizeLevel[] | null>(null);
    const [types, setTypes] = useState<UnitType[] | null>(null);

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

    function handleSelectChange(objectKey: string, objectValue: string | number){

        if( objectKey === "size"){
            setUnit({ 
                ...unit, 
                size: {
                    ...unit.size,
                    unitSize: Number(objectValue)
                }
            })
        } else {
            setUnit({
                ...unit, 
                [objectKey]: {
                    ...unit[objectKey],
                    name: objectValue
                }})
        }

    }

    function setInitialUnitValues(){
        setUnit({
            ...unit,
            ancestry: {
                ...unit.ancestry,
                name: "human"
            },
            experience: {
                ...unit.experience,
                name: "green"
            },
            equipment: {
                ...unit.equipment,
                name: "light"
            },
            type: {
                ...unit.type,
                name: "infantry"
            },
            size: {
                ...unit.size,
                unitSize: 4 
            }
        })
    }

    function handleUnitNameChange(e: { target: { value: string } }) {
        setUnit({
            ...unit,
            name: e.target.value
        })
    }

    function handleMercenaryChange(e: { target: {checked: boolean } }) {
        setUnit({
            ...unit,
            isMercenary: e.target.checked
        })
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
        if(!experienceLevels){
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

    async function fetchUnitEquipment(): Promise<void>{
        if(!equipmentLevels){
            setLoading(true);

            try{
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/units/equipment_levels`);
                
                if (!res.ok) {
                    throw new Error("There was a problem fetching this data");
                }

                const data = await res.json();
                console.log(data)
                setEquipmentLevels(data.equipment_levels)
            } catch (err) {
                console.log(err.message)
            } finally {
                setLoading(false);
            }

        }
    }

    async function fetchUnitTypes(): Promise<void>{
        if(!types){
            setLoading(true);

            try{
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/units/types`);
                
                if (!res.ok) {
                    throw new Error("There was a problem fetching this data");
                }

                const data = await res.json();
                console.log(data)
                setTypes(data.types)
            } catch (err) {
                console.log(err.message)
            } finally {
                setLoading(false);
            }

        }
    }

    async function fetchUnitSizes(): Promise<void>{
        if(!sizeLevels){
            setLoading(true);

            try{
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/units/size_levels`);
                
                if (!res.ok) {
                    throw new Error("There was a problem fetching this data");
                }

                const data = await res.json();
                console.log(data)
                setSizeLevels(data.sizes)
            } catch (err) {
                console.log(err.message)
            } finally {
                setLoading(false);
            }

        }
    }

    // USE EFFECT

    useEffect(() => {
        if(!ancestries || !experienceLevels || !equipmentLevels || !sizeLevels || !types){
            fetchUnitAncestries();
            fetchUnitExperience();
            fetchUnitEquipment();
            fetchUnitSizes();
            fetchUnitTypes();
        } else if(!loading){
            setInitialUnitValues();
        }
    }, [ancestries, experienceLevels, equipmentLevels, sizeLevels, types])

    useEffect(() => {
        setUnit(prev => {
            let next = {...prev};

            if (prev.ancestry.name !=="") {
                const newAncestry = ancestries?.find(item => item.name === prev.ancestry.name)
                next.ancestry = { 
                    ...next.ancestry, 
                    attackBonus: newAncestry?.attackBonus ?? 0,
                    powerBonus: newAncestry?.powerBonus ?? 0,
                    defenseBonus: newAncestry?.defenseBonus ?? 0,
                    toughnessBonus: newAncestry?.toughnessBonus ?? 0,
                    moraleBonus: newAncestry?.moraleBonus ?? 0 
                }
                next.traits = newAncestry?.traits ?? []
            }

            if (prev.experience.name !== ""){
                const newExperienceLevel = experienceLevels?.find(item => item.levelName == prev.experience.name)
                next.experience = {
                    ...next.experience,
                    attackBonus: newExperienceLevel?.attackBonus ?? 0,
                    toughnessBonus: newExperienceLevel?.toughnessBonus ?? 0,
                    moraleBonus: newExperienceLevel?.moraleBonus ?? 0
                }
            }

            if (prev.equipment.name !==""){
                const newEquipmentLevel = equipmentLevels?.find(item => item.levelName == prev.equipment.name)
                next.equipment = {
                    ...next.equipment,
                    defenseBonus: newEquipmentLevel?.defenseBonus ?? 0,
                    powerBonus: newEquipmentLevel?.powerBonus ?? 0
                }
            }

            if (prev.type.name !==""){
                if (prev.type.name == "levies") {
                    next.equipment.name = "levies"
                    next.experience.name = "levies"
                } else if (prev.equipment.name == "levies" || prev.experience.name == "levies"){
                    next.equipment.name = "light"
                    next.experience.name = "green"
                }
                const newType = types?.find(item => item.name == prev.type.name)
                next.type = {
                    ...next.type,
                    attackBonus: newType?.attackBonus ?? 0,
                    powerBonus: newType?.powerBonus ?? 0,
                    defenseBonus: newType?.defenseBonus ?? 0,
                    toughnessBonus: newType?.toughnessBonus ?? 0,
                    moraleBonus: newType?.moraleBonus ?? 0,
                    costModifier: newType?.costModifier ?? 0
                }
                next.traits = [...next.traits, ...newType?.traits ?? []]
            }
            if (prev.size.unitSize !== 0){
                const newSize = sizeLevels?.find(item => item.size == prev.size.unitSize)
                next.size = {
                    ...next.size,
                    costModifier: newSize?.costModifier ?? 0,
                    sizeLevel: Number(newSize?.levelName) ?? 0,
                }
            }
            return next;
        });
    }, [unit.ancestry.name, unit.experience.name, unit.equipment.name, unit.type.name, unit.size.unitSize])

    return <main className={styles.main}>
        <section className={styles.selectionContainer}>
            <section className={styles.form}>
                <section className={styles.cardHeader}>create a unit</section>
                <section className={styles.formSection}>
                    <p className={styles.label}>name:</p>
                    <input
                        className={styles.input}
                        placeholder="name your unit..."
                        type="text"
                        maxLength={40}
                        name="unit_name" 
                        value={unit.name} 
                        onChange={handleUnitNameChange}
                    />
                </section>
                <section className={styles.formSection}>
                    <label className={styles.label} htmlFor="ancestry-select">ancestry:</label>
                    <select value={unit.ancestry.name} className={styles.select} onChange={(e) => handleSelectChange("ancestry", e.target.value)} name="ancestries" id="ancestry-select">
                        {ancestries?.map((ancestry, index) =>
                            <option selected={ancestry.name == unit.ancestry.name} key={index} value={ancestry.name}>{ancestry.name}</option>
                        )}
                    </select>
                </section>
                <section className={styles.formSection}>
                    <label className={styles.label} htmlFor="experience-select">experience:</label>
                    <select disabled={unit.type.name == "levies"} value={unit.experience.name} className={styles.select} onChange={(e) => handleSelectChange("experience", e.target.value)} name="experience" id="experience-select">
                        {experienceLevels?.map((experienceLevel, index) =>
                            <option selected={experienceLevel.levelName == unit.experience.name} key={index} value={experienceLevel.levelName}>{experienceLevel.levelName}</option>
                        )}
                    </select>
                </section>
                <section className={styles.formSection}>
                    <label className={styles.label} htmlFor="equipment-select">equipment:</label>
                    <select disabled={unit.type.name == "levies"} value={unit.equipment.name} className={styles.select} onChange={(e) => handleSelectChange("equipment", e.target.value)} name="equipment" id="equipment-select">
                        {equipmentLevels?.map((equipmentLevel, index) =>
                            <option selected={equipmentLevel.levelName == unit.equipment.name} key={index} value={equipmentLevel.levelName}>{equipmentLevel.levelName}</option>
                        )}
                    </select>
                </section>
                <section className={styles.formSection}>
                    <label className={styles.label} htmlFor="type-select">type:</label>
                    <select value={unit.type.name} className={styles.select} onChange={(e) => handleSelectChange("type", e.target.value)} name="type" id="type-select">
                        {types?.map((type, index) =>
                            <option selected={type.name == unit.type.name} key={index} value={type.name}>{type.name}</option>
                        )}
                    </select>
                </section>
                <section className={styles.formSection}>
                    <label className={styles.label} htmlFor="size-select">size:</label>
                    <select value={unit.size.unitSize} className={styles.select} onChange={(e) => handleSelectChange("size", e.target.value)} name="size" id="size-select">
                        {sizeLevels?.map((sizeLevel, index) =>
                            <option selected={sizeLevel.size == unit.size.unitSize} key={index} value={sizeLevel.size}>{sizeLevel.size}</option>
                        )}
                    </select>
                </section>
                <section className={styles.formSection}>
                    <p className={styles.label}>mercenary?:</p>
                    <input className={styles.input} onChange={handleMercenaryChange} type="checkbox"/>
                </section>
                <p>stronghold:</p>
            </section>
        </section>
        <section className={styles.cardContainer}>
            <UnitCard unit={unit}/>
        </section>
    </main>
}