"use client"
import { useState } from "react"
import styles from "./styles.module.scss"

export default function DeleteItemModal({deleteItemModal, setDeleteItemModal, listOfStrongholds, setListOfStrongholds}){

    const [loading, setLoading] = useState(false);

    function handleCancel(){
        setDeleteItemModal({...deleteItemModal, isVisible: false})
    }

    async function handleDelete(){
        setLoading(true);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/strongholds/delete/${deleteItemModal.strongholdId}`, {method: "DELETE"})

            if(!res.ok){
                throw new Error("Error occured, could not delete item")
            }

            const data = await res.json()
            console.log(data)
        } catch (err) {
            console.log(err.message)
        } finally {
            setLoading(false);
            setListOfStrongholds(
                listOfStrongholds.filter(stronghold => stronghold.id !== deleteItemModal.strongholdId)
            )
            setDeleteItemModal({strongholdId: 0, isVisible: false})
        }
    }

    return(
        <main className={styles.modalBackground}>
            <section className={styles.modalMenu}>
                <section className={styles.cardHeader}>delete stronghold</section>
                <section className={styles.modalTextContainer}>
                    <p className={styles.modalText}>Are you sure you want to permanently delete this stronghold?</p>
                </section>
                <section className={styles.modalButtonContainer}>
                    <button className={styles.modalButton} onClick={handleCancel}>cancel</button>
                    <button className={`${styles.modalButton} ${styles.deleteButton}`} onClick={handleDelete}>delete</button>
                </section>
            </section>
        </main>
    )
}