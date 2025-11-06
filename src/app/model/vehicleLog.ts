export interface vehicleLog {
  _id: string;
  vehicleNumber: string;
  vehicleType: '4W' | '2W';
  entryTime: Date;
  exitTime: Date | null;
  status: 'Parked' | 'Completed';
  slotId: {
    _id: string;
    slotName: string;
  };
  userId: string | null; 
}
//changes