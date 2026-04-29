export interface Stronghold {
    id: number;
    owner_name: string;
    stronghold_level: number;
    stronghold_name: string;
    stronghold_size: number;
    stronghold_type: string;
    upgrade_cost: number;
    treasury: {
      pp: number;
      gp: number;
      sp: number;
      ep: number;
      cp: number;
    };
    features: {
      title: string;
      description: string;
    }[];
    stats: {
      morale_bonus: number;
      toughness: number;
      size: number;
      casualties: number;
    };
    class: {
      name: string;
      stronghold_name: string;
      description: string;
      class_feature_improvement: {
        description: string;
        name: string;
        restriction: string;
        uses: number;
      };
      demesne_effects: {
        description: string;
      }[];
      stronghold_actions: {
        name: string;
        description: string;
      }[];
    };
  }
export interface userStronghold {
    id: number;
    name: string;
    ownerName: string;
    level: number;
    type: string;
    ownerClass: string;
    classStrongholdName: string;
  }

export type userStrongholds = userStronghold[] | null
