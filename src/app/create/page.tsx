"use client";
import { useEffect, useState } from "react";
import { useAuth } from "contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./styles.module.scss";
import CreateItemModal from "components/CreateItemModal.tsx/CreateItemModal";

export default function Page() {
  const router = useRouter();
  const { isLoggedIn, logout, userId, userName } = useAuth();
  const [loading, setLoading] = useState(false);
  const [strongholdId, setStrongholdId] = useState(0);
  const [displayModal, setDisplayModal] = useState(false);
  const [strongholdTypes, setStrongholdTypes] = useState([
    {
      type_name: "",
      id: 0,
    },
  ]);
  const [userStronghold, setUserStronghold] = useState({
    user_id: userId,
    stronghold_name: "",
    owner_name: "",
    stronghold_level: 1,
    stronghold_type: "keep",
  });
  const levels = [1, 2, 3, 4, 5];

  //redirect user to login/signup page if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    } else {
      fetchStrongholdTypes();
    }
  }, [isLoggedIn]);

  async function fetchStrongholdTypes() {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/strongholds/types`
      );

      if (!res.ok) {
        throw new Error("Could not fetch data");
      }

      const data = await res.json();
      console.log(data.data);
      setStrongholdTypes(data.data);
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit() {
    setLoading(true);
    setDisplayModal(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/strongholds/create`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(userStronghold),
        }
      );

      if (!res.ok) {
        throw new Error("Error: Could not create stronghold");
      }

      //if success, will create message
      const data = await res.json();
      console.log(data);
      //create message modal, with buttons which either - return to list of strongholds or navigates to created stronghold page
      if (data.id) {
        setStrongholdId(data.id);
      }
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleStrongholdTypeChange(type: string) {
    setUserStronghold({ ...userStronghold, stronghold_type: type });
  }

  function handleStrongholdLevelChange(level: number) {
    setUserStronghold({ ...userStronghold, stronghold_level: level });
  }

  function handleOwnerNameChange(e: { target: { value: string } }) {
    setUserStronghold({
      ...userStronghold,
      owner_name: e.target.value,
    });
  }

  function handleStrongholdNameChange(e: { target: { value: string } }) {
    setUserStronghold({
      ...userStronghold,
      stronghold_name: e.target.value,
    });
  }

  return (
    <main className={styles.main}>
      <section className={styles.container}>
        <div className={styles.form}>
          <div className={styles.header}>
            <p className={styles.headerText}>Create a Stronghold</p>
          </div>
          <section className={styles.formBody}>
            <section className={styles.formSection}>
              <p className={styles.formText}>Select stronghold type</p>
              <div className={styles.buttonContainer}>
                {strongholdTypes.map((item) => {
                  return (
                    <button
                      onClick={() => handleStrongholdTypeChange(item.type_name)}
                      key={item.id}
                      className={`${styles.button} ${userStronghold.stronghold_type == item.type_name ? styles.activeButton : ""}`}
                    >
                      {item.type_name}
                    </button>
                  );
                })}
              </div>
            </section>
            <section className={styles.formSection}>
              <p className={styles.formText}>Select level</p>
              <div className={styles.buttonContainer}>
                {levels.map((item) => {
                  return (
                    <button
                      onClick={() => handleStrongholdLevelChange(item)}
                      key={item}
                      className={`${styles.button} ${userStronghold.stronghold_level == item ? styles.activeButton : ""}`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </section>
            <section className={styles.formSection}>
              <p className={styles.formText}>Choose method of acquisition</p>
              <section className={styles.buttonContainer}>

              </section>
            </section>
            <section className={styles.formSection}>
              <label className={styles.formText}>
                Stronghold Owner: 
                <input
                type="text"
                name="owner_name"
                value={userStronghold.owner_name}
                onChange={handleOwnerNameChange}
                ></input>
              </label>
              <label className={styles.formText}>
                Stronghold Name: 
                <input
                type="text"
                name="stronghold_name"
                value={userStronghold.stronghold_name}
                onChange={handleStrongholdNameChange}
                ></input>
              </label>
            </section>
          </section>
          <section className={styles.formFooter}>
            <div className={styles.costToBuild}> cost to build:</div>
            <button className={styles.createButton} onClick={handleSubmit}>Create</button>
          </section>
        </div>
        <div className={styles.features}>
          <div className={styles.header}>
            <p className={styles.headerText}>Stronghold Features</p>
            <p className={styles.headerText}>
              {userStronghold.stronghold_type}
            </p>
          </div>
        </div>
      </section>
      {displayModal ? (
        <CreateItemModal loading={loading} strongholdId={strongholdId}/>
        // <div>
        //   <h4>Success! Your stronghold has been created</h4>
        //   <Link href="/">Back to dashboard</Link>
        //   <Link href={`/stronghold/${strongholdId}`}>
        //     View my stronghold id: {strongholdId}
        //   </Link>
        // </div>
      ) : null}
    </main>
  );
}
