"use client";
import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import { Units } from "types";

interface StrongholdFeaturesType {
    userId: string | null;
    strongholdId: string ;
    activeButton : {
        category: string,
        subCategory: string
    },
    strongholdActions: {
        name: string,
        description: string
    }[] | null,
    demesneEffects: {
        description: string
    }[] | null,
    typeBenefits: {
        title: string,
        description: string
    }[] | null,
    classFeatureImprovement: {
        name: string,
        description: string,
        restriction: string
    } | null,
    strongholdType: string | null,
    characterClass: string | null;
}

export default function StrongholdFeatures({
    userId,
    strongholdId,
    activeButton, 
    strongholdActions,
    demesneEffects,
    typeBenefits,
    classFeatureImprovement,
    strongholdType,
    characterClass
    }:StrongholdFeaturesType){

    const [unitsList, setUnitsList] = useState<Units | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    async function fetchUnits(): Promise<void>{
        if(!unitsList) {
            setLoading(true);

            if(userId){
                try {
                    const res = await fetch(
                        `${process.env.NEXT_PUBLIC_API_URL}/units/?user_id=${userId}&stronghold_id=${strongholdId}`
                    );
    
                    if(!res.ok) {
                        throw new Error("There was a problem fetching this Stronghold's units. Pleas try again")
                    }
    
                    const data = await res.json();
                    setUnitsList(data.units);
                    console.log(data.units);
                } catch (err) {
                    console.log(err.message);
                } finally {
                    setLoading(false);
                }
            }
        }
    }

    useEffect(() => {
        if (activeButton.category === "units") {
            fetchUnits();
        }
    }, [activeButton.category])

    function renderText(){
        switch(activeButton.category) {
            case "stronghold":
                switch(activeButton.subCategory){
                    case "all":
                        return <>
                            <p className={styles.rulesHeader}>stronghold actions</p>
                            <p className={styles.rulesText}>{`On initiative count 20 (losing initiative ties), the ${characterClass} can take a stronghold action with one of the following effects. They must be in the same hex or province as their stronghold and cannot use the same effect again until after a short or long rest.`}</p>
                            {strongholdActions?.map((action, index) =>
                                <div key={index} className={styles.textItem}>
                                    <p className={styles.itemName}>{action.name}</p>
                                    <p className={styles.itemInfo}>{action.description}</p>
                                </div>
                            )}
                            <p className={styles.rulesHeader}>demesne effects</p>
                            <p className={styles.rulesText}>{`The ${characterClass}'s stronghold creates one or more of the following effects at the GM's discretion.`}</p>
                            {demesneEffects?.map((effect, index) =>
                                <div key={index} className={styles.textItem}>
                                    <p className={styles.itemInfo}>{effect.description}</p>
                                </div>
                            )}
                            <p className={styles.rulesHeader}>{strongholdType} benefits</p>
                            { typeBenefits?.map((feature, index) =>
                                <div key={index} className={styles.textItem}>
                                    <p className={styles.itemName}>{feature.title}</p>
                                    <p className={styles.itemInfo}>{feature.description}</p>
                                </div>
                            )}
                            <p className={styles.rulesHeader}>class feature improvement</p>
                            <div className={styles.textItem}>
                            <p className={styles.itemName}>{classFeatureImprovement?.name}</p>
                            <p className={styles.itemInfo}>{classFeatureImprovement?.description}</p>
                            <p className={styles.itemInfo}>{classFeatureImprovement?.restriction}</p>
                        </div>
                        </>
                    case "stronghold actions":
                        return <>
                            <p className={styles.rulesText}>{`On initiative count 20 (losing initiative ties), the ${characterClass} can take a stronghold action with one of the following effects. They must be in the same hex or province as their stronghold and cannot use the same effect again until after a short or long rest.`}</p>
                            {strongholdActions?.map((action, index) =>
                                <div key={index} className={styles.textItem}>
                                    <p className={styles.itemName}>{action.name}</p>
                                    <p className={styles.itemInfo}>{action.description}</p>
                                </div>
                            )}
                        </>
                    case "demesne effects":
                        return <>
                            <p className={styles.rulesText}>{`The ${characterClass}'s stronghold creates one or more of the following effects at the GM's discretion.`}</p>
                            {demesneEffects?.map((effect, index) =>
                                <div key={index} className={styles.textItem}>
                                    <p className={styles.itemInfo}>{effect.description}</p>
                                </div>
                            )}
                        </>
                    case `${strongholdType} benefits`:
                        return (typeBenefits?.map((feature, index) =>
                            <div key={index} className={styles.textItem}>
                                <p className={styles.itemName}>{feature.title}</p>
                                <p className={styles.itemInfo}>{feature.description}</p>
                            </div>
                        ))
                    case "class feature improvement":
                        return <div className={styles.textItem}>
                            <p className={styles.itemName}>{classFeatureImprovement?.name}</p>
                            <p className={styles.itemInfo}>{classFeatureImprovement?.description}</p>
                            <p className={styles.itemInfo}>{classFeatureImprovement?.restriction}</p>
                        </div>
                }
            case "units":
                switch(activeButton.subCategory){
                    case "list":
                        return <div className={styles.unitContainer}>
                            <section className={styles.unitCategories}>
                                <div className={styles.largeCategory}>name</div>
                                <div className={styles.mediumCategory}>ancestry</div>
                                <div className={styles.mediumCategory}>experience</div>
                                <div className={styles.mediumCategory}>equipment</div>
                                <div className={styles.smallCategory}>type</div>
                                <div className={styles.smallCategory}>size</div>
                            </section>
                            <section className={styles.unitList}>
                                {unitsList?.map((unit) => (
                                    <div className={styles.unit}>
                                        <p className={styles.largeCategory}>{unit.name}</p>
                                        <p className={styles.mediumCategory}>{unit.ancestry.name}</p>
                                            <p className={styles.mediumCategory}>{unit.experience.name}</p>  
                                            <p className={styles.mediumCategory}>{unit.equipment.name} </p>
                                            <p className={styles.smallCategory}>{unit.type.name}</p>
                                            <p className={styles.smallCategory}>{unit.size.unitSize}</p>
                                    </div>
                                )
                                )}
                            </section>
                        </div>;
                }
            case "artisans":
                return <p>artisans</p>;
            case "followers":
                return <p>followers</p>;
            default:
                return <p>nothing selected!</p>
        }
    }

    return <section className={styles.featuresContainer}>
        {renderText()}
    </section>
}