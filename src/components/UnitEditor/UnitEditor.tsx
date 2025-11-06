import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import { useAuth } from "contexts/AuthContext";
import LoadingCard from "components/LoadingUI/LoadingCard/LoadingCard";
import type {
    Unit,
    Ancestry,
    ExperienceLevel,
    EquipmentLevel,
    SizeLevel,
    UnitType
} from "types";
import Tooltip from "components/Tooltip/Tooltip";
import CreateUnitModal from "components/Modal/CreateUnitModal/CreateUnitModal";

interface StrongholdName {
    id: number; 
    name: string;
}

export default function UnitEditor({unit, setUnit}) {
    //Get user id from auth context
    const { userId } = useAuth();

  const [loading, setLoading] = useState<boolean>(false);
  const [sendingData, setSendingData] = useState<boolean>(false);
  const [displayModal, setDisplayModal] = useState<boolean>(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);
  const [hovered, setHovered] = useState<boolean>(false);

  //changes the ui between a 'create a new unit' menu and 'edit existing unit' menu
  const [editorSettings, setEditorSettings] = useState({
    headerText: "create a unit",
  });

  const [ancestries, setAncestries] = useState<Ancestry[] | null>(null);
  const [experienceLevels, setExperienceLevels] = useState<
    ExperienceLevel[] | null
  >(null);
  const [equipmentLevels, setEquipmentLevels] = useState<
    EquipmentLevel[] | null
  >(null);
  const [sizeLevels, setSizeLevels] = useState<SizeLevel[] | null>(null);
  const [types, setTypes] = useState<UnitType[] | null>(null);
  const [strongholdNames, setStrongholdNames] = useState<
    StrongholdName[] | null
  >(null);

  //Data object to be sent to DB
  const newUnitData = {
    user_id: unit.user_id,
    unit_name: unit.name,
    stronghold_id: unit.stronghold_id,
    ancestry: unit.ancestry.name,
    experience: unit.experience.name,
    equipment: unit.equipment.name,
    unit_type: unit.type.name,
    size_level: unit.size.sizeLevel,
    casualties: unit.casualties,
    mercenary: unit.isMercenary
  };

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
        console.log(data);
        setAncestries(data.ancestries);
      } catch (err) {
        console.log(err.message);
      } finally {
        setLoading(false);
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
        console.log(data);
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
        console.log(data);
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
        console.log(data);
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
        console.log(data);
        setSizeLevels(data.sizes);
      } catch (err) {
        console.log(err.message);
      } finally {
        setLoading(false);
      }
    }
  }

  async function fetchStrongholdNames(): Promise<void> {
    if (!strongholdNames) {
      setLoading(true);

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/strongholds/names/${userId}`
        );

        if (!res.ok) {
          throw new Error("There was a problem fetching this data");
        }

        const data = await res.json();
        setStrongholdNames(data.strongholds);
      } catch (err) {
        console.log(err.message);
      } finally {
        setLoading(false);
      }
    }
  }

  //Set initial values of the select inputs

  function setInitialUnitValues() {
    setUnit({
      ...unit,
      ancestry: {
        ...unit.ancestry,
        name: "human",
      },
      experience: {
        ...unit.experience,
        name: "green",
      },
      equipment: {
        ...unit.equipment,
        name: "light",
      },
      type: {
        ...unit.type,
        name: "infantry",
      },
      size: {
        ...unit.size,
        unitSize: 4,
      },
      isMercenary: false,
    });
  }

  //INPUT VALUE CHANGES

  function handleUnitNameChange(e: { target: { value: string } }) {
    setUnit({
      ...unit,
      name: e.target.value,
    });
  }

  function handleMercenaryChange(e: { target: { checked: boolean } }) {
    setUnit({
      ...unit,
      isMercenary: e.target.checked,
    });
  }

  function handleStrongholdChange(e: { target: { value: string } }) {
    if (e.target.value === "null") {
      setUnit({
        ...unit,
        stronghold_id: null,
      });
    } else {
      setUnit({
        ...unit,
        stronghold_id: Number(e.target.value),
      });
    }
  }

  function handleSelectChange(objectKey: string, objectValue: string | number) {
    if (objectKey === "size") {
      setUnit({
        ...unit,
        size: {
          ...unit.size,
          unitSize: Number(objectValue),
        },
      });
    } else {
      setUnit({
        ...unit,
        [objectKey]: {
          ...unit[objectKey],
          name: objectValue,
        },
      });
    }
  }

  //SUBMIT DATA TO DB
  //TODO: Refactor to either create or edit unit- different urls

  async function handleSubmit() {
    setSendingData(true);
    setDisplayModal(true);

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
      }

      const data = await res.json();
      console.log(data);
      //TODO: capture data for navigation to unit page or stronghold page?
    } catch (err) {
      console.log(err.message);
    } finally {
      setSendingData(false);
    }
  }

  // USE EFFECT

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
      fetchStrongholdNames();
    } else if (!loading) {
      setInitialUnitValues();
    }
  }, [ancestries, experienceLevels, equipmentLevels, sizeLevels, types]);

  useEffect(() => {
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
          sizeLevel: Number(newSize?.levelName) ?? 0,
        };
      }
      return next;
    });
  }, [
    unit.ancestry.name,
    unit.experience.name,
    unit.equipment.name,
    unit.type.name,
    unit.size.unitSize,
  ]);

  useEffect(() => {
    if (unit.name !== "") {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [unit.name]);

  return loading ? (
    <section className={styles.form}>
      <LoadingCard />
    </section>
  ) : (
    <section className={styles.form}>
      <section className={styles.cardHeader}>
        {editorSettings.headerText}
      </section>
      <section className={styles.formSection}>
              <p className={styles.label}>name:</p>
              <input
                className={styles.input}
                placeholder="name your unit..."
                type="text"
                maxLength={40}
                name="unit_name"
                value={unit.name}
                onChange={handleUnitNameChange}
              />
            </section>
            <section className={styles.formSection}>
              <label className={styles.label} htmlFor="ancestry-select">
                ancestry:
              </label>
              <select
                value={unit.ancestry.name}
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
            <section className={styles.formSection}>
              <label className={styles.label} htmlFor="experience-select">
                experience:
              </label>
              <select
                disabled={unit.type.name === "levies"}
                value={unit.experience.name}
                className={styles.select}
                onChange={(e) =>
                  handleSelectChange("experience", e.target.value)
                }
                name="experience"
                id="experience-select"
              >
                {experienceLevels?.map((experienceLevel, index) => (
                  <option
                    hidden={experienceLevel.levelName === "levies"}
                    key={index}
                    value={experienceLevel.levelName}
                  >
                    {experienceLevel.levelName}
                  </option>
                ))}
              </select>
            </section>
            <section className={styles.formSection}>
              <label className={styles.label} htmlFor="equipment-select">
                equipment:
              </label>
              <select
                disabled={unit.type.name === "levies"}
                value={unit.equipment.name}
                className={styles.select}
                onChange={(e) =>
                  handleSelectChange("equipment", e.target.value)
                }
                name="equipment"
                id="equipment-select"
              >
                {equipmentLevels?.map((equipmentLevel, index) => (
                  <option
                    hidden={equipmentLevel.levelName === "levies"}
                    key={index}
                    value={equipmentLevel.levelName}
                  >
                    {equipmentLevel.levelName}
                  </option>
                ))}
              </select>
            </section>
            <section className={styles.formSection}>
              <label className={styles.label} htmlFor="type-select">
                type:
              </label>
              <select
                value={unit.type.name}
                className={styles.select}
                onChange={(e) => handleSelectChange("type", e.target.value)}
                name="type"
                id="type-select"
              >
                {types?.map((type, index) => (
                  <option key={index} value={type.name}>
                    {type.name}
                  </option>
                ))}
              </select>
            </section>
            <section className={styles.formSection}>
              <label className={styles.label} htmlFor="size-select">
                size:
              </label>
              <select
                value={unit.size.unitSize}
                className={styles.select}
                onChange={(e) => handleSelectChange("size", e.target.value)}
                name="size"
                id="size-select"
              >
                {sizeLevels?.map((sizeLevel, index) => (
                  <option key={index} value={sizeLevel.size}>
                    {sizeLevel.size}
                  </option>
                ))}
              </select>
            </section>
            <section className={styles.formSection}>
              <label className={styles.label} htmlFor="stronghold-select">
                stronghold:
              </label>
              <select
                value={unit.stronghold_id ?? 0}
                className={styles.select}
                name="stronghold"
                id="stronghold-select"
                onChange={handleStrongholdChange}
              >
                <option value={"null"}>no stronghold</option>
                {strongholdNames?.map((stronghold, index) => (
                  <option key={index} value={stronghold.id}>
                    {stronghold.name}
                  </option>
                ))}
              </select>
            </section>
            <section className={styles.formSection}>
              <p className={styles.label}>mercenary?:</p>
              <input
                className={styles.input}
                onChange={handleMercenaryChange}
                type="checkbox"
              />
            </section>

            <section className={styles.formSection}>
              <span
                className={styles.createButtonContainer}
                onMouseEnter={
                  isButtonDisabled
                    ? () => setHovered(true)
                    : () => setHovered(false)
                }
                onMouseLeave={() => setHovered(false)}
              >
                <button
                  disabled={isButtonDisabled}
                  className={styles.button}
                  onClick={handleSubmit}
                >
                  <Tooltip visible={hovered}>unit needs name</Tooltip>
                  Create unit
                </button>
              </span>
            </section>
            <CreateUnitModal
                visible={displayModal}
                setVisible={setDisplayModal}
                sendingData={sendingData}
            />
    </section>
  );
}
