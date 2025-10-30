"use client";
import { useAuth } from "contexts/AuthContext";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import styles from "./styles.module.scss";
import type { Units, Unit, DeleteModalSettings } from "types";
import UnitCard from "components/UnitCard/UnitCard";
import Link from "next/link";
import LoadingCard from "components/LoadingUI/LoadingCard/LoadingCard";
import DeleteItemModal from "components/DeleteItemModal/DeleteItemModal";

interface StrongholdName {
  id: number;
  name: string;
}

export default function Page({
  params,
}: {
  params: Promise<{ user_id: string }>;
}) {
  const { user_id } = use(params);
  const [strongholdNames, setStrongholdNames] = useState<
    StrongholdName[] | null
  >(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [units, setUnits] = useState<Units | null>(null);
  const [filteredUnits, setFilteredUnits] = useState<Units | null>(null);
  const [deleteModalSettings, setDeleteModalSettings] =
    useState<DeleteModalSettings>({
      isVisible: false,
      itemId: 0,
      itemType: "unit",
      urlSlug: "units",
    });

  const router = useRouter();
  const { isLoggedIn, userId } = useAuth();

  //redirect user to login/signup page if no token
  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
      //if logged in user and route dont match, redirect to home page.
    } else if (userId !== user_id) {
      router.push("/");
    } else {
      fetchUnitsByUserId(user_id);
      fetchStrongholdNames(user_id);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if(!deleteModalSettings.isVisible){
        setFilteredUnits(units)
    }
  }, [deleteModalSettings.isVisible])

  function handleFilterChange(e: { target: { value: string } }) {
    const filter = e.target.value;
    if (filter === "null") {
      setFilteredUnits(units);
    } else {
      const newUnitsList = units?.filter(
        (item) => item.stronghold_id === Number(filter)
      );
      setFilteredUnits(newUnitsList ?? units);
    }
  }

  async function fetchUnitsByUserId(user_id: string) {
    if (!units) {
      setLoading(true);

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/units/user/${user_id}`
        );

        if (!res.ok) {
          throw new Error("There was a problem fetching unit data.");
        }

        const data = await res.json();
        setUnits(data.units);
        setFilteredUnits(data.units);
      } catch (err) {
        console.log(err.message);
      } finally {
        setLoading(false);
      }
    }
  }

  async function fetchStrongholdNames(user_id: string): Promise<void> {
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

  return (
    <main className={styles.main}>
      <section className={styles.unitNav}>
        <section className={styles.filterContainer}>
          <p>
            {filteredUnits?.length} units{" "}
            <span className={styles.fadedText}>({units?.length} total)</span>
          </p>
          <section>
            <label htmlFor="strongholds">filter by stronghold:</label>
            <select
              name="strongholds"
              className={styles.dropDown}
              onChange={handleFilterChange}
            >
              <option value="null">all</option>
              {strongholdNames?.map((stronghold, index) => (
                <option key={index} value={stronghold.id}>
                  {stronghold.name}
                </option>
              ))}
            </select>
          </section>
        </section>
        <section className={styles.buttonContainer}>
          <Link className={styles.link} href="/units/create">
            create a unit
          </Link>
        </section>
      </section>
      {loading ? (
        <section className={styles.unitBody}>
          {Array.from({ length: 6 }).map((_, index) => (
            <span key={index} className={styles.loading}>
              <LoadingCard />
            </span>
          ))}
        </section>
      ) : (
        <section className={styles.unitBody}>
          {filteredUnits?.map((unit) => (
            <UnitCard key={unit.id} unit={unit} deleteModalSettings={deleteModalSettings} setDeleteModalSettings={setDeleteModalSettings}/>
          ))}
        </section>
      )}
      <section className={styles.footer}></section>
      {deleteModalSettings.isVisible ? (
        <DeleteItemModal
          deleteModalSettings={deleteModalSettings}
          setDeleteModalSettings={setDeleteModalSettings}
          itemList={units}
          setItemList={setUnits}
        />
      ) : null}
    </main>
  );
}
