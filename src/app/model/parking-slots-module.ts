export interface ParkingSlot {
 _id?: string;
 slotName: string;
 vehicleType: string;
 status: 'available' | 'occupied';
}

export interface ApiResponse {
    status: string;
    results?: number; // Optional based on your GET response
    data: ParkingSlot[]; // <-- This is the key property
}