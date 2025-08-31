"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "contexts/AuthContext";
import Link from "next/link";

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [noStrongholds, setNoStrongholds] = useState(true);
  const [listOfStrongholds, setListOfStrongholds] = useState([{
    id: 0,
    stronghold_name: "",
    owner_name:"",
    stronghold_level:0,
    stronghold_type_id:0,
  },])
  const router = useRouter();
  const { isLoggedIn, logout, userId, userName } = useAuth();

  //redirect user to login/signup page if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    } else {
      fetchStrongholdsByUserId();
    }
  }, [isLoggedIn]);

  async function fetchStrongholdsByUserId() {
    setLoading(true)

    try {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/strongholds/user/${userId}`);

    if (!res.ok) {
        throw new Error("There was a problem getting a response.");
    }

    //TODO: in api, change so object does not return 'data:', instead returns 'strongholds:'
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
    <>
      <h1>Welcome, {userName}!</h1>
      <h2>You should only be here if you are logged in!</h2>

      <button onClick={logout}>Log Out</button>
      {noStrongholds && !loading ? (
        <div>
          <p>you have no strongholds! boo!</p>
          <Link href="/create">Create your first stronghold</Link>
        </div>
      ) : (
        <div>
          <p>here are your strongholds:</p>
            {listOfStrongholds.map((item, index) => {
              return (
                <Link href={`/stronghold/${item.id}`} key={index}>name: {item.stronghold_name}</Link>
              )
            })}
            <br/>
          <Link href="/create">Create a new stronghold</Link>
        </div>
        
      )}
    </>
  );
}
