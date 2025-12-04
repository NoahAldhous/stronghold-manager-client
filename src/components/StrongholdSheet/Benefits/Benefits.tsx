"use client";
import styles from "./styles.module.scss";
import type { Stronghold } from "types";
import { JSX } from "react";
import { useState, useEffect } from "react";
import LoadingCard from "components/LoadingUI/LoadingCard/LoadingCard";

interface BenefitsProps {
  loading: boolean;
  stronghold_id: string;
  type: Stronghold["stronghold_type"] | null;
  benefits: Stronghold["features"] | null;
  setContextualInfo: React.Dispatch<
    React.SetStateAction<{ title: string; description: string }>
  >;
}

interface RaisingUnitsStatus {
  current_units: number;
  has_raised_all_units: boolean;
  id: number;
  max_units: number;
  stronghold_id: number;
}

export default function Benefits({
  loading,
  stronghold_id,
  type,
  benefits,
  setContextualInfo,
}: BenefitsProps): JSX.Element {
  const [raisingUnitsStatus, setRaisingUnitsStatus] =
    useState<RaisingUnitsStatus | null>(null);

  async function fetchKeepUnitsRaisedStatus(): Promise<void> {
    console.log("fetching unit status for keep...");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/strongholds/raising_units/status/get/${stronghold_id}`
      );

      if (!res.ok) {
        throw new Error("There was a problem fetching data. Please try again");
      }

      const data = await res.json();
      setRaisingUnitsStatus(data.status);
      console.log(raisingUnitsStatus);
    } catch (err) {
      console.log(err.message);
    } finally {
      return;
    }
  }

  useEffect(() => {
    if(!raisingUnitsStatus){
      if (type === "keep") {
        fetchKeepUnitsRaisedStatus();
      }
    }
  }, [type, raisingUnitsStatus]);

  return (
    <section>
      {loading || (!type && !benefits) ? (
        <section className={styles.benefitsContainer}>
          <LoadingCard />
        </section>
      ) : (
        <section className={styles.benefitsContainer}>
          <section className={styles.cardHeader}>{type} benefits</section>
          {benefits?.map((item, index) => {
            return (
              <button
                className={`${styles.button} ${
                  type === "keep" &&
                  item.title === "raising units" &&
                  !raisingUnitsStatus?.has_raised_all_units
                    ? styles.raisingUnits
                    : ""
                }`}
                onClick={() =>
                  setContextualInfo({
                    title: item.title,
                    description: item.description,
                  })
                }
                key={index}
              >
                {type === "keep" &&
                item.title === "raising units" &&
                !raisingUnitsStatus?.has_raised_all_units ? (
                  <span className={styles.notification}>{(raisingUnitsStatus?.max_units ?? 0) - (raisingUnitsStatus?.current_units ?? 0)}</span>
                ) : null}
                {item.title}
              </button>
            );
          })}
        </section>
      )}
    </section>
  );
}
