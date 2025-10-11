import styles from "./styles.module.scss";
import type { Stronghold } from "types";
import { JSX } from "react";
import LoadingCard from "components/LoadingUI/LoadingCard/LoadingCard";

interface BenefitsProps {
    loading: boolean;
    stronghold: Stronghold | null;
}

export default function Benefits({
    loading, 
    stronghold,
}: BenefitsProps): JSX.Element{
    return <section>
        { loading || !stronghold ? (
            <section className={styles.benefitsContainer}>
                <LoadingCard/>
            </section>
        ) : (
            <section className={styles.benefitsContainer}>
                <section className={styles.cardHeader}>{stronghold?.stronghold_type} benefits</section>
            </section>

        )

        }
    </section>
}