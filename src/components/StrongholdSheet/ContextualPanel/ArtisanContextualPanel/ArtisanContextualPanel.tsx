"use client";

import { useEffect, useState } from "react";
import { ArtisanShop } from "types";

export default function ArtisanContextualPanel({contextualPanelType}){
    const [loading, setLoading] = useState<boolean>(false);
    const [artisanShop, setArtisanShop] = useState<ArtisanShop | null>(null);


  async function fetchArtisanShop(artisan): Promise<void> {
    setLoading(true)
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/strongholds/artisans/shops/${artisan}`
        );

        if (!res.ok) {
            throw new Error(
                "There was a problem fetching Artisan Shops."
            );
        }

        const data = await res.json();
        setArtisanShop(data.artisan)
    } catch (err) {
        console.log(err.message)
    } finally {
        setLoading(false);
    }
  } 

  useEffect(() => {
        fetchArtisanShop(contextualPanelType.subtype);
  }, [contextualPanelType.subtype])

  return <div>
    <p>{artisanShop?.shop_description}</p>
    <button>acquire</button> 
  </div>

}