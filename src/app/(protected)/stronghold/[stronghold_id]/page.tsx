"use client";
import { useAuth } from "contexts/AuthContext";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import styles from "./styles.module.scss";
import type { Stronghold } from "types";
import StrongholdFeatures from "components/StrongholdFeatures.tsx/StrongholdFeatures";
import LoadingCard from "components/LoadingUI/LoadingCard/LoadingCard";
import UpgradeStrongholdModal from "components/Modal/UpgradeStrongholdModal/UpgradeStrongholdModal";
import Stats from "components/StrongholdSheet/Stats/Stats";
import Benefits from "components/StrongholdSheet/Benefits/Benefits";
import FeatureImprovement from "components/StrongholdSheet/FeatureImprovement/FeatureImprovement";
import Treasury from "components/StrongholdSheet/Treasury/Treasury";

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
  const [stronghold, setStronghold] = useState<Stronghold | null>(null);

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

  const [upgradeModal, setUpgradeModal] = useState<boolean>(false);

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
    if (stronghold && strongholdIsUpgraded) {
      updateClassFeatureImprovementUses(stronghold?.stronghold_level);
      setStrongholdIsUpgraded(false);
    }
  }, [stronghold?.stronghold_level]);

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
  }

  return (
    <main className={styles.main}>
      <section className={styles.strongholdSheetContainer}>
        <section className={styles.strongholdSheet}>
          {loading || !stronghold ? (
            <section className={styles.sheetFirstRow}>
              <div className={styles.loadingName}></div>
              <div className={styles.loadingInfo}></div>
              <div className={styles.loadingInfo}></div>
            </section>
          ) : (
            <section className={styles.sheetFirstRow}>
              <section className={styles.strongholdTitle}>
                <p className={styles.strongholdName}>
                  {stronghold?.stronghold_name}
                </p>
                <p className={styles.strongholdSubHeading}>
                  {stronghold?.owner_name}
                  <span className={styles.lowerCase}>&apos;s</span> Level{" "}
                  {stronghold?.stronghold_level} {stronghold?.stronghold_type}
                </p>
                <p className={styles.strongholdSubHeading}>
                  {stronghold?.class.name}
                  <span className={styles.lowerCase}>&apos;s</span>{" "}
                  {stronghold?.class.stronghold_name}
                </p>
              </section>
              <section className={styles.strongholdInfo}>
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
          <section className={styles.sheetSecondRow}>
            <Stats loading={loading} stats={stronghold?.stats ?? null} />
            <Benefits
              loading={loading}
              type={stronghold?.stronghold_type ?? null}
              benefits={stronghold?.features ?? null}
              setContextualInfo={setContextualInfo}
            />
            <FeatureImprovement
              loading={loading}
              level={stronghold?.stronghold_level ?? null}
              improvement={stronghold?.class?.class_feature_improvement ?? null}
              setContextualInfo={setContextualInfo}
              updateUses={updateClassFeatureImprovementUses}
            />
          </section>
          <section className={styles.sheetThirdRow}>
            <Treasury
              loading={loading}
              treasury={stronghold?.treasury ?? null}
              level={stronghold?.stronghold_level ?? null}
              type={stronghold?.stronghold_type ?? null}
              id={stronghold?.id ?? null}
              stronghold={stronghold ?? null}
              setStronghold={setStronghold}
            />
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
                  userId={userId}
                  strongholdId={stronghold_id}
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
