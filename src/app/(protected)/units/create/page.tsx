"use client";
import UnitCard from "components/UnitCard/UnitCard";
import styles from "./styles.module.scss";
import { useState } from "react";
import type { Unit } from "types";
import { useAuth } from "contexts/AuthContext";
import UnitEditor from "components/UnitEditor/UnitEditor";

export default function Page() {
  const { userId } = useAuth();

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
    stronghold_id: null,
    traits: [],
    user_id: Number(userId),
    id: 0,
  });

  return (
    <main className={styles.main}>
      <section className={styles.container}>
        <UnitEditor unit={unit} setUnit={setUnit} mode={"create"}/>
        <UnitCard unit={unit} clickable={false}/>
      </section>
    </main>
  );
}
