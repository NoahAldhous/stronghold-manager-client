"use client";
import { act, SetStateAction, useEffect, useState } from "react";
import ModalBackground from "../ModalBackground/ModalBackground";
import styles from "./styles.module.scss";
import RaisingUnitsList from "components/RaisingUnitsList/RaisingUnitsList";
import { Ancestry, RaisingUnitRow, Unit } from "types";

interface RaisingUnitsModalProps {
  visible: boolean;
  setVisible: React.Dispatch<SetStateAction<boolean>>;
  keepType: string;
  strongholdId: number;
}

export default function RaisingUnitsModal({
  visible,
  setVisible,
  keepType,
  strongholdId
}: RaisingUnitsModalProps) {
  const [activeUnitRow, setActiveUnitRow] = useState<RaisingUnitRow>();
  const [d100roll, setD100Roll] = useState<number>(0);
  const [unitsRaisedList, setUnitsRaisedList] = useState<
    RaisingUnitRow[] | null
  >(null);
  const [ancestries, setAncestries] = useState<Ancestry[] | null>(null);
  const [unit, setUnit] = useState({
    user_id: 0,
    name: "",
    stronghold_id: strongholdId,
    ancestry: "human",
    experience: activeUnitRow?.unit.experience,
    equipment: activeUnitRow?.unit.equipment,
    type: activeUnitRow?.unit.type,
    sizeLevel: 1,
    casualties: 0,
    isMercenary: false
  });
  const [loading, setLoading] = useState<boolean>(false);

  //Data object to be sent to DB
  const newUnitData = {
    user_id: unit.user_id,
    unit_name: unit.name,
    stronghold_id: unit.stronghold_id,
    ancestry: unit.ancestry,
    experience: unit.experience,
    equipment: unit.equipment,
    unit_type: unit.type,
    size_level: unit.sizeLevel,
    casualties: unit.casualties,
    mercenary: unit.isMercenary,
  };

  function rollOnTable() {
    const roll = Math.floor(Math.random() * 100) + 1;
    setD100Roll(roll);
  }

  function handleSelectChange(objectKey: string, objectValue: string) {
    setUnit({
      ...unit,
      [objectKey]: objectValue,
    });
  }

  // FETCH FUNCTIONS

  async function fetchUnitAncestries(): Promise<void> {
    if (!ancestries) {
      setLoading(true);

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/units/ancestries`
        );

        if (!res.ok) {
          throw new Error("There was a problem fetching this data");
        }

        const data = await res.json();
        setAncestries(data.ancestries);
      } catch (err) {
        console.log(err.message);
      } finally {
        setLoading(false);
      }
    }
  }

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

  fetchUnitsRaised(keepType);

  //USE EFFECTS
  useEffect(() => {
    if(!ancestries){
      fetchUnitAncestries()
    }
  },[ancestries])

  useEffect(() => {
    if (unitsRaisedList) {
      const row = unitsRaisedList?.filter(
        (row) => d100roll <= row.highNumber && d100roll >= row.lowNumber
      )[0];
      console.log(row);
      setActiveUnitRow(row);
    }
  }, [d100roll, unitsRaisedList]);

  useEffect(() => {
    setUnit({...unit, experience: activeUnitRow?.unit.experience, equipment: activeUnitRow?.unit.equipment, type: activeUnitRow?.unit.type})
  }, [activeUnitRow])

  return visible ? (
    <ModalBackground>
      <section className={styles.modal}>
        <section className={styles.cardHeader}>Roll on Table</section>
        <section className={styles.list}>
          <RaisingUnitsList keepType="keep" />
          <section className={styles.buttonContainer}>
            <button
              onClick={() => {
                setVisible(false);
              }}
            >
              close{" "}
            </button>
          </section>
        </section>
        <section className={styles.diceRoller}>
          <input type="text" placeholder="enter a name..."></input>
          <section className={styles.formSection}>
              <label className={styles.label} htmlFor="ancestry-select">
                ancestry:
              </label>
              <select
                value={unit?.ancestry}
                className={styles.select}
                onChange={(e) => handleSelectChange("ancestry", e.target.value)}
                name="ancestries"
                id="ancestry-select"
              >
                {ancestries?.map((ancestry, index) => (
                  <option key={index} value={ancestry.name}>
                    {ancestry.name}
                  </option>
                ))}
              </select>
            </section>
          <div>{d100roll}</div>
          <div>
            {activeUnitRow?.unit?.experience} {activeUnitRow?.unit?.equipment}{" "}
            {activeUnitRow?.unit?.type}
          </div>
          <button onClick={rollOnTable}>Roll d100</button>
          <p>
            {newUnitData.unit_name}
            {newUnitData.ancestry}
            {newUnitData.equipment}
            {newUnitData.experience}
            {newUnitData.unit_type}
            {newUnitData.stronghold_id}
          </p>
        </section>
      </section>
    </ModalBackground>
  ) : null;
}
