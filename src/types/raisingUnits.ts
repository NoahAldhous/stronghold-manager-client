export interface RaisingUnitRow {
    highNumber: number;
    lowNumber: number;
    keepType: string;
    id: number;
    unit: {
        equipment: string;
        experience: string;
        type: string;
    }
}

export interface RaisingUnitsStatus {
    current_units: number;
    has_raised_all_units: boolean;
    id: number;
    max_units: number;
    stronghold_id: number;
  }