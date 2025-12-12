"use client";
import { act, SetStateAction, useEffect, useState } from "react";
import ModalBackground from "../ModalBackground/ModalBackground";
import styles from "./styles.module.scss";
import RaisingUnitsList from "components/RaisingUnitsList/RaisingUnitsList";
import { Ancestry, RaisingUnitRow, RaisingUnitsStatus, Unit } from "types";
import { data } from "jquery";

interface RaisingUnitsModalProps {
  visible: boolean;
  setVisible: React.Dispatch<SetStateAction<boolean>>;
  keepType: string;
  strongholdId: number;
  userId: string | null;
  raisingUnitsStatus: RaisingUnitsStatus | null;
  setRaisingUnitsStatus: React.Dispatch<React.SetStateAction<RaisingUnitsStatus>>;
}

export default function RaisingUnitsModal({
  visible,
  setVisible,
  keepType,
  strongholdId,
  userId,
  raisingUnitsStatus,
  setRaisingUnitsStatus
}: RaisingUnitsModalProps) {
  const [activeUnitRow, setActiveUnitRow] = useState<RaisingUnitRow>();
  const [d100roll, setD100Roll] = useState<number>(0);
  const [unitsRaisedList, setUnitsRaisedList] = useState<
    RaisingUnitRow[] | null
  >(null);
  const [ancestries, setAncestries] = useState<Ancestry[] | null>(null);
  const [sendingData, setSendingData] = useState<boolean>(false);
  const [responseOk, setResponseOk] = useState<boolean>(false);
  const [unit, setUnit] = useState({
    user_id: userId,
    name: "",
    stronghold_id: strongholdId,
    ancestry: "human",
    experience: activeUnitRow?.unit.experience,
    equipment: activeUnitRow?.unit.equipment,
    type: activeUnitRow?.unit.type,
    sizeLevel: 1,
    casualties: 0,
    isMercenary: false,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [allFieldsComplete, setAllFieldsComplete] = useState<boolean>(false);

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

  function handleInputChange(e: { target: { value: string } }) {
    setUnit({
      ...unit,
      name: e.target.value,
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

  async function handleSubmit() {
    const newUnitId = await addUnit();
    const data = await addUnitRaised(newUnitId, strongholdId, activeUnitRow?.id);

    if(data){
      const newStatus = updateRaisingUnitsStatus("increment")
      setRaisingUnitsStatus(await newStatus);
    }
  }

  async function updateRaisingUnitsStatus(incrementOrDecrement){
    const newValue = (
      incrementOrDecrement === "increment" ? 
        (raisingUnitsStatus?.current_units ?? 0) + 1
      : (raisingUnitsStatus?.current_units ?? 0) + 1
    )
    const newBoolean = (
      newValue >= (raisingUnitsStatus?.max_units ?? 0) ?
      true
      : false
    )
    
    const newStatus = await patchRaisingUnitsStatusRow(newValue, newBoolean);

    return newStatus;
  }

  async function patchRaisingUnitsStatusRow(newValue: number, newBoolean: boolean){
    const dataObject = {
      currentUnits: newValue,
      hasRaisedAllUnits: newBoolean
    }

    try{
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/strongholds/raising_units/status/update/${strongholdId}`,
        {
          method: "PATCH",
          headers: {
            "Content-type" : "application/json",
          },
          body: JSON.stringify(dataObject),
        }
      );

      if (!res.ok){
        throw new Error("Error: could not update status row")
      }

      const data = await res.json();
      console.log(data.updatedRow);
      return data.updatedRow;
    } catch(err){
      console.error(err.message);
    } finally{
      setSendingData(false);
    }
  }

  async function addUnitRaised(newUnitId, strongholdId, raisingUnitId) {
    const unitRaised = {
      strongholdId: strongholdId,
      unitId: newUnitId,
      raisingUnitId: raisingUnitId,
    };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/strongholds/raising_units/units_raised/add`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(unitRaised),
        }
      );

      if (!res.ok) {
        throw new Error("Error: Could not add unit.");
      }

      const data = await res.json();
      console.log(data);
      return data;
    } catch (err) {
      console.error(err.message);
    } finally {
      setSendingData(false);
    }
  }

  async function addUnit() {
    setSendingData(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/units/add`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(newUnitData),
      });

      if (!res.ok) {
        throw new Error("Error: Could not create unit.");
      } else {
        setResponseOk(true);
      }

      const data = await res.json();
      return data.id;

      //TODO: capture data for navigation to unit page or stronghold page?
    } catch (err) {
      setResponseOk(false);
      console.error(err.message);
    } finally {
      setSendingData(false);
    }
  }

  //USE EFFECTS
  useEffect(() => {
    if (!ancestries) {
      fetchUnitAncestries();
    }
  }, [ancestries]);

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
    setUnit({
      ...unit,
      experience: activeUnitRow?.unit.experience,
      equipment: activeUnitRow?.unit.equipment,
      type: activeUnitRow?.unit.type,
    });
  }, [activeUnitRow]);

  useEffect(() => {
    if (
      newUnitData.unit_name !== "" &&
      newUnitData.equipment &&
      newUnitData.experience &&
      newUnitData.unit_type
    ) {
      setAllFieldsComplete(true);
    } else if (allFieldsComplete) {
      setAllFieldsComplete(false);
    }
  }, [newUnitData]);

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
          <input
            type="text"
            value={unit.name}
            onChange={handleInputChange}
            placeholder="enter a name..."
          ></input>
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
            {newUnitData.unit_name} <br />
            {newUnitData.ancestry} <br />
            {newUnitData.equipment} <br />
            {newUnitData.experience} <br />
            {newUnitData.unit_type} <br />
            {newUnitData.stronghold_id}
          </p>
          <button disabled={!allFieldsComplete} onClick={handleSubmit}>
            add unit to stronghold
          </button>
        </section>
      </section>
    </ModalBackground>
  ) : null;
}
