"useClient";
import styles from "./styles.module.scss";
import { StatsCalculator } from "lib/StatsCalculator";
import type { Unit, Stronghold, DeleteModalSettings } from "types";
import { useState, useEffect, useRef, SetStateAction } from "react";
import Image from "next/image";
import star from "../../../public/images/star_formation.svg";
import shield from "../../../public/images/shield.svg";
import Link from "next/link";

type UnitCardProps = {
  unit: Unit;
  deleteModalSettings?: DeleteModalSettings;
  setDeleteModalSettings?: React.Dispatch<SetStateAction<DeleteModalSettings>>;
  clickable: boolean;
};

export default function UnitCard({
  unit,
  deleteModalSettings,
  setDeleteModalSettings,
  clickable
}: UnitCardProps) {
  const [activeCard, setActiveCard] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [stronghold, setStronghold] = useState<Stronghold | null>(null);
  const [calc, setCalc] = useState(StatsCalculator.fromUnit(unit, stronghold));
  const [stats, setStats] = useState(calc.getStats(true));
  const [ancestryIcon, setAncestryIcon] = useState({
      source: "defaultAncestry",
      placeholder: "default ancestry icon"
    })
  const [unitTypeIcon, setUnitTypeIcon] = useState({
    source: "",
    placeholder: ""
  })



  const cardRef = useRef<HTMLDivElement | null>(null);

  function handleDelete() {
    if (deleteModalSettings && setDeleteModalSettings) {
      setDeleteModalSettings({
        ...deleteModalSettings,
        isVisible: true,
        itemId: unit.id,
      });
    }
  }

  function scrollToCard(): void{
      cardRef?.current?.scrollIntoView({behavior: "smooth", block: "center"})
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

  useEffect(() => {
    switch(unit.ancestry.name){
      case "human":
        setAncestryIcon({source: "human", placeholder: "human icon"})
        break;
      case "dragonborn":
      case "kobold":
      case "lizardfolk":
        setAncestryIcon({source: "draconic", placeholder:"draconic icon"})
        break;
      case "dwarf":
        setAncestryIcon({source: "dwarf", placeholder:" dwarf icon"})
        break;
      case "elf":
      case "elf (winged)":
        setAncestryIcon({source: "elf", placeholder: "elf icon"})
        break;
      case "gnoll":
        setAncestryIcon({source: "gnoll", placeholder: "gnoll icon"})
        break;
      case "gnome":
        setAncestryIcon({source: "defaultAncestry", placeholder: "default icon"})
        break;
      case "goblin":
      case "hobgoblin":
      case "bugbear":
        setAncestryIcon({source: "goblinoid", placeholder: "goblinoid icon"})
        break;
      case "orc":
      case "ogre":
      case "troll":
        setAncestryIcon({source: "brute", placeholder:"brute icon"})
        break;
      case "treant":
        setAncestryIcon({source: "leaf", placeholder:"leaf icon"})
        break;
      case "skeleton":
      case "ghoul":
      case "zombie":
        setAncestryIcon({source: "undead", placeholder:"undead icon"})
        break;
      default:
        return;
        // setImageSource({...imageSource, ancestry:{source: "defaultAncestry", placeholder: "default icon"}})
        // break;
    }
  }, [unit.ancestry.name])

  useEffect(() => {
    switch(unit.type.name){
      case "infantry":
        setUnitTypeIcon({source: "infantry", placeholder: "infantry icon"})
        break;
      case "archers":
        setUnitTypeIcon({source: "archers", placeholder: "archers icon"})
        break;
      case "cavalry":
        setUnitTypeIcon({source: "cavalry", placeholder: "cavalry icon"})
        break;
      case "flying":
        setUnitTypeIcon({source: "flying", placeholder: "flying icon"})
        break;
      case "levies":
        setUnitTypeIcon({source: "levies", placeholder: "levies icon"})
        break;
      case "siege engine":
        setUnitTypeIcon({source: "siegeEngine", placeholder: "siege engine icon"})
        break;
      default:
        return;
    }
  }, [unit.type.name])

  return (
    <>
      <div ref={cardRef}
        onClick={() => {
          scrollToCard();
          clickable ? setActiveCard(true) : null;
        }}
        key={unit?.id}
        className={`${styles.card} ${!clickable ? styles.notClickable : ""} ${activeCard ? styles.activeCard : ""}`}
      >
        <section className={styles.cardTop}>
          <section className={styles.cardBanners}>
            <div className={styles.bannerContainer}>  
              <div className={`${styles.banner} ${styles.experience}`}>
                <div className={styles.ancestryImageContainer}>
                  <Image src={`/images/ancestries/${ancestryIcon.source}.svg`} alt={ancestryIcon.placeholder} fill loading="eager"/>
                </div>
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
              </div>
            </div>
            <div className={styles.bannerContainer}>
              <div className={`${styles.banner} ${styles.equipment}`}>
                <section className={styles.iconContainer}>
                  <div className={styles.typeImageContainer}>
                    <Image src={`/images/unitTypes/${unitTypeIcon.source}.svg`} alt={unitTypeIcon.placeholder} fill/>
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
            <Link className={`${styles.link} ${styles.button}`} href={`/units/edit/${unit.id}`}>
              edit
            </Link>
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
