"use client";
import RaisingUnitsList from "components/RaisingUnitsList/RaisingUnitsList";
import styles from "./Styles.module.scss";
import { useState } from "react";
import RaisingUnitsModal from "components/Modal/RaisingUnitsModal/RaisingUnitsModal";

interface ContextualPanelProps {
    infoType: string;
    strongholdId: number;
}

export default function ContextualMenu({infoType, strongholdId}:ContextualPanelProps){

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
                            <RaisingUnitsModal visible={visible} setVisible={setVisible} keepType="keep" strongholdId={strongholdId}/>
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