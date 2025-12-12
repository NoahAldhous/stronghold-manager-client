"use client";
import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import { RaisingUnitRow } from "types";

interface RaisingUnitsListProps {
  keepType: string;
  highlightNumber: number;
}

export default function RaisingUnitsList({ keepType, highlightNumber }: RaisingUnitsListProps) {
  const [unitsRaisedList, setUnitsRaisedList] = useState<
    RaisingUnitRow[] | null
  >(null);
  // const [type, setType] = useState(keepType)

  async function fetchUnitsRaised(keepOrCamp): Promise<void> {
    if (!unitsRaisedList && keepType) {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/strongholds/raising_units/get/${keepOrCamp}`
        );

        if (!res.ok) {
          throw new Error("There was a problem fetching data. Pleas try again");
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

  // useEffect(() => {
  //   if(type){
  //       fetchUnitsRaised(type);
  //   }
  // }, [keepType]);

  fetchUnitsRaised(keepType);

  return (
    <div className={styles.raisingUnitsList}>
      <div className={styles.unitRow}>
        <p className={`${styles.rollText} ${styles.bold}`}>d100 roll</p>
        <p className={`${styles.unitText} ${styles.bold}`}>unit raised</p>
      </div>
      {unitsRaisedList?.map((row, index) => (
        <div key={row.id} className={`${styles.unitRow} ${(highlightNumber <= row.highNumber) && (highlightNumber >= row.lowNumber) ? styles.highlight : ""}`}>
          <p className={styles.rollText}>
            {row.lowNumber}-{row.highNumber}
          </p>
          <p className={styles.unitText}>
            {row.unit.experience} {row.unit.equipment} {row.unit.type}
          </p>
        </div>
      ))}
    </div>
  );
}
