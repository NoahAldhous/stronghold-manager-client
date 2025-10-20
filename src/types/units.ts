interface BonusStats {
    name: string;
    attackBonus: number;
    powerBonus: number;
    defenseBonus: number;
    toughnessBonus: number;
    moraleBonus: number;
    costModifier: number;
}

type AncestryStats = Required<Omit<BonusStats, "morale_bonus" | "costModifier">>;

type EquipmentStats = Required<Pick<BonusStats, "defenseBonus" | "powerBonus" | "name">>;

type ExperienceStats = Required<Omit<BonusStats, "defenseBonus" | "powerBonus" | "costModifier">>;

type TypeStats = Required<BonusStats>;

export interface Unit {
    ancestry: AncestryStats;
    equipment: EquipmentStats;
    experience: ExperienceStats;
    type: TypeStats;
    casualties: number;
    creationDate: string;
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
    unit_id: number;
    user_id: number;
}

export type Units = Unit[];