"use client";
import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import { StrongholdRetainer } from "types";
import StrongholdRetainerCard from "components/StrongholdFeatures.tsx/FollowersFeatures/Retainers/StrongholdRetainerCard/StrongholdRetainerCard";

interface RetainerContextualPanelProps {
    contextualPanelType: { type: string; subtype: string};
}

export default function RetainerContextualPanel(
    {contextualPanelType}: RetainerContextualPanelProps
){
    const [loading, setLoading] = useState<boolean>(false);
    const [retainer, setRetainer] = useState<StrongholdRetainer | null>(null);

        //fetch list of retainers by strongholdId
        async function fetchStrongholdRetainer(): Promise<void> {
          setLoading(true);
          try {
            const res = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/strongholds/retainers/${contextualPanelType.subtype}`
            );
      
            if (!res.ok) {
              throw new Error("There was a problem fetching Stronghold Retainers");
            }
      
            const data = await res.json();
            setRetainer(data.retainer);
          } catch (err) {
            console.log(err.message);
          } finally {
            setLoading(false);
          }
        }

        useEffect(() => {
            fetchStrongholdRetainer();
        }, [contextualPanelType.subtype])

    return <div>
        {
            (!loading && retainer) ?
            <StrongholdRetainerCard
                retainer={retainer}
            />
            : null
        }
    </div>
}