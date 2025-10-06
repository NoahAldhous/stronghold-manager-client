"use client";
import { useAuth } from "contexts/AuthContext";
import { useRouter, useSelectedLayoutSegment } from "next/navigation";
import { use, useEffect, useState } from "react";
import styles from "./styles.module.scss";
import StrongholdFeatures from "components/StrongholdFeatures.tsx/StrongholdFeatures";
import LoadingCard from "components/LoadingUI/LoadingCard/LoadingCard";
import UpgradeStrongholdModal from "components/Modal/UpgradeStrongholdModal/UpgradeStrongholdModal";

export default function Page({
  params,
}: {
  params: Promise<{ stronghold_id: string }>;
}) {
  const { stronghold_id } = use(params);
  const [loading, setLoading] = useState(false);
  const [strongholdIsUpgraded, setStrongholdIsUpgraded] = useState(false);
  const [activeButton, setActiveButton] = useState({
    category: "stronghold",
    subCategory: "all",
  });
  const [stronghold, setStronghold] = useState<{
    id: number;
    owner_name: string;
    stronghold_level: number;
    stronghold_name: string;
    stronghold_size: number;
    stronghold_type: string;
    upgrade_cost: number;
    treasury: {
      pp: number;
      gp: number;
      sp: number;
      ep: number;
      cp: number;
    };
    features: {
      title: string;
      description: string;
    }[];
    stats: {
      morale_bonus: number;
      toughness: number;
      size: number;
      casualties: number;
    };
    class: {
      name: string;
      stronghold_name: string;
      description: string;
      class_feature_improvement: {
        description: string;
        name: string;
        restriction: string;
        uses: number;
      };
      demesne_effects: {
        description: string;
      }[];
      stronghold_actions: {
        name: string;
        description: string;
      }[];
    };
  } | null>(null);

  const strongholdMenuButtons = [
    {
      category: "stronghold",
      subCategories: [
        "all",
        "stronghold actions",
        "demesne effects",
        `${stronghold?.stronghold_type} benefits`,
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

  const [updatingTreasury, setUpdatingTreasury] = useState<boolean>(false);

  const [upgradeModal, setUpgradeModal] = useState<boolean>(false);

  const [strongholdRevenue, setStrongholdRevenue] = useState<number>(0); 

  const [contextualInfo, setContextualInfo] = useState<{
    title: string | null;
    description: string | null;
  }>({
    title: null,
    description: null,
  });

  const router = useRouter();
  const { isLoggedIn, userId } = useAuth();

  //redirect user to login/signup page if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    } else {
      fetchStrongholdById();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (stronghold) {
      calculateStrongholdRevenue();
      if (strongholdIsUpgraded){
        updateClassFeatureImprovementUses(stronghold?.stronghold_level);
        setStrongholdIsUpgraded(false);
      }
    }
  }, [stronghold?.stronghold_level]);

  function calculateStrongholdRevenue(){
    if( stronghold?.stronghold_type == "establishment") {
      setStrongholdRevenue(1000 * stronghold?.stronghold_level)
    }
  }

  //decrease number of class feature improvement uses
  function updateUses(uses: number) {
    if (stronghold) {
      setStronghold({
        ...stronghold,
        class: {
          ...stronghold?.class,
          class_feature_improvement: {
            ...stronghold?.class?.class_feature_improvement,
            uses: uses,
          },
        },
      });
    }
  }

  async function fetchStrongholdById() {
    if (!stronghold) {
      setLoading(true);
    }

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

  async function updateClassFeatureImprovementUses(uses: number) {
    if (
      stronghold &&
      uses >= 0 &&
      stronghold.class.class_feature_improvement.uses !== uses
    ) {
      console.log("updating number...");
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/strongholds/class_feature_improvement_uses/${stronghold?.id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              uses: uses,
            }),
          }
        );

        if (!res.ok) {
          throw new Error(
            "The application encountered an error trying to update this value"
          );
        }
        const data = await res.json();
        console.log(data.message);
      } catch (err) {
        console.log(err.message);
      } finally {
        updateUses(uses);
      }
    }
  }

  async function updateTreasury(currency: "pp" | "gp" | "sp" | "ep" | "cp", value: number){
    // only runs if stronghold object exists, preventing undefined values 
    if(!stronghold) return;

    setUpdatingTreasury(true)
  
    const newTreasuryValues = {...stronghold?.treasury, [currency]: value};

    setStronghold({...stronghold, treasury: newTreasuryValues})

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/strongholds/treasury/update/${stronghold?.id}`, 
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify( newTreasuryValues )
        }
      );

      if (!res.ok) {
        throw new Error(
          "The application encountered an error trying to update this value"
        );
      }
      const data = await res.json();
      // TODO: backend returns new treasury to reconcile with frontend state
      console.log(data.message);
    } catch (err) {
      console.log(err.message);
      //state rollback
      setStronghold(prev => prev ? {...prev, treasury: stronghold?.treasury}: prev )
    } finally {
      setUpdatingTreasury(false);
    }
  }

  return (
    <main className={styles.main}>
      <section className={styles.strongholdSheetContainer}>
        <section className={styles.strongholdSheet}>
          {loading || !stronghold ? (
            <section className={styles.strongholdOverview}>
              <div className={styles.loadingName}></div>
              <div className={styles.loadingInfo}></div>
              <div className={styles.loadingInfo}></div>
            </section>
          ) : (
            <section className={styles.strongholdOverview}>
              <p className={styles.strongholdName}>
                {stronghold?.stronghold_name}
              </p>
              <section className={styles.strongholdInfo}>
                <div>
                  <p>
                    {stronghold?.owner_name}
                    <span className={styles.lowerCase}>&apos;s</span> Level{" "}
                    {stronghold?.stronghold_level} {stronghold?.stronghold_type}
                  </p>
                  <p>
                    {stronghold?.class.name}
                    <span className={styles.lowerCase}>&apos;s</span>{" "}
                    {stronghold?.class.stronghold_name}
                  </p>
                </div>
                <section className={styles.upgradeContainer}>
                  <button
                    className={styles.restButton}
                    onClick={() =>
                      updateClassFeatureImprovementUses(
                        stronghold?.stronghold_level
                      )
                    }
                  >
                    take extended rest
                  </button>
                  {stronghold?.stronghold_level === 5 ? null : (
                    <div className={styles.upgradeInfo}>
                      <p className={styles.upgradeText}>
                        Cost to Upgrade: {stronghold.upgrade_cost}gp
                      </p>
                      <button onClick={() => setUpgradeModal(true)}>
                        Upgrade
                      </button>
                    </div>
                  )}
                </section>
              </section>
            </section>
          )}
          <section className={styles.strongholdStats}>
            {loading || !stronghold ? (
              <section className={styles.numericalStats}>
                <LoadingCard />
              </section>
            ) : (
              <section className={styles.numericalStats}>
                <section className={styles.cardHeader}>stats</section>
                <div className={styles.statContainer}>
                  <div className={styles.numberContainer}>
                    <div className={styles.strongholdStatNumber}>
                      <div className={styles.statNumberText}>
                        <div>
                          {stronghold?.stats.size -
                            stronghold?.stats.casualties}
                          /{stronghold?.stats?.size}
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className={styles.statName}>size</p>
                </div>
                <div className={styles.statContainer}>
                  <div className={styles.numberContainer}>
                    <div className={styles.strongholdStatNumber}>
                      <div className={styles.statNumberText}>
                        <div>
                          +
                          {stronghold?.stats?.morale_bonus
                            ? stronghold?.stats?.morale_bonus
                            : 0}
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className={styles.statName}>fort bonus</p>
                </div>
                <div className={styles.statContainer}>
                  <div className={styles.numberContainer}>
                    <div className={styles.strongholdStatNumber}>
                      <div className={styles.statNumberText}>
                        <div>{stronghold?.stats?.toughness}</div>
                      </div>
                    </div>
                  </div>
                  <p className={styles.statName}>toughness</p>
                </div>
              </section>
            )}
            <section className={styles.featuresContainer}>
              {loading || !stronghold ? (
                <section className={`${styles.features} ${styles.benefits}`}>
                  <LoadingCard />
                </section>
              ) : (
                <section className={`${styles.features} ${styles.benefits}`}>
                  <div className={styles.cardHeader}>
                    {stronghold?.stronghold_type} benefits
                  </div>
                  {stronghold?.features.map((item, index) => {
                    return (
                      <button
                        className={styles.featureButton}
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
              )}
              {loading || !stronghold ? (
                <section className={styles.features}>
                  <LoadingCard />
                </section>
              ) : (
                <section className={styles.features}>
                  <div className={styles.cardHeader}>
                    class feature improvement
                  </div>
                  <button
                    className={styles.featureButton}
                    onClick={() =>
                      setContextualInfo({
                        title:
                          stronghold?.class?.class_feature_improvement?.name ??
                          null,
                        description: `${
                          stronghold?.class?.class_feature_improvement
                            ?.description ?? ""
                        } ${
                          stronghold?.class?.class_feature_improvement
                            ?.restriction ?? ""
                        }`,
                      })
                    }
                  >
                    {stronghold?.class.class_feature_improvement.name}
                  </button>
                  <section className={styles.usesContainer}>
                    <p>Uses:</p>{" "}
                    {Array.from({
                      length: stronghold?.stronghold_level ?? 0,
                    }).map((_, index) => (
                      <div
                        className={`${styles.diamond} ${
                          index + 1 <=
                          stronghold.class.class_feature_improvement.uses
                            ? styles.activeDiamond
                            : ""
                        }`}
                        key={index}
                      />
                    ))}
                    <button
                      onClick={() =>
                        updateClassFeatureImprovementUses(
                          stronghold?.class?.class_feature_improvement?.uses - 1
                        )
                      }
                      className={styles.useButton}
                    >
                      Use
                    </button>
                  </section>
                </section>
              )}
            </section>
          </section>
          <section className={styles.strongholdAssets}>
            {loading || !stronghold ? (
              <section className={styles.strongholdTreasury}>
                <LoadingCard />
              </section>
            ) : (
              <section className={styles.strongholdTreasury}>
                <div className={styles.cardHeader}>treasury</div>
                <section className={styles.revenueContainer}>
                  <p>Revenue: {strongholdRevenue}gp / Season</p>
                  <button disabled={updatingTreasury} onClick={() => {updateTreasury("gp", stronghold?.treasury.gp + strongholdRevenue)}} className={styles.button}>receive revenue</button>
                </section>
                <section className={styles.currencyContainer}>
                  <div className={styles.textContainer}><span>{stronghold?.treasury?.pp}</span><p className={styles.text}>platinum</p></div>
                  <div className={styles.textContainer}><span>{stronghold?.treasury?.gp}</span><p className={styles.text}>gold</p></div>
                  <div className={styles.textContainer}><span>{stronghold?.treasury?.ep}</span><p className={styles.text}>electrum</p></div>
                  <div className={styles.textContainer}><span>{stronghold?.treasury?.sp}</span><p className={styles.text}>silver</p></div>
                  <div className={styles.textContainer}><span>{stronghold?.treasury?.cp}</span><p className={styles.text}>copper</p></div>
                </section>
              </section>
            )}
            {loading || !stronghold ? (
              <section className={styles.strongholdMenu}>
                <LoadingCard />
              </section>
            ) : (
              <section className={styles.strongholdMenu}>
                <section className={styles.cardHeader}>
                  stronghold features
                </section>
                <section className={styles.strongholdMenuButtons}>
                  <section className={styles.menuCategories}>
                    {strongholdMenuButtons.map((item) => (
                      <button
                        onClick={() =>
                          setActiveButton({
                            category: item.category,
                            subCategory: item.subCategories[0],
                          })
                        }
                        key={item.category}
                        className={`${styles.categoryButton} ${
                          item.category == activeButton.category
                            ? styles.activeButton
                            : ""
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
                              onClick={() =>
                                setActiveButton({
                                  ...activeButton,
                                  subCategory: subCategory,
                                })
                              }
                              className={`${styles.subCategoryButton} ${
                                subCategory == activeButton.subCategory
                                  ? styles.activeButton
                                  : ""
                              }`}
                            >
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
                    strongholdActions={
                      stronghold?.class.stronghold_actions ?? null
                    }
                    demesneEffects={stronghold?.class.demesne_effects ?? null}
                    typeBenefits={stronghold?.features ?? null}
                    classFeatureImprovement={
                      stronghold?.class?.class_feature_improvement ?? null
                    }
                    strongholdType={stronghold?.stronghold_type ?? null}
                    characterClass={stronghold?.class.name ?? null}
                  />
                </section>
              </section>
            )}
          </section>
        </section>
        {loading || !stronghold ? (
          <section className={styles.contextualPanel}>
            <LoadingCard />
          </section>
        ) : (
          <section className={styles.contextualPanel}>
            <div className={styles.cardHeader}>contextual information</div>
            <p className={styles.infoTitle}>{contextualInfo.title}</p>
            <p className={styles.info}>{contextualInfo.description}</p>
          </section>
        )}
        <UpgradeStrongholdModal
          stronghold={stronghold}
          visible={upgradeModal}
          setVisible={setUpgradeModal}
          fetchStronghold={fetchStrongholdById}
          setIsUpgraded={setStrongholdIsUpgraded}
        />
      </section>
    </main>
  );
}
