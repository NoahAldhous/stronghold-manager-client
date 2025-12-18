"use client";
import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import { RaisingUnitRow } from "types";

interface RaisingUnitsListProps {
  keepType: string;
  highlightNumber: number;
  setd100Roll: React.Dispatch<React.SetStateAction<number>>;
}

export default function RaisingUnitsList({ keepType, highlightNumber, setd100Roll }: RaisingUnitsListProps) {
  const [unitsRaisedList, setUnitsRaisedList] = useState<
    RaisingUnitRow[] | null
  >(null);
  const [loading, setLoading] = useState<boolean>(true);

  async function fetchUnitsRaised(keepOrCamp): Promise<void> {
    if (!unitsRaisedList) {
      setLoading(true);
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
        setLoading(false);
        return;
      }
    }
  }

  useEffect(() => {
    if(keepType){
        fetchUnitsRaised(keepType);
    }
  }, [keepType]);


  return (
    <div className={styles.raisingUnitsList}>
      <div className={`${styles.unitRow} ${styles.title}`}>
        <p className={`${styles.rollText} ${styles.bold}`}>d100 roll</p>
        <p className={`${styles.unitText} ${styles.bold}`}>unit raised</p>
      </div>
      {
        loading ? 
        <div className={styles.loadingList}>
          {Array.from({ length: 13}).map((_, i) => (
            <div key={i} className={styles.loadingRow}>loading...</div>
          ))}
        </div>
        :
        unitsRaisedList?.map((row, index) => (
          <div key={row.id} onClick={() => {setd100Roll(row.lowNumber)}} className={`${styles.unitRow} ${(highlightNumber <= row.highNumber) && (highlightNumber >= row.lowNumber) ? styles.highlight : ""}`}>
            <p className={styles.rollText}>
              {row.lowNumber}-{row.highNumber}
            </p>
            <p className={styles.unitText}>
              {row.unit.experience} {row.unit.equipment} {row.unit.type}
            </p>
          </div>
        ))
      }
    </div>
  );
}
