"use client";
import RaisingUnitsList from "components/RaisingUnitsList/RaisingUnitsList";
import styles from "./Styles.module.scss";
import { useEffect, useState } from "react";
import RaisingUnitsModal from "components/Modal/RaisingUnitsModal/RaisingUnitsModal";
import { ArtisanShop, DeleteModalSettings, RaisingUnitsStatus, Stronghold } from "types";
import ArtisanContextualPanel from "./ArtisanContextualPanel/ArtisanContextualPanel";
import RetainerContextualPanel from "./FollowerContextualPanel/RetainerContextualPanel/RetainerContextualPanel";
import UnitContextualPanel from "./UnitContextualPanel/UnitContextualPanel";

interface ContextualPanelProps {
  contextualPanelType: { type: string; subtype: string };
  strongholdId: number;
  userId: string | null;
  raisingUnitsStatus: RaisingUnitsStatus | null;
  setRaisingUnitsStatus: React.Dispatch<
    React.SetStateAction<RaisingUnitsStatus>
  >;
  strongholdBenefits:
    | {
        title: string;
        description: string;
      }[]
    | null;
  needToUpdate: {
    artisans: boolean;
  };
  setNeedToUpdate: React.Dispatch<React.SetStateAction<{ artisans: boolean }>>;
  treasury: Stronghold["treasury"] | null;
  stronghold: Stronghold;
  setStronghold: React.Dispatch<React.SetStateAction<Stronghold | null>>;
  deleteModalSettings: DeleteModalSettings;
  setDeleteModalSettings: React.Dispatch<React.SetStateAction<DeleteModalSettings>>;
}

export default function ContextualMenu({
  contextualPanelType,
  strongholdId,
  userId,
  raisingUnitsStatus,
  setRaisingUnitsStatus,
  strongholdBenefits,
  needToUpdate,
  setNeedToUpdate,
  treasury,
  stronghold,
  setStronghold,
  deleteModalSettings,
  setDeleteModalSettings
}: ContextualPanelProps) {
  const [visible, setVisible] = useState<boolean>(false);

  function displayModal() {
    setVisible(true);
  }

  function renderContent() {
    switch (contextualPanelType.type) {
      case "stronghold benefits":
        switch (contextualPanelType.subtype) {
          case "raising units":
            const feature = strongholdBenefits?.filter(
              (item) => item?.title === "raising units"
            );
            return (
              <>
                <p>{feature ? feature[0].description : ""}</p>
                {raisingUnitsStatus?.has_raised_all_units ? null : (
                  <div>
                    <p>
                      you have{" "}
                      <span>
                        {(raisingUnitsStatus?.max_units ?? 0) -
                          (raisingUnitsStatus?.current_units ?? 0)}
                      </span>{" "}
                      units left to raise
                    </p>
                  </div>
                )}
                <div className={styles.buttonContainer}>
                  <button onClick={displayModal} className={styles.button}>
                    roll on table
                  </button>
                </div>
                <RaisingUnitsModal
                  visible={visible}
                  setVisible={setVisible}
                  keepType="keep"
                  strongholdId={strongholdId}
                  userId={userId}
                  raisingUnitsStatus={raisingUnitsStatus}
                  setRaisingUnitsStatus={setRaisingUnitsStatus}
                />
              </>
            );
        }
      case "artisan":
        return (
          <ArtisanContextualPanel
            contextualPanelType={contextualPanelType}
            strongholdId={strongholdId}
            needToUpdate={needToUpdate}
            setNeedToUpdate={setNeedToUpdate}
            treasury={treasury}
            stronghold={stronghold}
            setStronghold={setStronghold}
          />
        );
      case "retainer":
        return (
          <RetainerContextualPanel
            contextualPanelType={contextualPanelType}
            
          />
        );
      case "unit":
        return (
          <UnitContextualPanel
            contextualPanelType={contextualPanelType}
            deleteModalSettings={deleteModalSettings}
            setDeleteModalSettings={setDeleteModalSettings}
          />
        )
    }
  }

  return (
    <div className={styles.contextualPanel}>
      <section className={styles.cardHeader}>
        {contextualPanelType.subtype}
      </section>
      <section className={styles.content}>{renderContent()}</section>
    </div>
  );
}
