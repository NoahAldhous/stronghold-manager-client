import type { Unit, Stats, NamedBonusSource, BonusKeys } from "types";

const BASE_TOUGHNESS = 10;
const BASE_DEFENSE = 10;

export class StatsCalculator {
    private unit: Unit;
    private sources: NamedBonusSource[];

    constructor(unit: Unit) {
        //do not mutate
        this.unit = unit;
        this.sources = this.collectSources(unit);
    }

    // gather sources into an array for iteration
    private collectSources(unit: Unit): NamedBonusSource[] {
        const arr: NamedBonusSource[] = [];

        if (unit.type) arr.push({...unit.type, name: unit.type.name ?? "type"});
        if (unit.ancestry) arr.push({...unit.ancestry, name: unit.ancestry.name ?? "ancestry"});
        if (unit.experience) arr.push({...unit.experience,  name: unit.experience.name ?? "experience"});
        if (unit.equipment) arr.push({...unit.equipment, name: unit.equipment.name ?? "equipment"});
        
        return arr;
    }

    // helper that sums a bonus across all sources
    private sumBonus(key: BonusKeys): number {
        return this.sources.reduce((acc, s) => acc + (s[key] ?? 0), 0) 
    }

    private getTraitsCost(): number {
        let cost = 0;

        this.unit.traits.forEach((trait: {traitName: string, traitDescription: string, cost: number}) => {
            cost = (cost + trait.cost)
        })

        cost = (cost + 30)

        return cost;
    }

    // compute and get Unit cost object
    private getCost(unit: Unit){
        console.log(unit.name)
        const attack = this.sumBonus("attackBonus");
        const power = this.sumBonus("powerBonus");
        const morale = this.sumBonus("moraleBonus");
        const defense = this.sumBonus("defenseBonus");
        const toughness = this.sumBonus("toughnessBonus");

        const sumOfBonuses = (attack + power + defense + toughness + (morale * 2));
        const multipliedSum = ((sumOfBonuses * unit.type.costModifier) * unit.size.costModifier ) * 10;
        const unitCost = multipliedSum + this.getTraitsCost()
        const unitUpkeep = (unitCost / 10) * (unit.isMercenary ? 2 : 1)

        const cost = {
            cost: Math.round(unitCost),
            upkeep: Math.round(unitUpkeep)
        }

        return cost;
    }

    // compute and return Stats object
    public getStats(includeBreakdown = false): Stats{
        const attack = this.sumBonus("attackBonus");
        const power = this.sumBonus("powerBonus");
        const morale = this.sumBonus("moraleBonus");
        const defense = BASE_DEFENSE + this.sumBonus("defenseBonus");
        const toughness = BASE_TOUGHNESS + this.sumBonus("toughnessBonus");
        const costs = this.getCost(this.unit) 

        const stats: Stats = { attack, power, defense, toughness, morale, costs };

        if(includeBreakdown) {
            stats.breakdown = {
                sources: this.sources.map((s) => ({
                    source: s.name,
                    attack: s.attackBonus ?? 0,
                    power: s.powerBonus ?? 0,
                    defense: s.defenseBonus ?? 0,
                    toughness: s.toughnessBonus ?? 0,
                    morale: s.moraleBonus ?? 0
                })),
            };
        }

        return stats;
    }

    // static factory
    public static fromUnit(unit: Unit) {
        return new StatsCalculator(unit);
    }
}