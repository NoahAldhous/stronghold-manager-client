import styles from "./styles.module.scss";
import type { Stronghold } from "types";
import { JSX } from "react";
import LoadingCard from "components/LoadingUI/LoadingCard/LoadingCard";

interface BenefitsProps {
  loading: boolean;
  type: Stronghold["stronghold_type"] | null;
  benefits: Stronghold["features"] | null;
  setContextualInfo: React.Dispatch<
    React.SetStateAction<{ title: string; description: string }>
  >;
}

export default function Benefits({
  loading,
  type,
  benefits,
  setContextualInfo,
}: BenefitsProps): JSX.Element {
  return (
    <section>
      {loading || (!type && !benefits) ? (
        <section className={styles.benefitsContainer}>
          <LoadingCard />
        </section>
      ) : (
        <section className={styles.benefitsContainer}>
          <section className={styles.cardHeader}>
            {type} benefits
          </section>
          {benefits?.map((item, index) => {
            return (
              <button
                className={styles.button}
                onClick={() =>
                  setContextualInfo({
                    title: item.title,
                    description: item.description,
                  })
                }
                key={index}
              >
                {item.title}
              </button>
            );
          })}
        </section>
      )}
    </section>
  );
}
