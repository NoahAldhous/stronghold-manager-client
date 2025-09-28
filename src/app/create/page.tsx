"use client";
import { useEffect, useState } from "react";
import { useAuth } from "contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./styles.module.scss";
import CreateItemModal from "components/CreateItemModal/CreateItemModal";
import StrongholdCreator from "components/StrongholdCreator/StrongholdCreator";

export default function Page() {

  return (
    <main className={styles.main}>
      <section className={styles.container}>
        <StrongholdCreator/>
      </section>
    </main>
  );
}
