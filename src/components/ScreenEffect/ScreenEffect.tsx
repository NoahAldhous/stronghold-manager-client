import styles from "./styles.module.scss";

export default function ScreenEffect(){

    const array=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]

    return <div className={styles.screen}>
        {/* {array.map((item =>
            <div key={item} className={styles.cube}>{item}</div>
        ))} */}
    </div>
}