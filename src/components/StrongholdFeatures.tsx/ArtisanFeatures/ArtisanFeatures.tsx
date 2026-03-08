"use client";
import { useEffect, useState } from "react";

interface ArtisanFeaturesType {
    strongholdId: string;
}

export default function ArtisanFeatures({strongholdId}: ArtisanFeaturesType){

    const [artisansList, setArtisansList] = useState()
    const [loading, setLoading] = useState<boolean>(false)

    async function fetchArtisans(): Promise<void> {
        if(!artisansList) {
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
                    setArtisansList(data.artisans);
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
        if(!artisansList){
            fetchArtisans();
        }
    }, [artisansList])

    return <div>
        {loading || !artisansList ?
        <p>loading</p>
        : 
        <div>
            artisans:
            {Object.entries(artisansList).map(([key, value]) => (
                <div key={key}>
                    <span>{key}</span>: <span>{value}</span>
                </div>
            )
            )}
        </div>    
    }
    </div>
}