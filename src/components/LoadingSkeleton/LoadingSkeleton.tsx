import styles from "./styles.module.scss"

export default function LoadingSkeleton(){
    return(
        <main className={styles.main}>
            <section className={styles.loadingScreen}>
                <span className={styles.loader}></span>
                <p className={styles.text}>Loading</p>
            </section>
        </main>
    )
}