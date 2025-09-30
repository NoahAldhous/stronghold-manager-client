import styles from "./styles.module.scss";

export default function LoadingCard(){
    return <div className={styles.loadingCardContainer}>
    <div className={styles.loadingCardHeader}></div>
    <div className={styles.loadingCardBody}></div>
  </div>
}