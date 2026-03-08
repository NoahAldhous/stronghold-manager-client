"use client";
import { useState } from "react";
import styles from "./styles.module.scss";
import Image from "next/image";

export default function ArtisanCard({artisan, level}){

    return <div className={`${styles.card} ${level == 0 ? styles.disabled : ""}`}>
        <section className={styles.content}>
            <div className={styles.imageContainer}>
                <Image 
                    src={`/images/artisans/${artisan.artisan_name}.svg`} 
                    alt={"artisan icon"} 
                    fill
                    loading="eager"
                />
            </div>
            <section className={styles.textContainer}>
                <p className={styles.text}>{artisan.artisan_name}'s {artisan.shop_name}</p>
                <p className={styles.text}>level {level}</p>
            </section>
        </section>
    </div>
}