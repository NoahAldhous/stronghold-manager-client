import styles from "./styles.module.scss";
import { useState } from "react";

export default function StrongholdCreator(){

    const [progress, setProgress] = useState(1);

    function incrementProgress(){
        if ( progress < 4 ){
            setProgress(progress => progress+1)
        }
    }

    function decrementProgress(){
        if (progress > 1){
            setProgress(progress => progress-1)
        }
    }

    return <div className={styles.container}>
        <section className={styles.card}>
            <section className={styles.cardHeader}>stronghold creator</section>
            <section className={styles.cardBody}>
                <section className={styles.cardIntro}>{progress}</section>
                <section className={styles.cardContent}></section>
                <section className={styles.cardFooter}>
                    <button className={styles.button} onClick={decrementProgress}>cancel</button>
                    <section className={styles.progressBar}>
                        <div className={`${styles.progressIcon} ${progress >= 1 ? styles.progressMark : ""}`}></div>
                        <div className={`${styles.progressIcon} ${progress >= 2 ? styles.progressMark : ""}`}></div>
                        <div className={`${styles.progressIcon} ${progress >= 3 ? styles.progressMark : ""}`}></div>
                        <div className={`${styles.progressIcon} ${progress >= 4 ? styles.progressMark : ""}`}></div>
                    </section>
                    <button className={styles.button} onClick={incrementProgress}>next</button>
                </section>
            </section>
        </section>






        <section className={styles.card}>
        <section className={styles.cardHeader}>choose a type</section>
        </section>
    </div>
}