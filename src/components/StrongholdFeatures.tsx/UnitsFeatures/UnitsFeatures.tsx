"use client";
import { useEffect, useState } from "react";
import { Units, Stronghold } from "types";
import styles from "./styles.module.scss";
import { StatsCalculator } from "lib/StatsCalculator";

interface UnitsFeaturesProps {
  userId: string | null;
  stronghold: Stronghold;
  strongholdId: string;
  activeButton: {
    category: string;
    subCategory: string;
  };
}

export default function UnitsFeatures({
  userId,
  stronghold,
  strongholdId,
  activeButton,
}: UnitsFeaturesProps) {
  const [unitsList, setUnitsList] = useState<Units | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  async function fetchUnits(): Promise<void> {
    if (!unitsList) {
      setLoading(true);
      console.log("fetching units...");

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/units/?user_id=${userId}&stronghold_id=${strongholdId}`
        );

        if (!res.ok) {
          throw new Error(
            "There was a problem fetching this Stronghold's units. Pleas try again"
          );
        }

        const data = await res.json();
        setUnitsList(data.units);
      } catch (err) {
        console.log(err.message);
      } finally {
        setLoading(false);
      }
    }
  }

  function getUnitStats(unit) {
    const newCalc = StatsCalculator.fromUnit(unit, stronghold);
    const unitStats = newCalc.getStats(false);
    return unitStats;
  }

  function getUnitCosts(unit) {
    const newCalc = StatsCalculator.fromUnit(unit, stronghold);
    const unitStats = newCalc.getCost(unit);
    return unitStats;
  }

  useEffect(() => {
    if(userId){
      fetchUnits();
    }
  }, [userId, strongholdId]);

  function renderElements() {
    switch (activeButton.subCategory) {
      case "overview":
        return (
          <div className={styles.unitListContainer}>
            <section className={styles.unitCategories}>
              <div className={styles.largeCategory}>name</div>
              <div className={styles.smallCategory}>size</div>
              <div className={styles.mediumCategory}>ancestry</div>
              <div className={styles.mediumCategory}>experience</div>
              <div className={styles.mediumCategory}>equipment</div>
              <div className={styles.smallCategory}>type</div>
            </section>
            <section className={styles.unitList}>
              {unitsList?.map((unit) => (
                <div key={unit.id} className={styles.unit}>
                  <p className={styles.largeCategory}>{unit.name}</p>
                  <p className={styles.smallCategory}>{unit.size.unitSize}</p>
                  <p className={styles.mediumCategory}>{unit.ancestry.name}</p>
                  <p className={styles.mediumCategory}>
                    {unit.experience.name}
                  </p>
                  <p className={styles.mediumCategory}>
                    {unit.equipment.name}{" "}
                  </p>
                  <p className={styles.smallCategory}>{unit.type.name}</p>
                </div>
              ))}
            </section>
          </div>
        );
      case "stats":
        return (
          <div className={styles.unitListContainer}>
            <section className={styles.unitCategories}>
              <div className={styles.largeCategory}>name</div>
              <div className={`${styles.smallCategory} ${styles.stats}`}>
                attack
              </div>
              <div className={`${styles.smallCategory} ${styles.stats}`}>
                power
              </div>
              <div className={`${styles.smallCategory} ${styles.stats}`}>
                defense
              </div>
              <div className={`${styles.smallCategory} ${styles.stats}`}>
                toughness
              </div>
              <div className={`${styles.smallCategory} ${styles.stats}`}>
                morale
              </div>
            </section>
            <section className={styles.unitList}>
              {unitsList?.map((unit) => {
                const stats = getUnitStats(unit);

                return (
                  <div key={unit.id} className={`${styles.unit}`}>
                    <p className={`${styles.largeCategory}`}>{unit.name}</p>
                    <p className={`${styles.smallCategory} ${styles.stats}`}>
                      +{stats.attack}
                    </p>
                    <p className={`${styles.smallCategory} ${styles.stats}`}>
                      +{stats.power}
                    </p>
                    <p className={`${styles.smallCategory} ${styles.stats}`}>
                      {stats.defense}{" "}
                    </p>
                    <p className={`${styles.smallCategory} ${styles.stats}`}>
                      {stats.toughness}
                    </p>
                    <p className={`${styles.smallCategory} ${styles.stats}`}>
                      +{stats.morale}
                    </p>
                  </div>
                );
              })}
            </section>
          </div>
        );
      case "costs":
        return (
          <div className={styles.unitListContainer}>
            <section className={styles.unitCategories}>
              <div className={styles.largeCategory}>name</div>
              <div className={`${styles.smallCategory} ${styles.stats}`}>
                cost
              </div>
              <div className={`${styles.smallCategory} ${styles.stats}`}>
                upkeep
              </div>
            </section>
            <section className={styles.unitList}>
              {unitsList?.map((unit) => {
                const costs = getUnitCosts(unit);

                return (
                  <div key={unit.id} className={`${styles.unit}`}>
                    <p className={`${styles.largeCategory}`}>{unit.name}</p>
                    <p className={`${styles.smallCategory} ${styles.stats}`}>
                      {costs.cost}gp
                    </p>
                    <p className={`${styles.smallCategory} ${styles.stats}`}>
                      {costs.upkeep}gp
                    </p>
                  </div>
                );
              })}
            </section>
          </div>
        );
    }
  }

  return renderElements();
}
