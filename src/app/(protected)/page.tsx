"use client";
import { useEffect, useState } from "react";
import { useAuth } from "contexts/AuthContext";
import Link from "next/link";
import styles from "./styles.module.scss";
import StrongholdCard from "components/StrongholdCard/StrongholdCard";
import DeleteItemModal from "components/DeleteItemModal/DeleteItemModal";
import LoadingCard from "components/LoadingUI/LoadingCard/LoadingCard";

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [noStrongholds, setNoStrongholds] = useState< boolean | undefined >(undefined);
  const [deleteItemModal, setDeleteItemModal] = useState({
    isVisible: false,
    strongholdId: 0
  })
  const [listOfStrongholds, setListOfStrongholds] = useState<{
    id: number,
    name: string,
    ownerName: string,
    level: number,
    type: string,
    ownerClass: string,
    classStrongholdName: string
  }[] | null>(null)

  const { isLoggedIn, logout, userId, userName } = useAuth();

  //redirect user to login/signup page if not logged in
  useEffect(() => {
    if (userId) {
      fetchStrongholdsByUserId();
    }
  }, [userId]);

  useEffect(() => {
    if (listOfStrongholds?.length === 0) {
      setNoStrongholds(true);
    } else {
      setNoStrongholds(false)
    }
  }, [listOfStrongholds]);

  async function fetchStrongholdsByUserId() {
    setLoading(true)
    setNoStrongholds(undefined)

    try {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/strongholds/user/${userId}`);

    if (!res.ok) {
        throw new Error("There was a problem getting a response.");
    }

    const data = await res.json();
    console.log(data.strongholds)
    if (data.strongholds.length === 0) {
        setNoStrongholds(true);
    } else {
      setNoStrongholds(false)
      setListOfStrongholds(data.strongholds)
    }
    } catch (err) {
    console.log(err.message);
    } finally {
    setLoading(false);
    }
  }
  //TODO: break this up into components
  return (
    <main className={styles.main}>
      <section className={styles.strongholdsContainer}>
        <div className={styles.cardHeader}>Welcome, {userName}!</div>
        {loading || (!listOfStrongholds && !noStrongholds) ?
          <section className={styles.loadingContainer}>
            <LoadingCard/>
          </section>
          : noStrongholds ? (
            <div className={styles.noStrongholdsContainer}>
            <p>You have no strongholds!</p>
            <Link className={styles.createButton} href="/create">Create your first stronghold</Link>
          </div>
          ) : ( 
          <>
            <section className={styles.listText}>
              <p>your strongholds</p>
            </section>
            <div className={styles.list}>
              <div className={styles.cardContainer}>
                {listOfStrongholds?.map((item, index) => {
                  return (
                    <StrongholdCard key={index} stronghold={item} setDeleteItemModal={setDeleteItemModal}/>
                    // <Link href={`/stronghold/${item.id}`} key={index}>name: {item.stronghold_name}</Link>
                  )
                })}
              </div>
            </div>
            <section className={styles.createButtonContainer}>
              <Link className={styles.createButton} href="/create">Create a new stronghold</Link>
            </section>
          </>
          )
      }
        {/* {noStrongholds && !loading ? (
          <div>
            <p>you have no strongholds! boo!</p>
            <Link href="/create">Create your first stronghold</Link>
          </div>
        ) : (
          <div className={styles.list}>
            <p>here are your strongholds:</p>
              <div className={styles.cardContainer}>
                {listOfStrongholds.map((item, index) => {
                  return (
                    <StrongholdCard key={index} stronghold={item} setDeleteItemModal={setDeleteItemModal}/>
                    // <Link href={`/stronghold/${item.id}`} key={index}>name: {item.stronghold_name}</Link>
                  )
                })}
              </div>
              <br/>
              <section className={styles.createButtonContainer}>
                <Link className={styles.createButton} href="/create">Create a new stronghold</Link>
              </section>
          </div>
        )} */}
      </section>
      {deleteItemModal.isVisible ? 
        <DeleteItemModal deleteItemModal={deleteItemModal} setDeleteItemModal={setDeleteItemModal} listOfStrongholds={listOfStrongholds} setListOfStrongholds={setListOfStrongholds}/>
      : null
      }
    </main>
  );
}
