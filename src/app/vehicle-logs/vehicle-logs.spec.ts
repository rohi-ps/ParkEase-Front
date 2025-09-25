import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { VehicleLogs } from './vehicle-logs';
import { Parkingservice } from '../Services/parkingservice';
import { ParkingSlotsUserService } from '../Services/parking-slots-user.service';
import { ParkingSlot } from '../model/parking-slots-module';
import { ParkingRecord } from '../model/billing';

// Helper function to get today's date at midnight for consistent testing
const getTodayAtMidnight = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

// --- MOCK DATA ---
const MOCK_PARKING_RECORDS: ParkingRecord[] = [
  { id: 1, vehicleNumber: 'TS-01', customerName: 'John', status: 'Parked', entryTime: new Date(), exitTime: null, slotId: 'A1', vehicleType: '4W' },
  { id: 2, vehicleNumber: 'TS-02', customerName: 'Jane', status: 'Completed', entryTime: new Date(), exitTime: new Date(), slotId: 'A2', vehicleType: '4W' },
  { id: 3, vehicleNumber: 'TS-03', customerName: 'Doe', status: 'Parked', entryTime: new Date(), exitTime: null, slotId: 'B1', vehicleType: '2W' },
];

const MOCK_AVAILABLE_SLOTS: ParkingSlot[] = [
  { id: 'C1', vehicleType: '4W', availability: 'available', status: 'available' },
  { id: 'C2', vehicleType: '2W', availability: 'available', status: 'available' },
];


describe('VehicleLogs', () => {
  let component: VehicleLogs;
  let fixture: ComponentFixture<VehicleLogs>;
  // Create spy objects for the services
  let mockParkingService: jasmine.SpyObj<Parkingservice>;
  let mockParkingSlotsService: jasmine.SpyObj<ParkingSlotsUserService>;

  beforeEach(async () => {
    // Define the mock services with their methods
    mockParkingService = jasmine.createSpyObj('Parkingservice', ['getParkingRecords', 'logEntry', 'logExit']);
    mockParkingSlotsService = jasmine.createSpyObj('ParkingSlotsUserService', ['getAvailableSlots']);

    // Configure the testing module
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        CommonModule,
        VehicleLogs // Import the standalone component
      ],
      providers: [
        // Provide the mock services instead of the real ones
        { provide: Parkingservice, useValue: mockParkingService },
        { provide: ParkingSlotsUserService, useValue: mockParkingSlotsService }
      ]
    }).compileComponents();

    // Set up the mock return values before creating the component
    mockParkingService.getParkingRecords.and.returnValue(MOCK_PARKING_RECORDS);
    mockParkingSlotsService.getAvailableSlots.and.returnValue(MOCK_AVAILABLE_SLOTS);
    
    // Create the component instance
    fixture = TestBed.createComponent(VehicleLogs);
    component = fixture.componentInstance;
    
    // Trigger initial data binding and ngOnInit
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization and Data Loading', () => {
    it('should call loadData on ngOnInit', () => {
      expect(component.parkingRecords.length).toBe(3);
      expect(component.availableSlots.length).toBe(2);
    });

    it('should populate parkingRecords and availableSlots from services', () => {
      expect(component.parkingRecords).toEqual(MOCK_PARKING_RECORDS);
      expect(component.availableSlots).toEqual(MOCK_AVAILABLE_SLOTS);
      expect(mockParkingService.getParkingRecords).toHaveBeenCalled();
      expect(mockParkingSlotsService.getAvailableSlots).toHaveBeenCalled();
    });
  });

  describe('Getters', () => {
    it('should calculate parkingCount correctly', () => {
      expect(component.parkingCount).toBe(2);
    });

    it('should calculate exitCount correctly for today', () => {
      const today = getTodayAtMidnight();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);

      component.parkingRecords = [
        { id: 1, status: 'Completed', exitTime: today, vehicleNumber: 'A', customerName: 'A', slotId: 'A', entryTime: new Date(), vehicleType: '4W' },
        { id: 2, status: 'Completed', exitTime: today, vehicleNumber: 'B', customerName: 'B', slotId: 'B', entryTime: new Date(), vehicleType: '4W' },
        { id: 3, status: 'Completed', exitTime: yesterday, vehicleNumber: 'C', customerName: 'C', slotId: 'C', entryTime: new Date(), vehicleType: '4W' },
        { id: 4, status: 'Parked', exitTime: null, vehicleNumber: 'D', customerName: 'D', slotId: 'D', entryTime: new Date(), vehicleType: '4W' },
      ];
      expect(component.exitCount).toBe(2);
    });
  });

  describe('Form Actions', () => {
    it('should call parkingService.logEntry and reload data on logEntry', () => {
      const mockForm = { value: { vehicleNumber: 'NEW-01' }, reset: () => {} } as NgForm;
      // THE FIX: Cast component to 'any' to spy on the private method
      spyOn(component as any, 'loadData'); 
      spyOn(mockForm, 'reset');

      component.logEntry(mockForm);

      expect(mockParkingService.logEntry).toHaveBeenCalledWith(mockForm.value);
      expect(mockForm.reset).toHaveBeenCalled();
      expect((component as any).loadData).toHaveBeenCalled();
    });

    it('should call parkingService.logExit and reload data on logExit', () => {
      const mockForm = { value: { selectedVehicleNumber: 'TS-01' }, resetForm: () => {} } as NgForm;
      // THE FIX: Cast component to 'any' to spy on the private method
      spyOn(component as any, 'loadData');
      spyOn(mockForm, 'resetForm');

      component.logExit(mockForm);

      expect(mockParkingService.logExit).toHaveBeenCalledWith('TS-01');
      expect(mockForm.resetForm).toHaveBeenCalled();
      expect((component as any).loadData).toHaveBeenCalled();
    });

    it('should call parkingService.logExit and reload data from markAsExitedFromTable', () => {
      // THE FIX: Cast component to 'any' to spy on the private method
      spyOn(component as any, 'loadData');
      const vehicleNumber = 'TS-03';

      component.markAsExitedFromTable(vehicleNumber);

      expect(mockParkingService.logExit).toHaveBeenCalledWith(vehicleNumber);
      expect((component as any).loadData).toHaveBeenCalled();
    });

    it('should patch vehicleType on onSlotChange', () => {
      const mockForm = {
        value: { slotId: 'C2' },
        form: {
          patchValue: jasmine.createSpy('patchValue')
        }
      } as unknown as NgForm;

      component.availableSlots = MOCK_AVAILABLE_SLOTS;

      component.onSlotChange(mockForm);

      expect(mockForm.form.patchValue).toHaveBeenCalledWith({ vehicleType: '2W' });
    });
  });
});

