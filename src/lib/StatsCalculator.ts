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

    // compute and return Stats object
    public getStats(includeBreakdown = false): Stats{
        const attack = this.sumBonus("attackBonus");
        const power = this.sumBonus("powerBonus");
        const morale = this.sumBonus("moraleBonus");
        const defense = BASE_DEFENSE + this.sumBonus("defenseBonus");
        const toughness = BASE_TOUGHNESS + this.sumBonus("toughnessBonus");

        const stats: Stats = { attack, power, defense, toughness, morale };

        if(includeBreakdown) {
            stats.breakdown = {
                sources: this.sources.map((s) => ({
                    source: s.name,
                    attack: s.attackBonus ?? 0,
                    power: s.powerBonus ?? 0,
                    defense: s.defenseBonus ?? 0,
                    toughness: s.moraleBonus ?? 0,
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