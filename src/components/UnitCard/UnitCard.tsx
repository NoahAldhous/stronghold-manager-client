import styles from "./styles.module.scss";
import { Unit } from "types";

type UnitCardProps = {
    unit: Unit;
}

export default function UnitCard({ unit }: UnitCardProps){
    return (
        <div
            key={unit?.unit_id}
            className={styles.card}
        >
            
            <p>{unit?.name}</p>
        </div>
    )

}