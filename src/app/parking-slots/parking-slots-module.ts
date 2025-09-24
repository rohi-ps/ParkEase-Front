export interface ParkingSlot {
 id: string;
 vehicleType: string;
 availability : 'available' | 'occupied';
 status: 'available' | 'occupied';
}