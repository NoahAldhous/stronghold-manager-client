"use client";

import { useEffect, useState } from "react";
import { ArtisanShop } from "types";

interface ArtisanContextualPanelProps {
  contextualPanelType: { type: string; subtype: string };
  strongholdId: number;
  needToUpdate: {
    artisans: boolean
  }
  setNeedToUpdate: React.Dispatch<
    React.SetStateAction<{artisans: boolean}>
  >;
}

export default function ArtisanContextualPanel({
  contextualPanelType,
  strongholdId,
  needToUpdate,
  setNeedToUpdate
}: ArtisanContextualPanelProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [artisanShop, setArtisanShop] = useState<ArtisanShop | null>(null);

  async function fetchArtisanShop(artisan): Promise<void> {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/strongholds/artisans/shops/${artisan}`
      );

      if (!res.ok) {
        throw new Error("There was a problem fetching Artisan Shops.");
      }

      const data = await res.json();
      setArtisanShop(data.artisan);
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function addArtisanShop(artisan) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/strongholds/artisans/add`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            strongholdId: strongholdId,
            artisan: artisan,
            level: 1,
          }),
        }
      );
      if (!res.ok) {
        throw new Error("There was a problem adding new Artisan.");
      }

      const data = await res.json();
      console.log(data);
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
      setNeedToUpdate({
        ...needToUpdate, artisans: true
      })
    }
  }

  useEffect(() => {
    fetchArtisanShop(contextualPanelType.subtype);
  }, [contextualPanelType.subtype]);

  return (
    <div>
      <p>{artisanShop?.shop_description}</p>
      <button
    //   disabled
      onClick={() => addArtisanShop(contextualPanelType.subtype)}
      >acquire</button>
    </div>
  );
}
