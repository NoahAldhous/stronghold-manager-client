"use client";
import { useState } from "react";
import styles from "./styles.module.scss";
import Image from "next/image";

export default function ArtisanCard({artisan}){

    return <div className={styles.card}>
        <div className={styles.imageContainer}>
            <Image 
                src={`/images/artisans/${artisan.artisan_name}.svg`} 
                alt={"artisan icon"} 
                fill
                loading="eager"
            />
        </div>
        <p className={styles.text}>{artisan.artisan_name}'s {artisan.shop_name}</p>
    </div>
}