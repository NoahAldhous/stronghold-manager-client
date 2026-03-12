export type ArtisanShop = {
    id: number,
    artisanName: string,
    shopName: string,
    shopDescription: string,
    upgradeable: boolean,
    bonuses?:{
        bonusName: string,
        numericalBonus: number,
        bonusMultiplier: string,
        bonusDescription: string,
        requiresExtendedRest: boolean
    }
}

export type ArtisanShops = ArtisanShop[];

export type StrongholdArtisan = {
    artisanId: number,
    name: string,
    strongholdId: number,
    shop: {
        description: string,
        level: number,
        name: string,
        upgradeable: boolean
    }
}

export type StrongholdArtisans = StrongholdArtisan[]