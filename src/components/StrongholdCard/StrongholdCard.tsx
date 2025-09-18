import Link from "next/link"
import styles from "./styles.module.scss"

export default function StrongholdCard({stronghold, setDeleteItemModal}){

    function handleDelete(){
        setDeleteItemModal({
            isVisible: true,
            strongholdId: stronghold.id,
        })
    }

    return(
        <section className={styles.card}>
            <Link href={`/stronghold/${stronghold.id}`} className={styles.textContainer}>
                <p className={styles.name}>{stronghold.name}</p>
                <p className={styles.info}>Level {stronghold.level} {stronghold.type} ({stronghold.ownerClass}&apos;s {stronghold.classStrongholdName})</p>
            </Link>
            <section className={styles.buttonContainer}>
                <button onClick={() => handleDelete()}>delete</button>
            </section>
        </section>
    )
}