import RaisingUnitsList from "components/RaisingUnitsList/RaisingUnitsList";
import styles from "./Styles.module.scss";

export default function ContextualMenu(){

    function renderText(){
        return <section className={styles.content}>hello world
            <RaisingUnitsList keepType="keep"/>
        </section>
    }

    return <div className={styles.contextualPanel}>
        <section className={styles.cardHeader}>header</section>
        {renderText()}
    </div>
}