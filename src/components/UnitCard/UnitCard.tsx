import styles from "./styles.module.scss";
import { StatsCalculator } from "lib/StatsCalculator";
import type { Unit } from "types";


type UnitCardProps = {
    unit: Unit;
}

export default function UnitCard({ unit }: UnitCardProps){

    const calc = StatsCalculator.fromUnit(unit);
    const stats = calc.getStats(true);
    console.log(stats)

    return (
        <div key={unit?.unit_id} className={styles.card}>   
            <section className={styles.cardTop}>
                <section className={styles.cardBanners}>
                    <div className={styles.banner}>
                        {
                            Array.from({length: (unit.experience.moraleBonus + 1)}).map((_, index) => (
                                <span key={index} className={styles.experienceDiamondContainer}>
                                    <span className={styles.experienceDiamond}/>
                                </span>
                            ))
                        }
                        <span className={styles.bannerBottom}>
                            <span className={styles.diamond}/>
                        </span>
                    </div>
                    <div className={styles.banner}>
                        <span className={styles.bannerBottom}>
                        <span className={styles.diamond}/>
                        </span>
                    </div>
                </section>
                <section className={styles.cardOverview}>
                    <section className={styles.cardHeader}>
                        {unit?.name}
                    </section>
                    <section className={styles.cardSummary}>
                        <p className={styles.cardText}>
                            {unit?.ancestry.name} {unit?.experience.name}
                        </p>
                        <p className={styles.cardText}>
                            {unit?.equipment.name} {unit?.type.name}
                        </p>
                    </section>
                    <section className={styles.cardCost}>cost: {stats.costs.cost}gp</section>
                </section>
            </section>
            <section className={styles.cardStats}>
                <div className={styles.statRow}>
                    <div className={styles.stat}>
                        <p className={styles.statText}>attack:</p>
                        <p className={styles.statText}>+{stats.attack}</p>
                    </div>
                    <div className={styles.stat}>
                        <p className={styles.statText}>defense:</p>
                        <p className={styles.statText}>{stats.defense}</p>
                    </div>
                </div>
                <div className={styles.statRow}>
                <div className={styles.stat}>
                        <p className={styles.statText}>power:</p>
                        <p className={styles.statText}>+{stats.power}</p>
                    </div>
                    <div className={styles.stat}>
                        <p className={styles.statText}>toughness:</p>
                        <p className={styles.statText}>{stats.toughness}</p>
                    </div>
                </div>
                <div className={styles.statRow}>
                <div className={styles.stat}>
                        <p className={styles.statText}>morale:</p>
                        <p className={styles.statText}>+{stats.morale}</p>
                    </div>
                    <div className={styles.stat}>
                        <p className={styles.statText}>size:</p>
                        <p className={styles.statText}>{unit.size.unitSize - unit.casualties}/{unit.size.unitSize}</p>
                    </div>
                </div>
            </section>
            <section className={styles.cardTraits}>
                <section className={styles.title}>traits</section>
                <section className={styles.traits}>
                    {unit?.traits?.map((trait, index) => 
                        <div key={index}>
                            <p className={styles.traitName}>{trait.traitName}</p>
                            <p className={styles.traitDescription}>{trait.traitDescription}</p>
                        </div>
                    )}
                </section>
            </section>
        </div>
    )

}