"use client";
import { useEffect, useState } from "react";
import { useAuth } from "contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
    stronghold_type: "",
  });
  const levels = [1,2,3,4,5]

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
  };

  async function handleSubmit() {
    setLoading(true);

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/strongholds/create`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(userStronghold)
        });

        if (!res.ok) {
            throw new Error("Error: Could not create stronghold")
        }

        //if success, will create message
        const data = await res.json();
        console.log(data)
        //create message modal, with buttons which either - return to list of strongholds or navigates to created stronghold page
        if (data.id) {
            setStrongholdId(data.id)
            setDisplayModal(true)
        }

    } catch (err) {
        console.log(err.message)
    } finally {
        setLoading(false)
    }
  }

  function handleStrongholdTypeChange(type: string) {
    setUserStronghold({ ...userStronghold, stronghold_type: type });
  };

  function handleStrongholdLevelChange(level: number) {
    setUserStronghold({ ...userStronghold, stronghold_level: level });
  };

  function handleOwnerNameChange(e: {target: {value: string}}) {
    setUserStronghold({
        ...userStronghold,
        owner_name: e.target.value
    });
  };

  function handleStrongholdNameChange(e: {target: {value: string}}) {
    setUserStronghold({
        ...userStronghold,
        stronghold_name: e.target.value
    });
  };

  return (
    <>
      <h1>Create a Stronghold</h1>
        {strongholdTypes.map((item) => {
          return <button onClick={() => handleStrongholdTypeChange(item.type_name)} key={item.id}>{item.type_name}</button>;
        })}
        <br/>
        {levels.map((item) => {
            return <button onClick={() => handleStrongholdLevelChange(item)} key={item}>{item}</button>
        })}
      <br/>
      <label>
        Stronghold Owner:
        <input
            type="text"
            name="owner_name"
            value={userStronghold.owner_name}
            onChange={handleOwnerNameChange}
            ></input>
      </label>
      <label>
        Stronghold Name:
        <input
            type="text"
            name="stronghold_name"
            value={userStronghold.stronghold_name}
            onChange={handleStrongholdNameChange}
            ></input>
      </label>
      <h3>User Object</h3>
      <p>
        id: {userStronghold.user_id} <br />
        name: {userStronghold.stronghold_name} <br />
        owner_name: {userStronghold.owner_name} <br />
        level: {userStronghold.stronghold_level} <br />
        type: {userStronghold.stronghold_type} <br />
      </p>
      <br/>
      <button onClick={handleSubmit}>CREATE</button>
    {
        displayModal ? 
            <div>
                <h4>Success! Your stronghold has been created</h4>
                <Link href="/">Back to dashboard</Link>
                <Link href={`/stronghold/${strongholdId}`}>View my stronghold id: {strongholdId}</Link>
            </div>  
        :
            null
    }
    </>
  );
}
