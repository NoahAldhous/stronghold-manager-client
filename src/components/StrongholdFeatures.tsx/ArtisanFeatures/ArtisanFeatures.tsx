"use client";
import { useEffect, useState } from "react";
import ArtisanCard from "./ArtisanCard/ArtisanCard";
import styles from "./styles.module.scss";
import { ArtisanShop, ArtisanShops, StrongholdArtisans } from "types";

interface ArtisanFeaturesType {
    strongholdId: string;
    setContextualPanelType: React.Dispatch<React.SetStateAction<{type: string, subtype:string}>>;
    needToUpdate: {
        artisans: boolean
      }
      setNeedToUpdate: React.Dispatch<
        React.SetStateAction<{artisans: boolean}>
      >;
}

type ArtisanShopWithLevel = ArtisanShop & {
    level: number
}

export default function ArtisanFeatures({strongholdId, setContextualPanelType, needToUpdate, setNeedToUpdate}: ArtisanFeaturesType){

    const [artisanShopsList, setArtisanShopsList] = useState<ArtisanShops| null>(null);
    const [strongholdArtisansList, setStrongholdArtisansList] = useState<StrongholdArtisans | null>()
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

    useEffect(() => {
        if(!artisanShopsList){
            fetchArtisanShops();
        }

        if(!strongholdArtisansList || needToUpdate.artisans){
            fetchStrongholdArtisans();

            setNeedToUpdate(prev => {
                if (!prev.artisans) return prev;
                return { ...prev, artisans: false };
            });
        }
    }, [artisanShopsList, needToUpdate])

    function findArtisanShopLevel(artisan){
        const strongholdArtisan = strongholdArtisansList?.find(strongholdArtisan => strongholdArtisan.name === artisan);
        return (strongholdArtisan ? strongholdArtisan.shop.level : 0)
    }

    const localListOfArtisans = artisanShopsList?.map( artisan => ({
        ...artisan,
        level: findArtisanShopLevel(artisan.artisan_name)
    }))

    return <div>
        {loading || !localListOfArtisans ?
        <p>loading</p>
        : 
        <div className={styles.cardContainer}>
            {localListOfArtisans?.map((item) => (
                <ArtisanCard 
                    key={item.artisan_name} 
                    artisan={item} 
                    setContextualPanelType={setContextualPanelType}
                />
            )
            )}
        </div>    
    }
    </div>
}