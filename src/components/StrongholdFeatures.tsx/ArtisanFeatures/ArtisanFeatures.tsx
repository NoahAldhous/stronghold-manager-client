"use client";
import { useEffect, useState } from "react";
import ArtisanCard from "./ArtisanCard/ArtisanCard";
import styles from "./styles.module.scss";
import { ArtisanShops } from "types";

interface ArtisanFeaturesType {
    strongholdId: string;
    setContextualPanelType: React.Dispatch<React.SetStateAction<{type: string, subtype:string}>>;
}

export default function ArtisanFeatures({strongholdId, setContextualPanelType}: ArtisanFeaturesType){

    const [artisanShopsList, setArtisanShopsList] = useState<ArtisanShops| null>(null);
    const [strongholdArtisansList, setStrongholdArtisansList] = useState()
    const [loading, setLoading] = useState<boolean>(false)

    async function fetchArtisanShops(): Promise<void> {
        setLoading(true)
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/strongholds/artisans/shops`
            );

            if (!res.ok) {
                throw new Error(
                    "There was a problem fetching Artisan Shops."
                );
            }

            const data = await res.json();
            setArtisanShopsList(data.artisanShops)
            console.log(data.artisanShops)

        } catch (err) {
            console.log(err.message)
        } finally {
            setLoading(false);
        }
    }  

    async function fetchStrongholdArtisans(): Promise<void> {
        if(!strongholdArtisansList) {
            setLoading(true)
            if(strongholdId){
                try {
                    const res = await fetch(
                        `${process.env.NEXT_PUBLIC_API_URL}/strongholds/artisans/${strongholdId}`
                    );

                    if (!res.ok) {
                        throw new Error(
                            "There was a problem fetching this Stronghold's list of Artisans."
                        );
                    }

                    const data = await res.json();
                    setStrongholdArtisansList(data.artisans);
                    console.log(data.artisans)
                } catch (err) {
                    console.log(err.message);
                } finally {
                    setLoading(false);
                }
            }
        }
    }

    useEffect(() => {
        if(!artisanShopsList){
            fetchArtisanShops();
        }
        if(!strongholdArtisansList){
            fetchStrongholdArtisans();
        }
    }, [artisanShopsList])

    return <div>
        {loading || !artisanShopsList ?
        <p>loading</p>
        : 
        <div className={styles.cardContainer}>
            {artisanShopsList?.map((item, index) => (
                <ArtisanCard 
                    key={index} 
                    artisan={item} 
                    level={strongholdArtisansList?.[item.artisan_name]}
                    setContextualPanelType={setContextualPanelType}
                />
            )
            )}
        </div>    
    }
    </div>
}