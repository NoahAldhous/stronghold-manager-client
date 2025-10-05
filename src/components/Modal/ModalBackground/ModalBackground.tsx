import styles from "./styles.module.scss";

export default function ModalBackground({ children }: { children : React.ReactNode}){
    return <main className={styles.modalBackground}>
        {children}
    </main>
}