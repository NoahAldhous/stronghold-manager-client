"use client";
import styles from "./styles.module.scss";
import type { Stronghold, RaisingUnitsStatus } from "types";
import { JSX } from "react";
import { useState, useEffect } from "react";
import LoadingCard from "components/LoadingUI/LoadingCard/LoadingCard";

interface BenefitsProps {
  loading: boolean;
  type: string | null;
  raisingUnitsStatus: RaisingUnitsStatus | null;
  benefits: Stronghold["features"] | null;
  setInfoType: React.Dispatch<
    React.SetStateAction<string>
  >;
}

export default function Benefits({
  loading,
  benefits,
  setInfoType,
  type,
  raisingUnitsStatus
}: BenefitsProps): JSX.Element {

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
                  setInfoType(
                    item.title
                  )
                }
                key={index}
              >
                {type === "keep" &&
                item.title === "raising units" &&
                !raisingUnitsStatus?.has_raised_all_units ? (
                  <span className={styles.notification}><p className={styles.number}>{(raisingUnitsStatus?.max_units ?? 0) - (raisingUnitsStatus?.current_units ?? 0)}</p></span>
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
