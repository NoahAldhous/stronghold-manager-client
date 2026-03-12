"use client";

import { useEffect, useState } from "react";
import { ArtisanShop, Currency, Stronghold, StrongholdArtisans } from "types";

interface ArtisanContextualPanelProps {
  contextualPanelType: { type: string; subtype: string };
  strongholdId: number;
  needToUpdate: {
    artisans: boolean;
  };
  setNeedToUpdate: React.Dispatch<React.SetStateAction<{ artisans: boolean }>>;
  treasury: Stronghold["treasury"] | null;
  stronghold: Stronghold;
  setStronghold: React.Dispatch<React.SetStateAction<Stronghold | null>>;
}

export default function ArtisanContextualPanel({
  contextualPanelType,
  strongholdId,
  needToUpdate,
  setNeedToUpdate,
  treasury,
  stronghold,
  setStronghold,
}: ArtisanContextualPanelProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [costDisabled, setCostsDisabled] = useState<boolean>(false);
  const [artisanShop, setArtisanShop] = useState<ArtisanShop | null>(null);
  const [upgradeCosts, setUpgradeCosts] = useState<
    { cost: number; artisan_level: number }[] | null
  >(null);
  const [strongholdArtisansList, setStrongholdArtisansList] =
    useState<StrongholdArtisans | null>();

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
        setStrongholdArtisansList(data.artisans);
        console.log(data.artisans);
      } catch (err) {
        console.log(err.message);
      } finally {
        setLoading(false);
      }
    }
  }

  async function fetchArtisanUpgradeCosts() {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/strongholds/artisans/upgrade_costs`
      );

      if (!res.ok) {
        throw new Error(
          "There was a problem fetching this Stronghold's list of upgrade costs."
        );
      }
      const data = await res.json();
      console.log(data);
      setUpgradeCosts(data.upgrades);
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
        ...needToUpdate,
        artisans: true,
      });
    }
  }

  async function upgradeArtisanShop(artisan, cost) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/strongholds/artisans/update`,
        {
          method: "PATCH",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            strongholdId: strongholdId,
            artisan: artisan,
            level: shopLevel + 1,
          }),
        }
      );
      if (!res.ok) {
        throw new Error("There was a problem upgrading Artisan.");
      }

      const data = await res.json();
      console.log(data);
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
      if (!costDisabled) {
        updateTreasury("gp", cost, "decrease");
      }
      setNeedToUpdate({
        ...needToUpdate,
        artisans: true,
      });
    }
  }

  async function updateTreasury(
    currency: Currency,
    valueChange: number,
    method: "increase" | "decrease"
  ): Promise<void> {
    if (!treasury) return;

    // setUpdatingTreasury(true);
    // setAnimatedCurrency("");

    const newValue: number =
      method === "increase"
        ? treasury[currency] + valueChange
        : treasury[currency] - valueChange;

    const newTreasury =
      newValue < 0
        ? { ...treasury, [currency]: 0 }
        : { ...treasury, [currency]: newValue };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/strongholds/treasury/update/${strongholdId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newTreasury),
        }
      );

      if (!res.ok) {
        throw new Error(
          "The application encountered and error trying to update this value."
        );
      }
      const data = await res.json();
      console.log(data.message);
    } catch (err) {
      console.log(err.message);
    } finally {
      // setUpdatingTreasury(false);
      // setAnimatedCurrency(currency);
      setStronghold({ ...stronghold, treasury: newTreasury });
    }
  }

  useEffect(() => {
    fetchArtisanShop(contextualPanelType.subtype);
    if (!upgradeCosts) {
      fetchArtisanUpgradeCosts();
    }
  }, [contextualPanelType.subtype]);

  useEffect(() => {
    if (!strongholdArtisansList || needToUpdate.artisans) {
      fetchStrongholdArtisans();

      setNeedToUpdate((prev) => {
        if (!prev.artisans) return prev;
        return { ...prev, artisans: false };
      });
    }
  }, [needToUpdate]);

  function findArtisanShopLevel(artisan) {
    const strongholdArtisan = strongholdArtisansList?.find(
      (strongholdArtisan) => strongholdArtisan.name === artisan
    );
    return strongholdArtisan ? strongholdArtisan.shop.level : 0;
  }

  function findUpgradeCost(level: number) {
    const upgradeLevel = upgradeCosts?.find(
      (upgrade) => upgrade.artisan_level === level + 1
    );
    console.log("LEVEL " + upgradeLevel);
    return upgradeLevel?.cost ?? 0;
  }

  function handleCheck(e: {target: {checked: boolean}}) {
    setCostsDisabled(e.target.checked);
  }

  const shopLevel = findArtisanShopLevel(artisanShop?.artisanName);

  const upgradeCost = findUpgradeCost(shopLevel);

  const goldNeededToUpgrade = (upgradeCost - (treasury?.gp ?? 0))

  return (
    <div>
      <p>{artisanShop?.shopDescription}</p>
      <p>
        Level: <span>{shopLevel}</span>
      </p>
      <button
        disabled={shopLevel > 0}
        onClick={() => addArtisanShop(contextualPanelType.subtype)}
      >
        acquire
      </button>
      <button
        disabled={shopLevel < 1 || shopLevel > 4 || (goldNeededToUpgrade > 0 && !costDisabled)}
        onClick={() =>
          upgradeArtisanShop(contextualPanelType.subtype, upgradeCost)
        }
      >
        upgrade
      </button>
      <p>
        cost: <span>{costDisabled ? 0 : upgradeCost}</span>{" "}
        <span>{goldNeededToUpgrade < 1 ? "" : `(${goldNeededToUpgrade}gp needed)`}</span>
        <input
          checked={costDisabled}
          type="checkbox"
          id="disableCost"
          onChange={handleCheck}
        />
        <span>disable costs</span>
      </p>
    </div>
  );
}
