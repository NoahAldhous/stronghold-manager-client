import styles from "./styles.module.scss";

type loadingBarProps = {
    colour: "light" | "dark"
}

export default function LoadingBar({colour}:loadingBarProps){
    return <span className={`${styles.loadingBar} ${colour == "light" ? styles.light : styles.dark}`}/>
}