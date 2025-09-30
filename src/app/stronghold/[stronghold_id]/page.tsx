"use client";
import { useAuth } from "contexts/AuthContext";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import styles from "./styles.module.scss";
import StrongholdFeatures from "components/StrongholdFeatures.tsx/StrongholdFeatures";

export default function Page({
  params,
}: {
  params: Promise<{ stronghold_id: string }>;
}) {
  const { stronghold_id } = use(params);
  const [loading, setLoading] = useState(false);
  const [activeButton, setActiveButton] = useState({
    category: "stronghold",
    subCategory: "stronghold actions"
  });
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
      }
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
        restriction: "",
      },
      demesne_effects: [
        {
          description: "",
        },
      ],
      stronghold_actions: [
        {
          name: "",
          description: "",
        },
      ],
    },
  });

  const strongholdMenuButtons = [
    {
      category: "stronghold",
      subCategories: [
        "all",
        "stronghold actions",
        "demesne effects",
        `${stronghold.stronghold_type} features`,
        "class feature improvement",
      ],
    },
    {
      category: "units",
      subCategories: ["list", "card", "icon"],
    },
    {
      category: "artisans",
      subCategories: ["all", "acquired", "unacquired"],
    },
    {
      category: "followers",
      subCategories: [
        "all",
        "retainers",
        "ambassadors",
        "allies",
        "follower chart",
      ],
    },
  ];
  
  const [contextualInfo, setContextualInfo] = useState({
    title: "",
    description: "",
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

      const data = await res.json();
      setStronghold(data.stronghold);
      console.log(data.stronghold);
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
            <p className={styles.strongholdName}>
              {stronghold.stronghold_name}
            </p>
            <section className={styles.strongholdInfo}>
              <p>
                {stronghold.owner_name}<span className={styles.lowerCase}>&apos;s</span> Level{" "}
                {stronghold.stronghold_level} {stronghold.stronghold_type}
              </p>
              <p>
                {stronghold.class.name}<span className={styles.lowerCase}>&apos;s</span>{" "}
                {stronghold.class.stronghold_name}
              </p>
            </section>
          </section>
          <section className={styles.strongholdStats}>
            <section className={styles.numericalStats}>
              <section className={styles.cardHeader}>
                stats
              </section>
              <div className={styles.statContainer}>
                <div className={styles.strongholdStatNumber}>
                  <div className={styles.statNumberText}>
                    <div>{stronghold.stronghold_size}</div>
                  </div>
                </div>
                <p className={styles.statName}>size</p>
              </div>
              <div className={styles.statContainer}>
                <div className={styles.strongholdStatNumber}>
                  <div className={styles.statNumberText}>
                    <div>
                      +
                      {stronghold.stats.morale_bonus
                        ? stronghold.stats.morale_bonus
                        : 0}
                    </div>
                  </div>
                </div>
                <p className={styles.statName}>fort bonus</p>
              </div>
              <div className={styles.statContainer}>
                <div className={styles.strongholdStatNumber}>
                  <div className={styles.statNumberText}>
                    <div>{stronghold.stats.toughness}</div>
                  </div>
                </div>
                <p className={styles.statName}>toughness</p>
              </div>
            </section>
            <section className={styles.featuresContainer}>
              <section className={styles.features}>
                <div className={styles.cardHeader}>
                  {stronghold.stronghold_type} features
                </div>
                {stronghold.features.map((item, index) => {
                  return (
                    <button
                      onClick={() =>
                        setContextualInfo({
                          title: item.title,
                          description: item.description,
                        })
                      }
                      key={index}
                    >
                      {item.title}
                    </button>
                  );
                })}
              </section>
              <section className={styles.features}>
                <div className={styles.cardHeader}>
                  class improvement
                </div>
                <button
                  onClick={() =>
                    setContextualInfo({
                      title: stronghold.class.class_feature_improvement.name,
                      description: `${stronghold.class.class_feature_improvement.description} ${stronghold.class.class_feature_improvement.restriction}`,
                    })
                  }
                >
                  Class Feature Improvement
                </button>
                class abilities <br />
                uses <br />
                take extended rest <br />
              </section>
            </section>
          </section>
          <section className={styles.strongholdAssets}>
            <section className={styles.strongholdTreasury}>
              <div className={styles.cardHeader}>
                treasury
              </div>
            </section>
            <section className={styles.strongholdMenu}>
              <section className={styles.cardHeader}>
                stronghold features
              </section>
              <section className={styles.strongholdMenuButtons}>
                <section className={styles.menuCategories}>
                  {strongholdMenuButtons.map((item) => (
                    <button
                      onClick={() => setActiveButton({category: item.category, subCategory:item.subCategories[0]})}
                      key={item.category}
                      className={`${styles.categoryButton} ${
                        item.category == activeButton.category ? styles.activeButton : ""
                      }`}
                    >
                      {item.category}
                    </button>
                  ))}
                </section>
                <section className={styles.menuSubCategories}>
                  {strongholdMenuButtons.map((item) =>
                    item.category == activeButton.category
                      ? item.subCategories.map((subCategory) => (
                          <button 
                            key={subCategory}
                            onClick={() => setActiveButton({...activeButton, subCategory: subCategory})}
                            className={`${styles.subCategoryButton} ${
                            subCategory == activeButton.subCategory ? styles.activeButton : ""
                          }`}>
                            {subCategory}
                          </button>
                        ))
                      : null
                  )}
                </section>
              </section>
              <section className={styles.strongholdMenuText}>
                <StrongholdFeatures 
                  activeButton={activeButton}
                  strongholdActions={stronghold.class.stronghold_actions}
                  demesneEffects={stronghold.class.demesne_effects}
                  typeFeatures={stronghold.features}
                  classFeatureImprovement={stronghold.class.class_feature_improvement}
                  strongholdType={stronghold.stronghold_type}
                  characterClass={stronghold.class.name}
                />
              </section>
            </section>
          </section>
        </section>
        <section className={styles.contextualPanel}>
          <div className={styles.cardHeader}>
            contextual information
          </div>
          <p className={styles.infoTitle}>{contextualInfo.title}</p>
          <p className={styles.info}>{contextualInfo.description}</p>
        </section>
      </section>
    </main>
  );
}
