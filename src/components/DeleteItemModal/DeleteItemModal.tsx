"use client";
import { useState } from "react";
import styles from "./styles.module.scss";
import { DeleteModalSettings } from "types";

interface DeleteItemModalProps {
    deleteModalSettings: DeleteModalSettings;
    setDeleteModalSettings: React.Dispatch<React.SetStateAction<DeleteModalSettings>>;
    itemList?: any;
    setItemList?: any;
    contextualPanelType?: {
      type: string;
      subtype: string;
    };
    setContextualPanelType?: React.Dispatch<React.SetStateAction<{
      type: string;
      subtype:string;
    }>>;

}

export default function DeleteItemModal({
  deleteModalSettings,
  setDeleteModalSettings,
  itemList,
  setItemList,
  contextualPanelType, 
  setContextualPanelType
}: DeleteItemModalProps) {
  const [loading, setLoading] = useState(false);

  function handleCancel() {
    setDeleteModalSettings({ ...deleteModalSettings, isVisible: false });
  }

  async function handleDelete() {
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/${deleteModalSettings.urlSlug}/delete/${deleteModalSettings.itemId}`,
        { method: "DELETE" }
      );

      if (!res.ok) {
        throw new Error("Error occured, could not delete item");
      }

      const data = await res.json();
      console.log(data);
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
      if(itemList){
        setItemList(
          itemList.filter((item) => item.id !== deleteModalSettings.itemId)
        );
      }
      if(contextualPanelType && setContextualPanelType){
        setContextualPanelType({
          type: "",
          subtype: ""
        })
      }
      setDeleteModalSettings({
        ...deleteModalSettings,
        itemId: 0,
        isVisible: false,
      });
    }
  }

  return (
    <main className={styles.modalBackground}>
      <section className={styles.modalMenu}>
        <section className={styles.cardHeader}>
          delete {deleteModalSettings.itemType}
        </section>
        <section className={styles.modalTextContainer}>
          <p className={styles.modalText}>
            Are you sure you want to permanently delete this{" "}
            {deleteModalSettings.itemType}?
          </p>
        </section>
        <section className={styles.modalButtonContainer}>
          <button
            disabled={loading}
            className={styles.modalButton}
            onClick={handleCancel}
          >
            cancel
          </button>
          <button
            disabled={loading}
            className={`${styles.modalButton} ${styles.deleteButton}`}
            onClick={handleDelete}
          >
            delete
          </button>
        </section>
      </section>
    </main>
  );
}
