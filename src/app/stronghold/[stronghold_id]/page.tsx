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
    class: {
      name: "",
      stronghold_name: "",
      description: "",
      class_feature_improvement: {
        description: "",
        name: "",
        restriction: ""
      },
      demesne_effects: [
        {
          description: ""
        }
      ],
      stronghold_actions: [
        {
          name: "",
          description: ""
        }
      ]
    }
  });
  const strongholdMenuButtons = [
    "stronghold",
    "units",
    "artisans",
    "followers"
  ]

  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const [contextualInfo, setContextualInfo] = useState({
    title: "",
    description: ""
  })

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
      console.log(data.stronghold)
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
              <p>{stronghold.owner_name}&apos;s Level {stronghold.stronghold_level} {stronghold.stronghold_type}</p>
              <p>{stronghold.class.name}&apos;s {stronghold.class.stronghold_name}</p>
            </section>
          </section>
          <section className={styles.strongholdStats}>
            <section className={styles.numericalStats}>
              <div className={styles.strongholdStatNumber}>
                <div>
                  {stronghold.stronghold_size}
                </div>
                <p>size</p>
              </div>  
              <div className={styles.strongholdStatNumber}>
                <div>
                  +{stronghold.stats.morale_bonus ? stronghold.stats.morale_bonus : 0}
                </div>
                <p>fort bonus</p>
              </div>  
              <div className={styles.strongholdStatNumber}>
                <div>
                  {stronghold.stats.toughness}
                </div>
                <p>toughness</p>
              </div>  
            </section>
            <section className={styles.featuresContainer}>
              <section className={styles.features}>
                {stronghold.features.map((item, index) => {
                  return(<button onClick={() => setContextualInfo({
                    title: item.title,
                    description: item.description
                  })} key={index}>{item.title}</button>)
                })}
              </section>
              <section className={styles.features}>
                <button onClick={() => setContextualInfo({
                  title: stronghold.class.class_feature_improvement.name,
                  description: `${stronghold.class.class_feature_improvement.description} ${stronghold.class.class_feature_improvement.restriction}`
                })}>Class Feature Improvement</button>
                class abilities <br/>
                uses <br/>
                take extended rest <br/>
              </section>
            </section>
          </section>
          <section className={styles.strongholdAssets}>
            <section className={styles.strongholdTreasury}></section>
            <section className={styles.strongholdMenu}>
              <section className={styles.strongholdMenuHeader}>
                {strongholdMenuButtons.map( item => (
                  <button>{item}</button>
                ))}
              </section>
              
            </section>
          </section>
        </section>
        <section className={styles.contextualPanel}>
                <h3>
                  {contextualInfo.title}
                </h3>
                <p>
                  {contextualInfo.description}
                </p>
        </section>
      </section>
    </main>
  );
}
