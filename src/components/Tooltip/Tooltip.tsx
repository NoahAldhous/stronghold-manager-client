import styles from "./styles.module.scss";

export default function Tooltip({ children, visible }){
    return <span className={`${styles.tooltip} ${visible ? styles.visible : ""}`}>{children}</span>
}