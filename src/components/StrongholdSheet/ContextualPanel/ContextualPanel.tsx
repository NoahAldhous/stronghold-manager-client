"use client";
import RaisingUnitsList from "components/RaisingUnitsList/RaisingUnitsList";
import styles from "./Styles.module.scss";
import { useState } from "react";
import RaisingUnitsModal from "components/Modal/RaisingUnitsModal/RaisingUnitsModal";
import { RaisingUnitsStatus } from "types";

interface ContextualPanelProps {
    infoType: string;
    strongholdId: number;
    userId: string | null;
    raisingUnitsStatus: RaisingUnitsStatus | null;
    setRaisingUnitsStatus: React.Dispatch<React.SetStateAction<RaisingUnitsStatus>>;
}

export default function ContextualMenu({
    infoType, 
    strongholdId, 
    userId,
    raisingUnitsStatus,
    setRaisingUnitsStatus
}:ContextualPanelProps){

    const [visible, setVisible] = useState<boolean>(false);

    function displayModal(){
        setVisible(true);
    }

    function renderContent(){
                switch(infoType){
                    case "raising units":
                        return <>
                            <RaisingUnitsList keepType="keep"/>
                            <div className={styles.buttonContainer}>
                                <button onClick={displayModal} className={styles.button}>roll on table</button>
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
                }
    }

    return <div className={styles.contextualPanel}>
        <section className={styles.cardHeader}>{infoType}</section>
        <section className={styles.content}>
            { renderContent() }
        </section>
    </div>
}