"use client";

import UnitCard from "components/UnitCard/UnitCard";
import { useEffect, useState } from "react";
import { DeleteModalSettings, Unit } from "types";
import styles from "./styles.module.scss";
import Link from "next/link";
import DeleteItemModal from "components/DeleteItemModal/DeleteItemModal";

interface UnitContextualPanelProps {
  contextualPanelType: {
    type: string;
    subtype: string;
  };
}

export default function UnitContextualPanel({
  contextualPanelType,
}: UnitContextualPanelProps) {
  const unitId = contextualPanelType.subtype;

  const [unit, setUnit] = useState<Unit | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  async function fetchUnit(id: string) {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/units/${id}`);

      if (!res.ok) {
        throw new Error(
          "There was a problem fetching the unit, please try again."
        );
      }

      const data = await res.json();
      setUnit(data.unit);
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setUnit(null);
    fetchUnit(unitId);
  }, [unitId]);

  return (
    <div className={styles.container}>
      <section className={styles.cardContainer}>
        {
          unit ? (
            <UnitCard unit={unit} clickable={false} simplified={true} />
          ) : null //TODO: replace with loading UI
        }
      </section>
      <section className={styles.buttonContainer}>
        <Link href={`/units/edit/${unit?.id}`} className={styles.link}>
          edit
        </Link>
        <button onClick={() => {handleDelete(unit?.id)}} className={styles.button}>delete</button>
      </section>
    </div>
  );
}
