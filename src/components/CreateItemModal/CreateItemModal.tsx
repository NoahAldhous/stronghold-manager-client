"use client";
import LoadingBar from "components/LoadingUI/LoadingBar/LoadingBar";
import styles from "./styles.module.scss";
import Link from "next/link";

export default function CreateItemModal({sendingData, strongholdId}){

    return(
        <main className={styles.modalBackground}>
            <div className={styles.modalMenu}>
                <div className={styles.cardHeader}>
                    {sendingData ? "creating stronghold"
                    : "stronghold created"}
                </div>
                {sendingData ? <div className={styles.loading}>
                    <p>Loading...</p>
                    <LoadingBar colour="dark"/>
                </div> :
                <div className={styles.success}>
                    <p className={styles.text}>Success! Your stronghold has been created.</p>
                    <section className={styles.buttonContainer}>
                        <Link className={styles.button} href="/">Back to dashboard</Link>
                        <Link className={styles.button} href={`/stronghold/${strongholdId}`}>
                            Go to my Stronghold
                        </Link>
                    </section>
                </div>
                }
            </div>
        </main>
    )

}