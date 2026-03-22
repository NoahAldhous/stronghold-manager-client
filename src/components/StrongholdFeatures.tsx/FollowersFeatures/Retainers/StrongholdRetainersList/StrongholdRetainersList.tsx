"use client";
import { StrongholdRetainers } from "types";
import styles from "./styles.module.scss";
import { useEffect, useState } from "react";
import StrongholdRetainerCard from "../StrongholdRetainerCard/StrongholdRetainerCard";

interface StrongholdArtisansListProps {
    strongholdId: string;
}

export default function StrongholdRetainersList({strongholdId}: StrongholdArtisansListProps){

    //set empty array as state
    const [strongholdRetainers, setStrongholdRetainers] = useState<StrongholdRetainers | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    //fetch list of retainers by strongholdId
    async function fetchStrongholdRetainers(): Promise<void> {
        setLoading(true);
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/strongholds/retainers/${strongholdId}`
            );

            if(!res.ok) {
                throw new Error("There was a problem fetching Stronghold Retainers");
            }

            const data = await res.json();
            setStrongholdRetainers(data.retainers);
        } catch (err) {
            console.log(err.message)
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if(!strongholdRetainers){
            fetchStrongholdRetainers();
        }
    },[strongholdRetainers])

    return <div>
        {
            strongholdRetainers?.map((retainer) => (
                <StrongholdRetainerCard retainer={retainer}/>
            ))
        }
    </div>
}