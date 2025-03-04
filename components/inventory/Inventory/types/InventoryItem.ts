export interface InventoryItem {
    id: string;
    item_number: string;
    description: string;
    lpn_number?: string;
    lot_number?: string;
    status: string; // Ensure this is consistently `string`
    location: string;
}