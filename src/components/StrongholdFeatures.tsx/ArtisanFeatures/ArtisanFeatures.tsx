"use client";
import { use, useEffect, useMemo, useState } from "react";
import ArtisanCard from "./ArtisanCard/ArtisanCard";
import styles from "./styles.module.scss";
import { ArtisanShop, ArtisanShops, StrongholdArtisans } from "types";

interface ArtisanFeaturesType {
  strongholdId: string;
  setContextualPanelType: React.Dispatch<
    React.SetStateAction<{ type: string; subtype: string }>
  >;
  needToUpdate: {
    artisans: boolean;
  };
  setNeedToUpdate: React.Dispatch<React.SetStateAction<{ artisans: boolean }>>;
}

type ArtisanShopWithLevel = ArtisanShop & {
  level: number;
};

export default function ArtisanFeatures({
  strongholdId,
  setContextualPanelType,
  needToUpdate,
  setNeedToUpdate,
}: ArtisanFeaturesType) {
  const [artisanShopsList, setArtisanShopsList] = useState<ArtisanShops | null>(
    null
  );
  const [strongholdArtisansList, setStrongholdArtisansList] =
    useState<StrongholdArtisans>([]);
  const [loading, setLoading] = useState<boolean>(false);

  async function fetchArtisanShops(): Promise<void> {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/strongholds/artisans/shops`
      );

      if (!res.ok) {
        throw new Error("There was a problem fetching Artisan Shops.");
      }

      const data = await res.json();
      setArtisanShopsList(data.artisanShops);
      console.log(data.artisanShops);
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function fetchStrongholdArtisans(): Promise<void> {
    setLoading(true);
    if (strongholdId) {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/strongholds/artisans/${strongholdId}`
        );

        if (!res.ok) {
          throw new Error(
            "There was a problem fetching this Stronghold's list of Artisans."
          );
        }

        const data = await res.json();
        setStrongholdArtisansList(data.artisans ?? []);
        console.log(data.artisans);
      } catch (err) {
        console.log(err.message);
      } finally {
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    if (!artisanShopsList) {
      fetchArtisanShops();
    }
  }, []);

  useEffect(() => {
    fetchStrongholdArtisans();
  }, [])

  useEffect(() => {
    if (needToUpdate.artisans) {
      fetchStrongholdArtisans();
  
      setNeedToUpdate((prev) => ({
        ...prev,
        artisans: false,
      }));
    }
  },[needToUpdate.artisans])

  // function findArtisanShopLevel(artisan){
  //     const strongholdArtisan = strongholdArtisansList?.find(strongholdArtisan => strongholdArtisan.name === artisan);
  //     return (strongholdArtisan ? strongholdArtisan.shop.level : 0)
  // }

  // const localListOfArtisans = artisanShopsList?.map( artisan => ({
  //     ...artisan,
  //     level: findArtisanShopLevel(artisan.artisan_name)
  // }))

  // const localListOfArtisans: ArtisanShopWithLevel[] = useMemo(() => {
  //     if(!artisanShopsList) return [];

  //     return artisanShopsList.map((artisan) => ({
  //         ...artisan,
  //         level: findArtisanShopLevel(artisan.artisan_name)
  //     }))
  // }, [artisanShopsList, strongholdArtisansList])

  const artisanLevelMap = useMemo(() => {
    const map = new Map<string, number>();
    strongholdArtisansList.forEach((a) => {
      map.set(a.name, a.shop.level);
    });
    return map;
  }, [strongholdArtisansList]);

  return (
    <div>
      <div className={styles.cardContainer}>
        {
          artisanShopsList?.map((artisan) => (
            <ArtisanCard
              key={artisan.artisanName}
              artisan={artisan}
              level={artisanLevelMap.get(artisan.artisanName) ?? 0}
              setContextualPanelType={setContextualPanelType}
            />
          ))
        }
        {loading && <div>loading...</div>}
      </div>
    </div>
  );
}
