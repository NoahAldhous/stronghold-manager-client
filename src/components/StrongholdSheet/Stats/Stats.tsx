import LoadingCard from "components/LoadingUI/LoadingCard/LoadingCard";
import styles from "./styles.module.scss";
import type { Stronghold } from "types";
import { JSX } from "react";

interface StatsProps {
  loading: boolean;
  stats: Stronghold["stats"] | null;
}

export default function Stats({
  loading,
  stats
}: StatsProps): JSX.Element {

  function renderStat(stat: "toughness" | "size" | "morale_bonus") {
    
    let info:
      | {
          statName: string;
          statNumber: number | null;
          statMod: string | null;
        }
      | undefined;

      switch (stat) {
        case "toughness":
          info = {
            statName: "toughness",
            statNumber: stats?.toughness ?? null,
            statMod: null,
          };
          break;
        case "size":
          info = {
            statName: "size",
            statNumber: stats?.size ?? null,
            statMod: "d",
          };
          break;
        case "morale_bonus":
          info = {
            statName: "morale",
            statNumber: stats?.morale_bonus ?? null,
            statMod: "+",
          };
          break;
      };

    return <div className={styles.statElement}>
        <section className={styles.numberContainer}>
            <div className={styles.diamond}>
              <div className={styles.diamondText}>
                <div>{info?.statMod}</div>
                <div>{info?.statNumber}</div>
              </div>
            </div>
        </section>
        <div className={styles.statName}>{info?.statName}</div>
    </div>
  }

  return (
    <section>
      {loading || !stats ? (
        <section className={styles.statsContainer}>
          <LoadingCard />
        </section>
      ) : (
        <section className={styles.statsContainer}>
          <section className={styles.cardHeader}>stats</section>
          {renderStat("toughness")}
          {renderStat("size")}
          {renderStat("morale_bonus")}
        </section>
      )}
    </section>
  );
}
