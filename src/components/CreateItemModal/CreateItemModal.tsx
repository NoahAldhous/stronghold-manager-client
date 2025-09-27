"use client";
import styles from "./styles.module.scss";
import Link from "next/link";

export default function CreateItemModal({loading, strongholdId}){

    return(
        <main className={styles.modalBackground}>
            <div className={styles.modalMenu}>
                {loading ? <div>loading...</div> :
                <div>
                    <p>Success! Your stronghold has been created</p>
                    <Link href="/">Back to dashboard</Link>
                    <Link href={`/stronghold/${strongholdId}`}>
                        Go to my Stronghold
                    </Link>
                </div>
                }
            </div>
        </main>
    )

}