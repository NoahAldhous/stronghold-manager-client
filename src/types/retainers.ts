export type StrongholdRetainer = {
    ancestry: {
        darkvision: number,
        name: string,
        size: string,
        speed: number
    },
    armourClass: {
        type: string,
        value: number
    },
    class: string,
    healthLevelsLost: number,
    id: number,
    level: number,
    name: string,
    primaryAbility: {
        name: string,
        abbreviation: string
    }[],
    savingThrows: {
        name: string,
        abbreviation: string
    }[],
    signatureAttack: {
        damage: {
            average: number,
            diceSize: number,
            modifier: number,
            numberOfDice: number,
            type: string
        },
        hitOrDC: number,
        name: string,
        range: {
            long: number,
            reach: number,
            short: number,
            type: string
        },
        type: string
    },
    title: string
}

export type StrongholdRetainers = StrongholdRetainer[]