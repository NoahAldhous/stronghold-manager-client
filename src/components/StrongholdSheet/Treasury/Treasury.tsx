"use client";

import styles from "./styles.module.scss";
import LoadingCard from "components/LoadingUI/LoadingCard/LoadingCard";
import type { Stronghold, Currency } from "types";
import { useState, useEffect, JSX } from "react";
import CurrencyElement from "./Currency/CurrencyElement";

interface TreasuryProps {
    loading: boolean;
    treasury: Stronghold["treasury"] | null;
    level: Stronghold["stronghold_level"] | null;
    type: Stronghold["stronghold_type"] | null;
    id: Stronghold["id"] | null;
    stronghold: Stronghold | null;
    setStronghold: React.Dispatch<
        React.SetStateAction<Stronghold | null>
    >;
}

export default function Treasury({ loading, treasury, level, type, id, stronghold, setStronghold } : TreasuryProps): JSX.Element {

    //State
    const [revenue, setRevenue] = useState<number>(0)
    const [updatingTreasury, setUpdatingTreasury] = useState<boolean>(false);
    const [animatedCurrency, setAnimatedCurrency] = useState<Currency>("");
    const [activeCurrency, setActiveCurrency] =useState<Currency>("");
    //array of currencies
    const currencyList = ["pp", "gp", "sp", "ep", "cp"];

    //useEffects
    useEffect(() => {
        if (type){
            if (type == "establishment"){
                calculateStrongholdRevenue();
            }
        }
    }, [level]);

    //Functions
    function calculateStrongholdRevenue(){
        if(level){
            setRevenue(1000 * level)
        }
    }

    async function updateTreasury(
        currency: Currency,
        valueChange: number,
        method: "increase" | "decrease"
    ): Promise<void> {
        
        if (!stronghold || !treasury) return;

        setUpdatingTreasury(true);
        setAnimatedCurrency("");

        const newValue : number = method === "increase"
        ? treasury[currency] + valueChange
        : treasury[currency] - valueChange

        const newTreasury = newValue < 0
            ? {...treasury, [currency]: 0}
            : {...treasury, [currency]: newValue}

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/strongholds/treasury/update/${id}`,
                {
                  method: "PATCH",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(newTreasury),
                }
            );

            if (!res.ok) {
                throw new Error(
                    "The application encountered and error trying to update this value."
                )
            }
            const data = await res.json();
            console.log(data.message);
        } catch (err) {
            console.log(err.message);
        } finally {
            setUpdatingTreasury(false);
            setAnimatedCurrency(currency);
            setStronghold({...stronghold, treasury: newTreasury})
        }

    }

    return <section>
        {loading || !treasury ? (
            <section className={styles.treasuryContainer}>
                <LoadingCard/>
            </section>
        ) : (
            <section className={styles.treasuryContainer}>
                <section className={styles.cardHeader}>treasury</section>
                <section className={styles.revenueContainer}>
                    <div>
                        <div className={styles.sectionHeader}>revenue</div>
                        <p>{revenue}gp<span className={styles.season}> /Season</span></p>
                    </div>
                    <button
                        disabled={updatingTreasury}
                        onClick={() => {
                            updateTreasury(
                                "gp",
                                revenue,
                                "increase"
                            )
                        }}
                        className={styles.button}
                    >
                        receive revenue
                    </button>
                </section>
                <section className={styles.currencyContainer}>
                    <div className={styles.sectionHeader}>currency</div>
                    {currencyList.map((item: Currency, index) => 
                        <CurrencyElement
                            index={index}
                            currency={item}
                            activeCurrency={activeCurrency}
                            animatedCurrency={animatedCurrency}
                            setActiveCurrency={setActiveCurrency}
                            treasury={treasury}
                            updateTreasury={updateTreasury}
                            updatingTreasury={updatingTreasury}
                        />
                    )}
                </section>
            </section>
        )
    }
    </section>
}