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
                <p className={styles.name}>{stronghold.stronghold_name}</p>
                <p className={styles.info}>Level {stronghold.stronghold_level} {stronghold.stronghold_type_id}</p>
            </Link>
            <section className={styles.buttonContainer}>
                <button onClick={() => handleDelete()}>delete</button>
            </section>
        </section>
    )
}