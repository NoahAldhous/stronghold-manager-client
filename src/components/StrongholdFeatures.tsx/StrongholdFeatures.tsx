"use client";
import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import { Stronghold, Units, RaisingUnitRow } from "types";
import UnitCard from "components/UnitCard/UnitCard";
import { StatsCalculator } from "lib/StatsCalculator";
import RaisingUnitsList from "components/RaisingUnitsList/RaisingUnitsList";
import ArtisanFeatures from "./ArtisanFeatures/ArtisanFeatures";
import StrongholdRetainersList from "./FollowersFeatures/Retainers/StrongholdRetainersList/StrongholdRetainersList";
import UnitsFeatures from "./UnitsFeatures/UnitsFeatures";

interface StrongholdFeaturesType {
  userId: string | null;
  stronghold: Stronghold;
  strongholdId: string;
  activeButton: {
    category: string;
    subCategory: string;
  };
  strongholdActions:
    | {
        name: string;
        description: string;
      }[]
    | null;
  demesneEffects:
    | {
        description: string;
      }[]
    | null;
  typeBenefits:
    | {
        title: string;
        description: string;
      }[]
    | null;
  classFeatureImprovement: {
    name: string;
    description: string;
    restriction: string;
  } | null;
  strongholdType: string | null;
  characterClass: string | null;
  setContextualPanelType: React.Dispatch<
    React.SetStateAction<{ type: string; subtype: string }>
  >;
  needToUpdate: {
    artisans: boolean;
  };
  setNeedToUpdate: React.Dispatch<React.SetStateAction<{ artisans: boolean }>>;
}

export default function StrongholdFeatures({
  userId,
  stronghold,
  strongholdId,
  activeButton,
  strongholdActions,
  demesneEffects,
  typeBenefits,
  classFeatureImprovement,
  strongholdType,
  characterClass,
  setContextualPanelType,
  needToUpdate,
  setNeedToUpdate,
}: StrongholdFeaturesType) {
  const [loading, setLoading] = useState<boolean>(false);
  //TODO: separate into units raised list component
  const [keepType, setKeepType] = useState<"keep" | "camp">("keep");
  const [unitsRaisedList, setUnitsRaisedList] = useState<
    RaisingUnitRow[] | null
  >(null);

  //TODO: Extract this out into a separate component
  async function fetchUnitsRaised(): Promise<void> {
    if (!unitsRaisedList) {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/strongholds/raising_units/get/${keepType}`
        );

        if (!res.ok) {
          throw new Error(
            "There was a problem fetching data. Please try again"
          );
        }

        const data = await res.json();
        setUnitsRaisedList(data.units);
      } catch (err) {
        console.log(err.message);
      } finally {
        return;
      }
    }
  }

  function renderText() {
    switch (activeButton.category) {
      case "stronghold":
        switch (activeButton.subCategory) {
          case "all":
            return (
              <>
                <p className={styles.rulesHeader}>stronghold actions</p>
                <p
                  className={styles.rulesText}
                >{`On initiative count 20 (losing initiative ties), the ${characterClass} can take a stronghold action with one of the following effects. They must be in the same hex or province as their stronghold and cannot use the same effect again until after a short or long rest.`}</p>
                {strongholdActions?.map((action, index) => (
                  <div key={index} className={styles.textItem}>
                    <p className={styles.itemName}>{action.name}</p>
                    <p className={styles.itemInfo}>{action.description}</p>
                  </div>
                ))}
                <p className={styles.rulesHeader}>demesne effects</p>
                <p
                  className={styles.rulesText}
                >{`The ${characterClass}'s stronghold creates one or more of the following effects at the GM's discretion.`}</p>
                {demesneEffects?.map((effect, index) => (
                  <div key={index} className={styles.textItem}>
                    <p className={styles.itemInfo}>{effect.description}</p>
                  </div>
                ))}
                <p className={styles.rulesHeader}>{strongholdType} benefits</p>
                {typeBenefits?.map((feature, index) => (
                  <div key={index} className={styles.textItem}>
                    <p className={styles.itemName}>{feature.title}</p>
                    <p className={styles.itemInfo}>{feature.description}</p>
                  </div>
                ))}
                <p className={styles.rulesHeader}>class feature improvement</p>
                <div className={styles.textItem}>
                  <p className={styles.itemName}>
                    {classFeatureImprovement?.name}
                  </p>
                  <p className={styles.itemInfo}>
                    {classFeatureImprovement?.description}
                  </p>
                  <p className={styles.itemInfo}>
                    {classFeatureImprovement?.restriction}
                  </p>
                </div>
              </>
            );
          case "stronghold actions":
            return (
              <>
                <p
                  className={styles.rulesText}
                >{`On initiative count 20 (losing initiative ties), the ${characterClass} can take a stronghold action with one of the following effects. They must be in the same hex or province as their stronghold and cannot use the same effect again until after a short or long rest.`}</p>
                {strongholdActions?.map((action, index) => (
                  <div key={index} className={styles.textItem}>
                    <p className={styles.itemName}>{action.name}</p>
                    <p className={styles.itemInfo}>{action.description}</p>
                  </div>
                ))}
              </>
            );
          case "demesne effects":
            return (
              <>
                <p
                  className={styles.rulesText}
                >{`The ${characterClass}'s stronghold creates one or more of the following effects at the GM's discretion.`}</p>
                {demesneEffects?.map((effect, index) => (
                  <div key={index} className={styles.textItem}>
                    <p className={styles.itemInfo}>{effect.description}</p>
                  </div>
                ))}
              </>
            );
          case `${strongholdType} benefits`:
            return typeBenefits?.map((feature, index) => (
              <div key={index} className={styles.textItem}>
                <p className={styles.itemName}>{feature.title}</p>
                <p className={styles.itemInfo}>{feature.description}</p>
                {feature.title === "raising units" && strongholdType ? (
                  <>
                    <br />
                    <RaisingUnitsList
                      keepType={strongholdType}
                      highlightNumber={0}
                    />
                  </>
                ) : null}
              </div>
            ));
          case "class feature improvement":
            return (
              <div className={styles.textItem}>
                <p className={styles.itemName}>
                  {classFeatureImprovement?.name}
                </p>
                <p className={styles.itemInfo}>
                  {classFeatureImprovement?.description}
                </p>
                <p className={styles.itemInfo}>
                  {classFeatureImprovement?.restriction}
                </p>
              </div>
            );
        }
      case "units":
        return <UnitsFeatures 
          userId={userId} 
          stronghold={stronghold}
          strongholdId={strongholdId}
          activeButton={activeButton}
        />
      case "artisans":
        switch (activeButton.subCategory) {
          case "all":
            return (
              <ArtisanFeatures
                strongholdId={strongholdId}
                setContextualPanelType={setContextualPanelType}
                needToUpdate={needToUpdate}
                setNeedToUpdate={setNeedToUpdate}
              />
            );
          case "acquired":
            return <p>acquired</p>;
          case "unacquired":
            return <p>unacquired</p>;
        }
        return <p>artisans</p>;
      case "followers":
        return (
          <StrongholdRetainersList
            strongholdId={strongholdId}
            setContextualPanelType={setContextualPanelType}
          />
        );
      default:
        return <p>nothing selected!</p>;
    }
  }

  return <section className={styles.featuresContainer}>{renderText()}</section>;
}
