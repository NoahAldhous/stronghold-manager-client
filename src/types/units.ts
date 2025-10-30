export type BonusKeys = "attackBonus" | "powerBonus" | "defenseBonus" | "toughnessBonus" | "moraleBonus";

export type BonusValues = Partial<Record<BonusKeys, number>>;

export interface NamedBonusSource extends BonusValues {
    name: string;
}
interface BonusStats {
    name: string;
    attackBonus: number;
    powerBonus: number;
    defenseBonus: number;
    toughnessBonus: number;
    moraleBonus: number;
    costModifier: number;
}

type AncestryStats = Required<Omit<BonusStats, "costModifier">>;

type EquipmentStats = Required<Pick<BonusStats, "defenseBonus" | "powerBonus" | "name">>;

type ExperienceStats = Required<Omit<BonusStats, "defenseBonus" | "powerBonus" | "costModifier">>;

type TypeStats = Required<BonusStats>;

export interface Unit {
    ancestry: AncestryStats;
    equipment: EquipmentStats;
    experience: ExperienceStats;
    type: TypeStats;
    casualties: number;
    creationDate?: string;
    isMercenary: boolean;
    name: string;
    size: {
        costModifier: number;
        sizeLevel: number;
        unitSize: number;
    };
    stronghold_id: number | null;
    traits: {
        cost: number;
        traitName: string;
        traitDescription: string;
    }[] | [];
    id: number;
    user_id: number;
}

export type Units = Unit[];

export interface Stats {
    attack: number;
    power: number;
    defense: number;
    toughness: number;
    morale: number;
    costs: {
        cost: number;
        upkeep: number;
    }
    breakdown?:{
        sources: Array<{ source: string; attack?: number; power?: number; defense?: number; toughness?: number; morale?: number }>;
    };
}

interface Trait {
    cost: number;
    traitName: string;
    traitDescription: string;
}

export interface Ancestry extends AncestryStats {
    traits: {
        cost: number;
        traitName: string;
        traitDescription: string;
    }[] | [];
}

export interface ExperienceLevel extends Omit<ExperienceStats, "name"> {
    id: number;
    levelName: string;
};

export interface EquipmentLevel extends Omit<EquipmentStats, "name">{
    id: number;
    levelName: string;
};

export interface SizeLevel {
    costModifier: number;
    id: number;
    levelName:string;
    size: number;
};

export interface UnitType extends TypeStats {
    id: number;
    traits: Trait[] | [];
}