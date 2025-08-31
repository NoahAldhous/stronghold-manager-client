"use client";
import { useAuth } from "contexts/AuthContext";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import styles from "./styles.module.scss";

export default function Page({
  params,
}: {
  params: Promise<{ stronghold_id: string }>;
}) {
  const { stronghold_id } = use(params);
  const [loading, setLoading] = useState(false);
  const [stronghold, setStronghold] = useState({
    id: 0,
    owner_name: "",
    stronghold_level: 0,
    stronghold_name: "",
    stronghold_size: "",
    stronghold_type: "",
    upgrade_cost: 0,
    features: [
      {
        title: "",
        description: "",
      },
      {
        title: "",
        description: "",
      },
    ],
    stats: {
      morale_bonus: 0,
      toughness: 0,
    },
  });

  const router = useRouter();
  const { isLoggedIn } = useAuth();

  //redirect user to login/signup page if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    } else {
      fetchStrongholdById();
    }
  }, [isLoggedIn]);

  async function fetchStrongholdById() {
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/strongholds/data/${stronghold_id}`
      );

      if (!res.ok) {
        throw new Error("There was a problem fetching stronghold data");
      }

      //TODO: in api, change so object does not return 'data:', instead returns 'stronghold:'
      const data = await res.json();
      setStronghold(data.stronghold);
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={styles.main}>
      <section className={styles.strongholdSheetContainer}>
        <section className={styles.strongholdSheet}>
          <section className={styles.strongholdOverview}>
            <p className={styles.strongholdName}>{stronghold.stronghold_name}</p>
            <section className={styles.strongholdInfo}>
              <p>Level {stronghold.stronghold_level} {stronghold.stronghold_type}</p>
            </section>
          </section>
          <section className={styles.strongholdStats}>
            <section className={styles.numericalStats}>
              <div className={styles.strongholdSize}>
                <div>
                  {stronghold.stronghold_size}
                </div>
                <p>size</p>
              </div>  
              <div className={styles.strongholdSize}>
                <div>
                  {stronghold.stronghold_size}
                </div>
                <p>size</p>
              </div>  
              <div className={styles.strongholdSize}>
                <div>
                  {stronghold.stronghold_size}
                </div>
                <p>size</p>
              </div>  
            </section>
          </section>
          <section className={styles.strongholdAssets}></section>
        </section>
        <section className={styles.contextualPanel}></section>
      </section>
      {/* <h1>Stronghold: {stronghold_id}</h1>
      <p>{stronghold_id}</p> */}
    </main>
  );
}
