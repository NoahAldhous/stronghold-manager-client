import styles from "./styles.module.scss";
import type { Stronghold } from "types";
import { JSX } from "react";
import LoadingCard from "components/LoadingUI/LoadingCard/LoadingCard";

interface ImprovementProps {
    loading: boolean;
    improvement: Stronghold["class"]["class_feature_improvement"] | null;
    level: Stronghold["stronghold_level"] | null;
    setContextualInfo: React.Dispatch<
        React.SetStateAction<{ title: string; description: string }>
    >;
    updateUses: (uses:number) => Promise<void>;
}

export default function FeatureImprovement({
    loading,
    improvement,
    level,
    setContextualInfo,
    updateUses,
}: ImprovementProps): JSX.Element{

    return(
        <section>
            {loading || !improvement ? (
                <section className={styles.improvementContainer}>
                    <LoadingCard/>
                </section>
            ): (
                <section className={styles.improvementContainer}>
                    <div className={styles.cardHeader}>
                        class feature improvement
                    </div>
                    <button 
                        className={styles.featureButton}
                        onClick={() =>
                            setContextualInfo({
                                title: improvement?.name,
                                description: `${improvement?.description} ${improvement?.restriction}`
                            })
                        }
                    >
                        {improvement.name}
                    </button>
                    <section className={styles.usesContainer}>
                        <p>Uses: </p>
                        {Array.from({
                            length: level ?? 0,
                        }).map((_, index) => (
                            <div
                                className={`
                                    ${styles.diamond}
                                    ${index + 1  <= improvement.uses 
                                        ? styles.active
                                        : ""
                                    }    
                                `}
                                key={index}
                            />
                        ))}
                        <button
                            className={styles.useButton}
                            onClick={() =>
                                updateUses(
                                    improvement.uses -1
                                )
                            }
                        >
                            use
                        </button>
                    </section>
                </section>
            )}
        </section>
    )
}