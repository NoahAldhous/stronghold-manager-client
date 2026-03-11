"use client";
import { useMemo } from "react";
import styles from "./styles.module.scss";
import Image from "next/image";
import React from "react";
import { ArtisanShop } from "types";

interface ArtisanCardProps {
    artisan: ArtisanShop;
    level: number;
    setContextualPanelType: React.Dispatch<React.SetStateAction<{type: string, subtype:string}>>;
}

const ArtisanCard = React.memo(function ArtisanCard({ artisan, setContextualPanelType, level }:ArtisanCardProps){

    function handleClick(){
        setContextualPanelType({
            type: "artisan",
            subtype: artisan.artisan_name
        })
    }

    return <div className={`${styles.card} ${level == 0 ? styles.disabled : ""}`}>
        <section className={styles.content} onClick={handleClick}>
            <div className={styles.imageContainer}>
                <Image 
                    src={`/images/artisans/${artisan.artisan_name}.svg`} 
                    alt={"artisan icon"} 
                    fill
                    loading="eager"
                />
            </div>
            <section className={styles.textContainer}>
                <p className={styles.text}>{artisan.artisan_name}&apos;s {artisan.shop_name}</p>
                <p className={styles.text}>level {level}</p>
            </section>
        </section>
    </div>
});

export default ArtisanCard;