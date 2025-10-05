"use client";

import { useEffect, useState } from "react";
import ModalBackground from "../ModalBackground/ModalBackground";
import styles from "./styles.module.scss";
import LoadingCard from "components/LoadingUI/LoadingCard/LoadingCard";
import LoadingBar from "components/LoadingUI/LoadingBar/LoadingBar";

export default function UpgradeStrongholdModal({
  visible,
  setVisible,
  setStronghold,
  stronghold,
  level,
  updateClassFeatureImprovementUses
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [updating, setUpdating] = useState<boolean>(false);

  const [stats, setStats] = useState<{
    costToUpgrade: number;
    fortificationBonus: number;
    size: number;
    level: number;
    timeToUpgrade: number;
    toughness: number;
    type: string;
  } | null>(null);

  async function fetchStats() {
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/strongholds/types/stats/${
          stronghold.stronghold_type
        }/${stronghold.stronghold_level + 1}`
      );

      if (!res.ok) {
        throw new Error("Could not fetch data");
      }

      const data = await res.json();
      setStats(data.data.stats);
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function updateStrongholdLevel(newLevel) {
    setUpdating(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/strongholds/level/${stronghold?.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            level: newLevel,
          }),
        }
      );

      if (!res.ok) {
        throw new Error(
          "The application encountered an error trying to update this value"
        );
      }
      const data = await res.json();
      console.log(data.message);
    } catch (err) {
      console.log(err.message);
    } finally {
      setStronghold({ ...stronghold, stronghold_level: level + 1 });
      updateClassFeatureImprovementUses(stronghold?.stronghold_level + 1)
      setUpdating(false);
    }
  }

  function handleUpgrade() {
    updateStrongholdLevel(stronghold?.stronghold_level + 1);
  }

  useEffect(() => {
    fetchStats();
  }, [stronghold?.stronghold_level]);

  return visible ? (
    <ModalBackground>
      {loading && !stats ? (
        <section className={styles.modalMenu}>
          <LoadingCard />
        </section>
      ) : (
        <section className={styles.modalMenu}>
          <section className={styles.cardHeader}>upgrade stronghold</section>
          {updating ? (
            <section className={`${styles.textContainer} ${styles.loading}`}>
                <p>Loading...</p>
                <LoadingBar colour="dark"/>
            </section>
          ) : (
            <section className={styles.textContainer}>
              <p className={styles.headerText}>
                Level {stronghold?.stronghold_level}{" "}
                <span className={styles.arrow}>{`-\>`}</span>{" "}
                <span className={styles.newStat}>Level {stats?.level}</span>
              </p>
              <p className={styles.text}>
                Size:
                <span>
                  {stronghold?.stats?.size}{" "}
                  <span className={styles.arrow}>{`-\>`}</span>{" "}
                  <span className={styles.newStat}>{stats?.size}</span>
                </span>
              </p>
              <p className={styles.text}>
                Fortification Bonus:
                <span>
                  +{stronghold?.stats?.morale_bonus}{" "}
                  <span className={styles.arrow}>{`-\>`}</span>{" "}
                  <span className={styles.newStat}>
                    +{stats?.fortificationBonus}
                  </span>
                </span>
              </p>
              <p className={styles.text}>
                Toughness:
                <span>
                  {stronghold?.stats?.toughness}{" "}
                  <span className={styles.arrow}>{`-\>`}</span>{" "}
                  <span className={styles.newStat}>{stats?.toughness}</span>
                </span>
              </p>
              <br />
              <p className={styles.text}>
                cost to upgrade:<span>{stats?.costToUpgrade}gp</span>
              </p>
              <p className={styles.text}>
                time to upgrade:<span>{stats?.timeToUpgrade} days</span>
              </p>
            </section>
          )}
          <section className={styles.buttonContainer}>
            <button
              disabled={updating}
              onClick={() => setVisible(false)}
              className={styles.button}
            >
              cancel
            </button>
            <button
              disabled={updating || stronghold?.stronghold_level >= 5}
              onClick={handleUpgrade}
              className={styles.button}
            >
              upgrade
            </button>
          </section>
        </section>
      )}
    </ModalBackground>
  ) : null;
}
