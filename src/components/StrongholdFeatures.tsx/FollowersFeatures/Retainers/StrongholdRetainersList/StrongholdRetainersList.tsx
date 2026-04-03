"use client";
import { StrongholdRetainers } from "types";
import styles from "./styles.module.scss";
import { useEffect, useState } from "react";
import StrongholdRetainerCard from "../StrongholdRetainerCard/StrongholdRetainerCard";

interface StrongholdArtisansListProps {
  strongholdId: string;
  setContextualPanelType: React.Dispatch<
  React.SetStateAction<{ type: string; subtype: string }>
>;
}

export default function StrongholdRetainersList({
  strongholdId,
  setContextualPanelType
}: StrongholdArtisansListProps) {
  //set empty array as state
  const [strongholdRetainers, setStrongholdRetainers] =
    useState<StrongholdRetainers | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  //fetch list of retainers by strongholdId
  async function fetchStrongholdRetainers(): Promise<void> {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/strongholds/retainers/all/${strongholdId}`
      );

      if (!res.ok) {
        throw new Error("There was a problem fetching Stronghold Retainers");
      }

      const data = await res.json();
      setStrongholdRetainers(data.retainers);
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!strongholdRetainers) {
      fetchStrongholdRetainers();
    }
  }, [strongholdRetainers]);

  function handleClick(retainerId){
    setContextualPanelType({
      type: "retainer",
      subtype: retainerId
    })
  }

  return (
      <section className={styles.retainerListContainer}>
        <section className={styles.retainerCategories}>
          <p className={`${styles.large} ${styles.category}`}>name</p>
          <p className={`${styles.medium} ${styles.category}`}>title</p>
          <p className={`${styles.small} ${styles.category}`}>AC</p>
          <p className={`${styles.small} ${styles.category}`}>speed</p>
          <p className={`${styles.medium} ${styles.category}`}>health level</p>
        </section>
        <section className={styles.retainerList}>    
            {strongholdRetainers?.map((retainer) => (
            // <StrongholdRetainerCard key={retainer.id} retainer={retainer}/>
            <div key={retainer.id} className={styles.retainerRow} onClick={() => handleClick(retainer.id.toString())}>
                <p className={`${styles.large} ${styles.category}`}>{retainer.name}</p>
                <p className={`${styles.medium} ${styles.category}`}>{retainer.title}</p>
                <p className={`${styles.small} ${styles.category}`}>{retainer.armourClass.value}</p>
                <p className={`${styles.small} ${styles.category}`}>{retainer.ancestry.speed} ft.</p>
                <p className={`${styles.medium} ${styles.category}`}>{(retainer.level - retainer.healthLevelsLost)}/{retainer.level}</p>
            </div>
            ))}
        </section>
      </section>
  );
}
