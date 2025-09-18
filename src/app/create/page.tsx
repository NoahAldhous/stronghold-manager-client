"use client";
import { act, useEffect, useState } from "react";
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
  const [activeStrongholdClass, setActiveStrongholdClass] = useState({
    id:0,
    name: "",
    strongholdName: "",
    strongholdDescription: "",
    demesneEffects: [
      {
        description: ""
      }
    ],
    featureImprovement: {
      name: "",
      restriction: "",
      description: ""
    },
    strongholdActions: [
      {
        name: "",
        description: ""
      }
    ]
  })
  const [strongholdTypes, setStrongholdTypes] = useState([
    {
      type_name: "",
      id: 0,
    },
  ]);
  const [strongholdClasses, setStrongholdClasses] = useState([
    {
      id: 0,
      name: "",
      strongholdDescription: "",
      strongholdName: "",
      demesneEffects: [
        {
          description: ""
        }
      ],
      featureImprovement: {
        name: "",
        description: "",
        restriction: ""
      },
      strongholdActions: [
        {
          name: "",
          description: ""
        }
      ]
    }
  ])
  const [userStronghold, setUserStronghold] = useState({
    user_id: userId,
    stronghold_name: "",
    owner_name: "",
    stronghold_level: 1,
    stronghold_type: "keep",
    stronghold_class: "fighter"
  });

  // hard-code levels for simplicity
  const levels = [1, 2, 3, 4, 5];

  //redirect user to login/signup page if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    } else {
      fetchStrongholdTypes();
      fetchStrongholdClasses();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    setActiveStrongholdClass(
      strongholdClasses.filter(strongholdClass => strongholdClass.name == userStronghold.stronghold_class)[0]
    )
    console.log(activeStrongholdClass)
  }, [userStronghold.stronghold_class])

  async function fetchStrongholdTypes() {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/strongholds/types`
      );

      if (!res.ok) {
        throw new Error("Could not fetch data");
      }

      const data = await res.json();
      // console.log(data.data);
      setStrongholdTypes(data.data);
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function fetchStrongholdClasses() {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/strongholds/classes/list`
      );

      if(!res.ok) {
        throw new Error("Could not fetch data");
      }

      const data = await res.json();
      console.log(data.data);
      setStrongholdClasses(data.data);
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false)
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

  function handleStrongholdClassChange(strongholdClass: string) {
    setUserStronghold({...userStronghold, stronghold_class: strongholdClass})
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
            <section className={styles.formSection}>
              <p className={styles.formText}>Select Stronghold Class</p>
                <div className={`${styles.buttonContainer}`}>
                  {strongholdClasses.map((item) => {
                    return (
                      <button
                        onClick={() => handleStrongholdClassChange(item.name)}
                        key={item.id}
                        className={`${styles.button} ${userStronghold.stronghold_class == item.name ? styles.activeButton : ""}`}
                      >
                        {item.name}
                      </button>
                    );
                  })}
                </div>
            </section>
          </section>
          <section className={styles.formFooter}>
            <div className={styles.costToBuild}> cost to build:</div>
            <button className={styles.createButton} onClick={handleSubmit}>Create</button>
          </section>
        </div>
        <div className={styles.features}>
          <section className={styles.header}>
            <p className={styles.headerText}>Stronghold Features</p>
            <p className={styles.headerText}>
              {userStronghold.stronghold_type}
            </p>
          </section>
            {strongholdClasses.map( item => (
              item.name == userStronghold.stronghold_class ?
              <section className={styles.body} key={item.id}>
                    <h3>Stronghold Class: the {item.name}&apos;s {item.strongholdName}</h3>
                    <p>{item.strongholdDescription}</p>
                    <h4>Demesne Effects</h4>
                    <ul>
                      {item.demesneEffects.map( effect => (
                        <li key={effect.description}>{effect.description}</li>
                      ))}
                    </ul>
                    <h4>Class Feature Improvement</h4>
                    <h5>{item.featureImprovement.name}</h5>
                    <p>{item.featureImprovement.description}</p>
                    <p>{item.featureImprovement.restriction}</p>
                    <h4>Stronghold Actions</h4>
                    <ul>
                      {item.strongholdActions.map( action => (
                        <li key={action.name}>
                          <h5>{action.name}</h5>
                          <p>{action.description}</p>
                        </li>
                      ))}
                    </ul>
                  </section>
              : null
            ))}
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
