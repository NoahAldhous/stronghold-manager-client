import ModalBackground from "../ModalBackground/ModalBackground";
import styles from "./styles.module.scss";

export default function UpgradeStrongholdModal({visible, setVisible, setStronghold, stronghold, level}){

    function handleUpgrade(){

        setStronghold({...stronghold, stronghold_level: level + 1})
        setVisible(false);
    }

    return  visible ? <ModalBackground> 
        <section className={styles.modalMenu}>
            <section className={styles.cardHeader}>upgrade stronghold</section>
                <section className={styles.textContainer}>
                    <p className={styles.text}>cost to upgrade:<span></span></p>
                    <p className={styles.text}>time to upgrade:<span></span></p>
                </section>
                <section className={styles.buttonContainer}>
                    <button onClick={() => setVisible(false)}className={styles.button}>cancel</button>
                    <button onClick={handleUpgrade} className={styles.button}>upgrade</button>
                </section>
        </section>
    </ModalBackground> : null
}