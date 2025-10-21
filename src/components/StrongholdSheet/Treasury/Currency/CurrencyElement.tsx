import { useState } from "react";
import styles from "./styles.module.scss";
import { Stronghold, Currency } from "types";

interface CurrencyProps {
  currency: Currency;
  activeCurrency: Currency;
  animatedCurrency: Currency;
  setActiveCurrency: React.Dispatch<React.SetStateAction<Currency>>;
  treasury: Stronghold["treasury"];
  updatingTreasury: boolean;
  updateTreasury: (
    currency: Currency,
    value: number,
    method: "increase" | "decrease"
  ) => Promise<void>;
}

export default function CurrencyElement({
  currency,
  activeCurrency,
  animatedCurrency,
  setActiveCurrency,
  treasury,
  updateTreasury,
  updatingTreasury,
}: CurrencyProps) {
  const [inputValue, setInputValue] = useState<number | "">("");

  async function adjustCurrency(
    method: "increase" | "decrease",
    currency: Currency
  ) {
    if (inputValue === "" || !treasury) return;

    const numericValue = Number(inputValue);

    await updateTreasury(currency, numericValue, method);
    setInputValue("");
  }

  return (
    <div
      tabIndex={0}
      onFocus={() => setActiveCurrency(currency)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setActiveCurrency("");
        }
      }}
      onKeyDown={(e) => {
        //Press enter or space toggles the active state
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault(); // prevents spacebar from scrolling
          setActiveCurrency((prev) => (prev === currency ? "" : currency));
        }
        //Pressing escape unfocuses the element
        if (e.key === "Escape") {
          setActiveCurrency("");
          (e.currentTarget as HTMLElement).blur();
        }
      }}
      className={`${styles.container} ${
        activeCurrency == currency ? styles.active : ""
      }`}
    >
      <section className={`${styles.divider} ${styles.textDivider}`}>
        <span
          className={`${styles.currencyAmount} ${
            animatedCurrency == currency ? styles.animated : ""
          }`}
        >
          {treasury[currency]}
        </span>
        <p className={styles.text}>{currency}</p>
      </section>
      <section
        className={`${styles.divider} ${styles.inputDivider} ${
          activeCurrency == currency ? styles.visible : ""
        }`}
      >
        <button
          disabled={updatingTreasury}
          onMouseDown={() => adjustCurrency("decrease", currency)}
          className={styles.button}
        >
          remove
        </button>
        <input
          disabled={updatingTreasury}
          value={inputValue}
          type="number"
          onChange={(e) =>
            setInputValue(e.target.value ? Number(e.target.value) : "")
          }
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              e.currentTarget.blur();
              setActiveCurrency("");
            }
          }}
          className={styles.input}
        ></input>
        <button
          disabled={updatingTreasury}
          onMouseDown={() => adjustCurrency("increase", currency)}
          className={styles.button}
        >
          add
        </button>
      </section>
    </div>
  );
}
