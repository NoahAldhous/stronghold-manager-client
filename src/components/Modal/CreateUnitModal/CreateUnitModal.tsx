"use client";

import styles from "./styles.module.scss";
import ModalBackground from "../ModalBackground/ModalBackground";
import LoadingCard from "components/LoadingUI/LoadingCard/LoadingCard";
import LoadingBar from "components/LoadingUI/LoadingBar/LoadingBar";

export default function CreateUnitModal({
    visible,
    setVisible,
    sendingData,
}) {
    return visible ? (
        <ModalBackground>
            { sendingData ? (
                <section className={styles.modalMenu}>
                    <section className={styles.cardHeader}>create unit</section>
                    <p>creating unit...</p>
                    <LoadingBar colour="dark"/>
                </section>
            ) : (
                <section className={styles.modalMenu}>
                    <p>unit created!</p>
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