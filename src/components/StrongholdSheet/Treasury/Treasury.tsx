"use client";

import styles from "./styles.module.scss";
import LoadingCard from "components/LoadingUI/LoadingCard/LoadingCard";
import type { Stronghold, Currency, Units } from "types";
import { useState, useEffect, JSX } from "react";
import CurrencyElement from "./Currency/CurrencyElement";
import { StatsCalculator } from "lib/StatsCalculator";

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
    userId: string | null;
}

export default function Treasury({ loading, treasury, level, type, id, stronghold, setStronghold, userId } : TreasuryProps): JSX.Element {

    //State
    const [revenue, setRevenue] = useState<number>(0)
    const [armyUpkeep, setArmyUpkeep] = useState<number>(0);
    const [net, setNet] = useState<number>(0);
    const [updatingTreasury, setUpdatingTreasury] = useState<boolean>(false);
    const [animatedCurrency, setAnimatedCurrency] = useState<Currency>("");
    const [activeCurrency, setActiveCurrency] =useState<Currency>("");
    const [unitsList, setUnitsList] = useState<Units | null>(null);
    // const [calc, setCalc] = useState(StatsCalculator.fromUnit(unit, stronghold));

    //array of currencies
    const currencyList = ["pp", "gp", "sp", "ep", "cp"];

    //useEffects
    useEffect(() => {
        calculateStrongholdRevenue();
        calculateStrongholdNet();
    }, [level, armyUpkeep]);

    useEffect(() => {
        if(unitsList){
            let totalUpkeep = 0
            unitsList?.map(unit => {
                const newCalc = StatsCalculator.fromUnit(unit, stronghold);
                const unitCost = newCalc.getCost(unit);
                totalUpkeep += unitCost.upkeep;
                console.log("upkeep", totalUpkeep)
            })
            setArmyUpkeep(totalUpkeep);
        }
      }, [unitsList, stronghold, loading]);

    useEffect(() => {
        if( userId && stronghold){
            fetchUnits();
        }
    },[userId, id, loading])

    //Functions
    function calculateStrongholdRevenue(){
        let newRevenue = 0;
        if(level && type){
            if(type === "establishment"){
                newRevenue = (1000 * level);
            }
            setRevenue(newRevenue);
        }
        return newRevenue;
    }

    function calculateStrongholdNet(){
        let newNet = 0;
            newNet = (calculateStrongholdRevenue() - armyUpkeep);
            setNet(newNet);
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

    //fetch units to calculate unit upkeep
    async function fetchUnits(): Promise<void>{
        if(!unitsList) {

            if(userId){
                try {
                    const res = await fetch(
                        `${process.env.NEXT_PUBLIC_API_URL}/units/?user_id=${userId}&stronghold_id=${id}`
                    );
    
                    if(!res.ok) {
                        throw new Error("There was a problem fetching this Stronghold's units. Pleas try again")
                    }
    
                    const data = await res.json();
                    setUnitsList(data.units);
                } catch (err) {
                    console.log(err.message);
                } finally {
                    // setLoading(false);
                }
            }
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
                
                <section className={styles.currencyContainer}>
                    {currencyList.map((item: Currency, index) => 
                        <CurrencyElement
                            key={index}
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
                <section className={styles.revenueContainer}>
                    <div className={styles.info}>
                        <div className={styles.item}>
                            <div className={styles.sectionHeader}>revenue</div>
                            <p>{revenue}gp<span className={styles.season}>/Season</span></p>
                        </div>
                        <div className={styles.item}>
                            <div className={styles.sectionHeader}>army upkeep</div>
                            <p>{armyUpkeep}gp<span className={styles.season}>/Season</span></p>
                        </div>
                        <div className={styles.item}>            
                            <div className={styles.sectionHeader}>net</div>
                            <p>{net}gp<span className={styles.season}>/Season</span></p>
                        </div>
                    </div>
                    <section className={styles.buttonContainer}>
                        <button
                            disabled={updatingTreasury}
                            onClick={() => {
                                updateTreasury(
                                    "gp",
                                    net,
                                    "increase"
                                )
                            }}
                            className={styles.button}
                        >
                            receive revenue
                        </button>
                    </section>
                </section>
            </section>
        )
    }
    </section>
}