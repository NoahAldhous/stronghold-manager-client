"useClient";
import styles from "./styles.module.scss";
import { StatsCalculator } from "lib/StatsCalculator";
import type { Unit, Stronghold, DeleteModalSettings } from "types";
import { useState, useEffect, SetStateAction } from "react";
import Image from "next/image";
import star from "../../../public/images/star_formation.svg";
import cavalry from "../../../public/images/cavalry_type.svg";
import archers from "../../../public/images/archers_type.svg";
import flying from "../../../public/images/flying_type.svg";
import infantry from "../../../public/images/infantry_type.svg";
import levies from "../../../public/images/levies_type.svg";
import siegeEngine from "../../../public/images/siege_engine_type.svg";
import shield from "../../../public/images/shield.svg";

type UnitCardProps = {
  unit: Unit;
  deleteModalSettings?: DeleteModalSettings;
  setDeleteModalSettings?: React.Dispatch<SetStateAction<DeleteModalSettings>>;
};

export default function UnitCard({
  unit,
  deleteModalSettings,
  setDeleteModalSettings,
}: UnitCardProps) {
  const [activeCard, setActiveCard] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [stronghold, setStronghold] = useState<Stronghold | null>(null);
  const [calc, setCalc] = useState(StatsCalculator.fromUnit(unit, stronghold));
  const [stats, setStats] = useState(calc.getStats(true));

  function handleDelete() {
    if (deleteModalSettings && setDeleteModalSettings) {
      setDeleteModalSettings({
        ...deleteModalSettings,
        isVisible: true,
        itemId: unit.id,
      });
    }
  }

  async function fetchStronghold() {
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/strongholds/data/${unit.stronghold_id}`
      );

      if (!res.ok) {
        throw new Error("There was a problem fetching stronghold data");
      }

      const data = await res.json();
      setStronghold(data.stronghold);
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const newCalc = StatsCalculator.fromUnit(unit, stronghold);
    setCalc(newCalc);
    setStats(newCalc.getStats(true));
  }, [unit, stronghold]);

  useEffect(() => {
    if (unit.stronghold_id) {
      fetchStronghold();
    } else {
      setStronghold(null);
    }
  }, [unit.stronghold_id, stronghold?.stronghold_type]);

  return (
    <>
      <div
        onClick={() => {
          setActiveCard(true);
        }}
        key={unit?.id}
        className={`${styles.card} ${activeCard ? styles.activeCard : ""}`}
      >
        <section className={styles.cardTop}>
          <section className={styles.cardBanners}>
            <div className={styles.bannerContainer}>  
              <div className={`${styles.banner} ${styles.experience}`}>
                {
                  ["green", "regular", "seasoned", "veteran", "elite", "super-elite"].includes(unit?.experience.name) ?
                    <div className={`${styles.experienceRibbon} ${styles.green}`}></div>
                    : null
                }
                {
                  ["regular", "seasoned", "veteran", "elite", "super-elite"].includes(unit?.experience.name) ?
                    <div className={`${styles.experienceRibbon} ${styles.regular}`}></div>
                    : null
                }
                {
                  ["seasoned", "veteran", "elite", "super-elite"].includes(unit?.experience.name) ?
                    <div className={`${styles.experienceRibbon} ${styles.seasoned}`}></div>
                    : null
                }
                {
                  ["veteran", "elite", "super-elite"].includes(unit?.experience.name) ?
                    <div className={`${styles.experienceRibbon} ${styles.veteran}`}></div>
                    : null
                }
                {
                  ["elite", "super-elite"].includes(unit?.experience.name) ?
                    <div className={`${styles.experienceRibbon} ${styles.elite}`}></div>
                    : null
                }
                {
                  ["super-elite"].includes(unit?.experience.name) ?
                    <div className={`${styles.experienceRibbon} ${styles.superElite}`}>
                      <div className={styles.imageContainer}>
                        <Image className={styles.svg} src={star} alt={"stars"} fill/>
                      </div>
                    </div>
                    : null
                }
                {/* {Array.from({ length: unit.experience.moraleBonus + 1 }).map(
                  (_, index) => (
                    <span
                      key={index}
                      className={styles.experienceDiamondContainer}
                    >
                      <span
                        className={`${styles.experienceDiamond} ${
                          styles[unit.experience.name]
                        }`}
                      />
                    </span>
                  )
                )} */}
              </div>
            </div>
            
            <div className={styles.bannerContainer}>
              <div className={`${styles.banner} ${styles.equipment}`}>
                <section className={styles.iconContainer}>

                  <div className={styles.typeImageContainer}>
                    {
                      unit.type.name === "archers" ?
                        <Image src={archers} alt="archers icon" fill/>
                      : null
                    }
                    {
                      unit.type.name === "cavalry" ?
                        <Image src={cavalry} alt="cavalry icon" fill/>
                      : null
                    }
                    {
                      unit.type.name === "flying" ?
                        <Image src={flying} alt="flying icon" fill/>
                      : null
                    }
                    {
                      unit.type.name === "infantry" ?
                        <Image src={infantry} alt="infantry icon" fill/>
                      : null
                    }
                    {
                      unit.type.name === "levies" ?
                        <Image src={levies} alt="levies icon" fill/>
                      : null
                    }
                    {
                      unit.type.name === "siege engine" ?
                        <Image src={siegeEngine} alt="siege engine icon" fill/>
                      : null
                    }
                  </div>
            <div className={styles.equipmentImageContainer}>
                {["light", "medium", "heavy", "super-heavy"].includes(
                  unit.equipment.name
                ) ? (
                  <div className={styles.shield}>
                    <Image src ={shield} alt="shield icon" fill/>
                  </div>
                ) : null}
                {["medium", "heavy", "super-heavy"].includes(
                  unit.equipment.name
                ) ? (
                  <div className={styles.shield}>
                    <Image src ={shield} alt="shield icon" fill/>
                  </div>
                ) : null}
                {["heavy", "super-heavy"].includes(
                  unit.equipment.name
                ) ? (
                  <div className={styles.shield}>
                    <Image src ={shield} alt="shield icon" fill/>
                  </div>
                ) : null}
                {["super-heavy"].includes(
                  unit.equipment.name
                ) ? (
                  <div className={styles.shield}>
                    <Image src ={shield} alt="shield icon" fill/>
                  </div>
                ) : null}
            </div>
                </section>
              </div>
            </div>
              
          </section>

          <section className={styles.cardOverview}>
            <section className={styles.cardHeader}>{unit?.name}</section>
            {unit.stronghold_id ? (
              <section className={styles.unitStronghold}>
                {unit.isMercenary ? "Mercenaries" : "Soldiers"} of {stronghold?.stronghold_name ?? null}
              </section>
            ) : null}
            <section className={styles.cardSummary}>
              <p className={styles.cardText}>
                {unit?.ancestry.name}{" "}
                {unit?.type.name == "levies"
                  ? unit?.type.name
                  : unit?.experience.name}
              </p>
              {unit.type.name == "levies" ? null : (
                <p className={styles.cardText}>
                  {unit?.equipment.name} {unit?.type.name}
                </p>
              )}
            </section>
            {/* <section className={styles.cardCost}>cost: {stats.costs.cost}gp upkeep: {stats.costs.upkeep}gp</section> */}
          </section>
        </section>
        <section className={styles.cardStats}>
          <div className={styles.statRow}>
            <div className={styles.stat}>
              <p className={styles.statText}>attack:</p>
              <p className={styles.statText}>
                {stats.attack >= 0 ? "+" : ""}
                {stats.attack}
              </p>
            </div>
            <div className={styles.stat}>
              <p className={styles.statText}>defense:</p>
              <p className={styles.statText}>{stats.defense}</p>
            </div>
          </div>
          <div className={styles.statRow}>
            <div className={styles.stat}>
              <p className={styles.statText}>power:</p>
              <p className={styles.statText}>
                {stats.power >= 0 ? "+" : ""}
                {stats.power}
              </p>
            </div>
            <div className={styles.stat}>
              <p className={styles.statText}>toughness:</p>
              <p className={styles.statText}>{stats.toughness}</p>
            </div>
          </div>
          <div className={styles.statRow}>
            <div className={styles.stat}>
              <p className={styles.statText}>morale:</p>
              <p className={styles.statText}>
                {stats.morale >= 0 ? "+" : ""}
                {stats.morale}
              </p>
            </div>
            <div className={styles.stat}>
              <p className={styles.statText}>size:</p>
              <p className={styles.statText}>
                {unit.size.unitSize - unit.casualties}/{unit.size.unitSize}
              </p>
            </div>
          </div>
        </section>
        <section className={styles.cardTraits}>
          <section className={styles.title}>traits</section>
          <section className={styles.traits}>
            {unit?.traits?.map((trait, index) => (
              <div key={index}>
                <p className={styles.traitName}>{trait.traitName}</p>
                <p className={styles.traitDescription}>
                  {trait.traitDescription}
                </p>
              </div>
            ))}
          </section>
        </section>
        <section className={styles.cardCost}>
          <p>upkeep: {stats.costs.upkeep}gp</p>
          <p>cost: {stats.costs.cost}gp</p>
        </section>
        {activeCard ? (
          <section className={styles.cardFooter}>
            <button className={styles.button}>edit</button>
            <button className={styles.button}>upgrade</button>
            <button className={styles.button} onClick={handleDelete}>
              delete
            </button>
          </section>
        ) : null}
      </div>
      <div
        onClick={() => {
          setActiveCard(false);
        }}
        className={`${styles.background} ${activeCard ? styles.visible : ""}`}
      />
    </>
  );
}
