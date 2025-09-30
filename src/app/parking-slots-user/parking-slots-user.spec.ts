// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { ParkingSlotsUser } from './parking-slots-user';
// import { ParkingSlotsUserService } from '../Services/parking-slots-user.service';
// import { ParkingSlot } from '../model/parking-slots-module';
// import { By } from '@angular/platform-browser';
// import { ElementRef } from '@angular/core';

// // --- ARRANGE: Mock Data and Service ---

// // 1. Create a mock ParkingSlot array for consistent testing
// const MOCK_SLOTS: ParkingSlot[] = [
//   { id: 'A1', vehicleType: '2W', availability: 'occupied', status: 'occupied' },
//   { id: 'B2', vehicleType: '4W', availability: 'available', status: 'available' },
// ];

// // 2. Create a mock service class to control dependencies
// class MockParkingSlotsUserService {
//   slots: ParkingSlot[] = MOCK_SLOTS;
  
//   getTcount = jasmine.createSpy('getTcount').and.returnValue(5);
//   getCreateSlots = jasmine.createSpy('getCreateSlots').and.returnValue([{ id: 'C1', vehicleType: '2W', availability: 'occupied', status: 'occupied' }]);
//   getRefreshSlots = jasmine.createSpy('getRefreshSlots').and.returnValue([{ id: 'D1', vehicleType: '4W', availability: 'available', status: 'available' }]);
// }

// describe('ParkingSlotsUser', () => {
//   let component: ParkingSlotsUser;
//   let fixture: ComponentFixture<ParkingSlotsUser>;
//   let mockService: MockParkingSlotsUserService;

//   // --- ARRANGE: Setup TestBed ---
//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [ParkingSlotsUser], // Use the component directly if it's standalone/uses imports[]
//       providers: [
//         // Provide the mock service instead of the real one
//         { provide: ParkingSlotsUserService, useClass: MockParkingSlotsUserService }
//       ]
//     }).compileComponents();
    
//     // Get instances of the component and the mock service for use in tests
//     fixture = TestBed.createComponent(ParkingSlotsUser);
//     component = fixture.componentInstance;
//     mockService = TestBed.inject(ParkingSlotsUserService) as unknown as MockParkingSlotsUserService;

//     // Trigger initial data binding
//     fixture.detectChanges(); 
//   });

//   // --- ASSERT: Basic Checks ---
//   it('should create the component', () => {
//     expect(component).toBeTruthy();
//   });

//   // --- ASSERT: ngOnInit Initialization ---
//   describe('ngOnInit', () => {
//     it('should initialize slots and tCount from the service on initialization', () => {
//       // Act/Arrange is handled in beforeEach (fixture.detectChanges() calls ngOnInit)
      
//       // Assert
//       expect(component.slots).toEqual(MOCK_SLOTS);
//       expect(component.tCount).toBe(5);
//       expect(mockService.getTcount).toHaveBeenCalled();
//     });
//   });

//   // --- ASSERT: Service Method Calls ---
//   describe('Service interaction methods', () => {
//     it('createSlots() should update slots by calling getCreateSlots on the service', () => {
//       // Arrange
//       // Initial slots are MOCK_SLOTS, now call the method to change them
      
//       // Act
//       component.createSlots();
      
//       // Assert
//       expect(mockService.getCreateSlots).toHaveBeenCalled();
//       // Check that the component's slots were updated with the mock return value
//       expect(component.slots).toEqual([{ id: 'C1', vehicleType: '2W', availability: 'occupied', status: 'occupied' }]);
//     });

//     it('refreshSlots() should update slots by calling getRefreshSlots on the service', () => {
//       // Act
//       component.refreshSlots();
      
//       // Assert
//       expect(mockService.getRefreshSlots).toHaveBeenCalled();
//       expect(component.slots).toEqual([{id: 'D1', vehicleType: '4W', availability: 'available', status: 'available' }]);
//     });

//     it('tcount() should update tCount by calling getTcount on the service', () => {
//       // Arrange: Reset the initial call in ngOnInit for a clean test
//       mockService.getTcount.calls.reset(); 
//       mockService.getTcount.and.returnValue(10); // Set a new return value
      
//       // Act
//       component.tcount();
      
//       // Assert
//       expect(mockService.getTcount).toHaveBeenCalled();
//       expect(component.tCount).toBe(10);
//     });
//   });

//   // --- ASSERT: Hover/Info Display Methods ---
//   describe('Hover methods', () => {
//     it('showInfo() should set the hoveredSlot property', () => {
//       // Arrange
//       const testSlot: ParkingSlot = MOCK_SLOTS[0];
      
//       // Act
//       component.showInfo(testSlot);
      
//       // Assert
//       expect(component.hoveredSlot).toBe(testSlot);
//     });

//     it('hideInfo() should set the hoveredSlot property to null', () => {
//       // Arrange: Ensure a slot is initially hovered
//       component.hoveredSlot = MOCK_SLOTS[0];
      
//       // Act
//       component.hideInfo();
      
//       // Assert
//       expect(component.hoveredSlot).toBeNull();
//     });
//   });

//   // --- ASSERT: Output Event Emission ---
//   describe('onReserve', () => {
//     it('should emit the slot ID when onReserve is called', () => {
//       // Arrange
//       const testSlot: ParkingSlot = MOCK_SLOTS[0];
//       const emitSpy = spyOn(component.onReserveEvent, 'emit'); // Spy on the EventEmitter

//       // Act
//       component.onReserve(testSlot);

//       // Assert
//       expect(emitSpy).toHaveBeenCalledWith('A1');
//     });
//   });
// });

