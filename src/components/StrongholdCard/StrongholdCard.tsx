import Link from "next/link"
import styles from "./styles.module.scss"
import { ReactNode, SetStateAction } from "react"
import type { DeleteModalSettings } from "types"

interface StrongholdSummary {
    id: number;
    name: string;
    level: number;
    type: string;
    ownerClass: string;
    classStrongholdName: string
}

export default function StrongholdCard({stronghold, deleteModalSettings, setDeleteModalSettings} : {stronghold: StrongholdSummary, deleteModalSettings: DeleteModalSettings, setDeleteModalSettings: React.Dispatch<SetStateAction<DeleteModalSettings>>}): ReactNode{

    function handleDelete(){
        setDeleteModalSettings({
            ...deleteModalSettings,
            isVisible: true,
            itemId: stronghold.id,
        })
    }

    return(
        <section className={styles.card}>
            <Link href={`/stronghold/${stronghold.id}`} className={styles.textContainer}>
                <p className={styles.name}>{stronghold.name}</p>
                <p className={styles.info}>Level {stronghold.level} {stronghold.type}</p> 
                <p className={styles.class}>{stronghold.ownerClass}&apos;s {stronghold.classStrongholdName}</p>
            </Link>
            <section className={styles.buttonContainer}>
                <button onClick={() => handleDelete()}>delete</button>
            </section>
        </section>
    )
}