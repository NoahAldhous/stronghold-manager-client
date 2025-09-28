import LoadingBar from "./LoadingBar/LoadingBar";
import styles from "./styles.module.scss";

export default function LoadingSkeleton(){
    return(
        <main className={styles.main}>
            <section className={styles.loadingScreen}>
                <p className={styles.text}>Loading</p>
                <LoadingBar colour="light"/>
            </section>
        </main>
    )
}