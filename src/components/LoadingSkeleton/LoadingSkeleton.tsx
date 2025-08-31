import styles from "./styles.module.scss"

export default function LoadingSkeleton(){
    return(
        <main className={styles.main}>
            <p className={styles.text}>Loading...</p>
        </main>
    )
}