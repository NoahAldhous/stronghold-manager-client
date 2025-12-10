import RaisingUnitsList from "components/RaisingUnitsList/RaisingUnitsList";
import styles from "./Styles.module.scss";

export default function ContextualMenu({infoType}:{infoType: string}){

    function renderText(){
                switch(infoType){
                    case "raising units":
                        return <RaisingUnitsList keepType="keep"/>
                    break;
                }
    }

    return <div className={styles.contextualPanel}>
        <section className={styles.cardHeader}>{infoType}</section>
        <section className={styles.content}>
            { renderText() }
        </section>
    </div>
}