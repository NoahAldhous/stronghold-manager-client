"use client";
import styles from "./styles.module.scss";
import ModalBackground from "../ModalBackground/ModalBackground";
import LoadingBar from "components/LoadingUI/LoadingBar/LoadingBar";
import { SetStateAction } from "react";

interface UnitModalProps {
    visible: boolean;
    setVisible: React.Dispatch<SetStateAction<boolean>>;
    sendingData: boolean;
    responseOk: boolean;
    mode: "create" | "edit";
}

export default function UnitModal({
    visible,
    setVisible,
    responseOk,
    sendingData,
    mode
}: UnitModalProps) {


    return visible ? (
        <ModalBackground>
            { sendingData ? (
                <section className={styles.modalMenu}>
                    <section className={styles.cardHeader}>{mode === "create" ? "create unit" : "save unit"}</section>
                    <p>{mode === "create" ? "creating unit..." : "saving unit..."}</p>
                    <LoadingBar colour="dark"/>
                </section>
            ) : (
                <section className={styles.modalMenu}>
                    {
                        responseOk ?
                            <p>{mode === "create" ? "unit created!" : "unit saved!"}</p>
                        : <p>Oops, something went wrong.</p>
                    }
                    <section className={styles.buttonContainer}>
                        <button
                            className={styles.button}
                            onClick={() => setVisible(false)}
                        >
                            back
                        </button>
                        <button
                            className={styles.button}
                        >
                            go to my units
                        </button>
                    </section>
                </section>
            ) }
        </ModalBackground>
    ) : null;
}