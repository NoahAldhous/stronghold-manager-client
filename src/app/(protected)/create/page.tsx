"use client";
import styles from "./styles.module.scss";
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
