import { StrongholdRetainer } from "types";
import styles from "./styles.module.scss";

interface StrongholdRetainerCardProps {
  retainer: StrongholdRetainer;
}

export default function StrongholdRetainerCard({
  retainer,
}: StrongholdRetainerCardProps) {
  const abilities = ["str", "dex", "con", "int", "wis", "cha"];

  return (
    <div className={styles.card}>
      <section className={styles.header}>
        <p className={styles.name}>{retainer.name}</p>
        <p className={styles.title}>
          level {retainer.level} {retainer.ancestry.name} {retainer.title}
        </p>
      </section>
      <section className={styles.stats}>
        <p className={styles.statName}>
          health level{" "}
          <span className={styles.statValue}>
            {retainer.level - retainer.healthLevelsLost}/{retainer.level}
          </span>
        </p>
        <p className={styles.statName}>
          armour class{" "}
          <span className={styles.statValue}>
            {retainer.armourClass.value}({retainer.armourClass.type} armour)
          </span>
        </p>
        <p className={styles.statName}>
          speed{" "}
          <span className={styles.statValue}>{retainer.ancestry.speed}ft</span>
        </p>
      </section>
      <section className={styles.abilities}>
        {abilities.map((item) => (
          <p className={styles.abilityName}>
            {item}
            <span className={styles.abilityMod}>
              {retainer.primaryAbility.some(
                (ability) => ability.abbreviation === item
              )
                ? "+4"
                : "+3"}
            </span>
          </p>
        ))}
      </section>
      <section className={styles.savesAndSenses}>
        <p className={styles.title}>
          saving throws
          {abilities.map((item) => (
            <span className={styles.value}>
              {retainer.savingThrows.some((save) => save.abbreviation === item)
                ? ` ${item} +6`
                : null}
            </span>
          ))}
        </p>
        <p className={styles.title}>skills</p>
        {retainer.ancestry.darkvision > 0 ? (
          <p className={styles.title}>
            senses
            <span className={styles.value}>
              {` darkvision ${retainer.ancestry.darkvision}ft`}
            </span>
          </p>
        ) : null}
      </section>
      <section className={styles.signatureAbility}>
        <p className={styles.title}>
          signature attack:
          <span className={styles.description}>
            {retainer.signatureAttack.type === "spell" ? (
              <span className={styles.italic}>
                {retainer.signatureAttack.name}
              </span>
            ) : (
              <span>
                <span className={styles.italic}>
                  {` ${retainer.signatureAttack.name}:`}
                </span>
                +{retainer.signatureAttack.hitOrDC} to hit,
              </span>
            )}
            {retainer.signatureAttack.range.type === "melee"
              ? `reach ${retainer.signatureAttack.range.reach}ft`
              : ""}
            , one target.
            <span className={styles.italic}>hit:</span>
            {retainer.signatureAttack.damage.average}(
            {retainer.signatureAttack.damage.numberOfDice}d
            {retainer.signatureAttack.damage.diceSize}) 
            {retainer.signatureAttack.type === "spell" ? null : <span>+ {""}{retainer.signatureAttack.damage.modifier})</span>}{" "}
            {retainer.signatureAttack.damage.type} damage.
          </span>
        </p>
      </section>
    </div>
  );
}
