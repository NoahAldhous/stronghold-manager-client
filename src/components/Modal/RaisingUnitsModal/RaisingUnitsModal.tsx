"use client";
import { SetStateAction, useEffect, useState } from "react";
import ModalBackground from "../ModalBackground/ModalBackground";
import styles from "./styles.module.scss";
import RaisingUnitsList from "components/RaisingUnitsList/RaisingUnitsList";
import { Ancestry, EquipmentLevel, ExperienceLevel, RaisingUnitRow, RaisingUnitsStatus, SizeLevel, Unit, UnitType } from "types";
import UnitCard from "components/UnitCard/UnitCard";

interface RaisingUnitsModalProps {
  visible: boolean;
  setVisible: React.Dispatch<SetStateAction<boolean>>;
  keepType: string;
  strongholdId: number;
  userId: string | null;
  raisingUnitsStatus: RaisingUnitsStatus | null;
  setRaisingUnitsStatus: React.Dispatch<
    React.SetStateAction<RaisingUnitsStatus>
  >;
}

export default function RaisingUnitsModal({
  visible,
  setVisible,
  keepType,
  strongholdId,
  userId,
  raisingUnitsStatus,
  setRaisingUnitsStatus,
}: RaisingUnitsModalProps) {
  const [activeUnitRow, setActiveUnitRow] = useState<RaisingUnitRow>();
  const [d100roll, setD100Roll] = useState<number>(0);
  const [unitsRaisedList, setUnitsRaisedList] = useState<
    RaisingUnitRow[] | null
  >(null);
  const [ancestries, setAncestries] = useState<Ancestry[] | null>(null);
  const [experienceLevels, setExperienceLevels] = useState<
  ExperienceLevel[] | null
>(null);
const [equipmentLevels, setEquipmentLevels] = useState<
  EquipmentLevel[] | null
>(null);
const [sizeLevels, setSizeLevels] = useState<SizeLevel[] | null>(null);
const [types, setTypes] = useState<UnitType[] | null>(null);
  const [sendingData, setSendingData] = useState<boolean>(false);
  const [responseOk, setResponseOk] = useState<boolean>(false);
  const [unit, setUnit] = useState<Unit>({
    ancestry: {
      name: "",
      attackBonus: 0,
      powerBonus: 0,
      defenseBonus: 0,
      toughnessBonus: 0,
      moraleBonus: 0,
    },
    equipment: {
      name: "",
      defenseBonus: 0,
      powerBonus: 0,
    },
    experience: {
      name: "",
      attackBonus: 0,
      toughnessBonus: 0,
      moraleBonus: 0,
    },
    type: {
      name: "",
      attackBonus: 0,
      powerBonus: 0,
      defenseBonus: 0,
      toughnessBonus: 0,
      moraleBonus: 0,
      costModifier: 0,
    },
    casualties: 0,
    isMercenary: false,
    name: "",
    size: {
      costModifier: 0,
      sizeLevel: 0,
      unitSize: 0,
    },
    stronghold_id: strongholdId,
    traits: [],
    user_id: Number(userId),
    id: 0,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [allFieldsComplete, setAllFieldsComplete] = useState<boolean>(false);

  //Data object to be sent to DB
  const newUnitData = {
    user_id: unit?.user_id,
    unit_name: unit?.name,
    stronghold_id: unit?.stronghold_id,
    ancestry: unit?.ancestry?.name,
    experience: unit?.experience?.name,
    equipment: unit?.equipment?.name,
    unit_type: unit?.type?.name,
    size_level: unit?.size?.sizeLevel,
    casualties: unit?.casualties,
    mercenary: unit?.isMercenary,
  };

  function rollOnTable() {
    const roll = Math.floor(Math.random() * 100) + 1;
    setD100Roll(roll);
  }

  function handleClose(){
    setD100Roll(0);
    setVisible(false);
  }

  function handleSelectChange(objectKey: string, objectValue: string) {
    setUnit({
      ...unit,
      [objectKey]: {
        ...unit[objectKey],
        name: objectValue
      },
    });
  }

  function handleInputChange(e: { target: { value: string } }) {
    setUnit({
      ...unit,
      name: e.target.value,
    });
  }

  function setInitialUnitValues(){
    setLoading(true);
      setUnit({
        ...unit,
        ancestry:{
          ...unit.ancestry,
          name: "human"
        },
        size:{
          ...unit.size,
          unitSize: 4
        }
      })
    setLoading(false);
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

  async function fetchUnitExperience(): Promise<void> {
    if (!experienceLevels) {
      setLoading(true);

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/units/experience_levels`
        );

        if (!res.ok) {
          throw new Error("There was a problem fetching this data");
        }

        const data = await res.json();
        setExperienceLevels(data.experience_levels);
      } catch (err) {
        console.log(err.message);
      } finally {
        setLoading(false);
      }
    }
  }

  async function fetchUnitEquipment(): Promise<void> {
    if (!equipmentLevels) {
      setLoading(true);

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/units/equipment_levels`
        );

        if (!res.ok) {
          throw new Error("There was a problem fetching this data");
        }

        const data = await res.json();
        setEquipmentLevels(data.equipment_levels);
      } catch (err) {
        console.log(err.message);
      } finally {
        setLoading(false);
      }
    }
  }

  async function fetchUnitTypes(): Promise<void> {
    if (!types) {
      setLoading(true);

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/units/types`
        );

        if (!res.ok) {
          throw new Error("There was a problem fetching this data");
        }

        const data = await res.json();
        setTypes(data.types);
      } catch (err) {
        console.log(err.message);
      } finally {
        setLoading(false);
      }
    }
  }

  async function fetchUnitSizes(): Promise<void> {
    if (!sizeLevels) {
      setLoading(true);

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/units/size_levels`
        );

        if (!res.ok) {
          throw new Error("There was a problem fetching this data");
        }

        const data = await res.json();
        setSizeLevels(data.sizes);
      } catch (err) {
        console.log(err.message);
      } finally {
        setLoading(false);
      }
    }
  }

  fetchUnitsRaised(keepType);

  async function handleSubmit() {
    const newUnitId = await addUnit();
    const data = await addUnitRaised(
      newUnitId,
      strongholdId,
      activeUnitRow?.id
    );

    if (data) {
      const newStatus = updateRaisingUnitsStatus("increment");
      setRaisingUnitsStatus(await newStatus);
    }
  }

  async function updateRaisingUnitsStatus(
    incrementOrDecrement: "increment" | "decrement"
  ) {
    const newValue =
      incrementOrDecrement === "increment"
        ? (raisingUnitsStatus?.current_units ?? 0) + 1
        : (raisingUnitsStatus?.current_units ?? 0) + 1;
    const newBoolean =
      newValue >= (raisingUnitsStatus?.max_units ?? 0) ? true : false;

    const newStatus = await patchRaisingUnitsStatusRow(newValue, newBoolean);

    return newStatus;
  }

  async function patchRaisingUnitsStatusRow(
    newValue: number,
    newBoolean: boolean
  ) {
    const dataObject = {
      currentUnits: newValue,
      hasRaisedAllUnits: newBoolean,
    };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/strongholds/raising_units/status/update/${strongholdId}`,
        {
          method: "PATCH",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(dataObject),
        }
      );

      if (!res.ok) {
        throw new Error("Error: could not update status row");
      }

      const data = await res.json();
      console.log(data.updatedRow);
      return data.updatedRow;
    } catch (err) {
      console.error(err.message);
    } finally {
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

  
  // USE EFFECTS

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
      if (
        !ancestries ||
        !experienceLevels ||
        !equipmentLevels ||
        !sizeLevels ||
        !types
      ) {
        fetchUnitAncestries();
        fetchUnitExperience();
        fetchUnitEquipment();
        fetchUnitSizes();
        fetchUnitTypes();
      } else if (!loading) {
        setInitialUnitValues();
      }
    }, [ancestries, experienceLevels, equipmentLevels, sizeLevels, types]);
  
    useEffect(() => {
      if(ancestries && experienceLevels && equipmentLevels && sizeLevels && types){
        setUnit((prev) => {
          const next = { ...prev };
  
          if (prev.ancestry.name !== "") {
            const newAncestry = ancestries?.find(
              (item) => item.name === prev.ancestry.name
            );
            next.ancestry = {
              ...next.ancestry,
              attackBonus: newAncestry?.attackBonus ?? 0,
              powerBonus: newAncestry?.powerBonus ?? 0,
              defenseBonus: newAncestry?.defenseBonus ?? 0,
              toughnessBonus: newAncestry?.toughnessBonus ?? 0,
              moraleBonus: newAncestry?.moraleBonus ?? 0,
            };
            next.traits = newAncestry?.traits ?? [];
          }
  
          if (prev.experience.name !== "") {
            const newExperienceLevel = experienceLevels?.find(
              (item) => item.levelName == prev.experience.name
            );
            next.experience = {
              ...next.experience,
              attackBonus: newExperienceLevel?.attackBonus ?? 0,
              toughnessBonus: newExperienceLevel?.toughnessBonus ?? 0,
              moraleBonus: newExperienceLevel?.moraleBonus ?? 0,
            };
          }
  
          if (prev.equipment.name !== "") {
            const newEquipmentLevel = equipmentLevels?.find(
              (item) => item.levelName == prev.equipment.name
            );
            next.equipment = {
              ...next.equipment,
              defenseBonus: newEquipmentLevel?.defenseBonus ?? 0,
              powerBonus: newEquipmentLevel?.powerBonus ?? 0,
            };
          }
  
          if (prev.type.name !== "") {
            if (prev.type.name == "levies") {
              next.equipment.name = "levies";
              next.experience.name = "levies";
            } else if (
              prev.equipment.name == "levies" ||
              prev.experience.name == "levies"
            ) {
              next.equipment.name = "light";
              next.experience.name = "green";
            }
            const newType = types?.find((item) => item.name == prev.type.name);
            next.type = {
              ...next.type,
              attackBonus: newType?.attackBonus ?? 0,
              powerBonus: newType?.powerBonus ?? 0,
              defenseBonus: newType?.defenseBonus ?? 0,
              toughnessBonus: newType?.toughnessBonus ?? 0,
              moraleBonus: newType?.moraleBonus ?? 0,
              costModifier: newType?.costModifier ?? 0,
            };
            next.traits = [...next.traits, ...(newType?.traits ?? [])];
          }
          if (prev.size.unitSize !== 0) {
            const newSize = sizeLevels?.find(
              (item) => item.size == prev.size.unitSize
            );
            next.size = {
              ...next.size,
              costModifier: newSize?.costModifier ?? 0,
              sizeLevel: newSize?.levelName ?? 0,
            };
          }
          return next;
        });
      }
    }, [
      unit?.ancestry?.name,
      unit?.experience?.name,
      unit?.equipment?.name,
      unit?.type?.name,
      unit?.size?.unitSize,
      ancestries,
      equipmentLevels,
      sizeLevels,
      experienceLevels,
      types
    ]);

  useEffect(() => {
    setUnit({
      ...unit,
      experience:{
        ...unit.experience,
        name: activeUnitRow?.unit?.experience ?? ""
      },
      equipment:{
        ...unit.equipment,
        name: activeUnitRow?.unit?.equipment ?? ""
      },
      type:{
        ...unit.type,
        name: activeUnitRow?.unit?.type ?? ""
      }
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
        <section className={styles.cardHeader}>Roll on Table <button onClick={handleClose} className={styles.closeButton}>X</button></section>
        <section className={styles.list}>
          <p className={styles.listTitle}>units raised by {keepType}</p>
          <RaisingUnitsList keepType="keep" highlightNumber={d100roll}/>
          <section className={styles.buttonContainer}>
            <button
              className={styles.button}
              onClick={() => {
                handleClose()
              }}
            >
              close{" "}
            </button>

            <button className={styles.button} onClick={rollOnTable}>Roll d100</button>

          </section>
        </section>
        <section className={styles.unitDisplay}>
          <p className={styles.resultText}>Result: {d100roll}</p>
          
          <section className={styles.container}>
            <section className={styles.inputContainer}>
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
                  value={unit?.ancestry?.name}
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
            </section>
            <section className={styles.buttonContainer}>
              <button className={styles.button} disabled={!allFieldsComplete} onClick={handleSubmit}>
                add unit to stronghold
              </button>
            </section>
          </section>
          <section className={styles.unitCardContainer}>
            <UnitCard clickable={false} unit={unit} simplified={true}/>
          </section>
        </section>
      </section>
    </ModalBackground>
  ) : null;
}
