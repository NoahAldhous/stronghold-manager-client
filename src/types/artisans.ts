export type ArtisanShop = {
    id: number,
    artisan_name: string,
    shop_name: string,
    shop_description: string,
    upgradeable: boolean
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