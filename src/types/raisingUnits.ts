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