import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { Parkingservice} from '../Services/parkingservice'; // Adjust path
import { Observable, Subject, Subscription } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { ParkingSlot } from '../model/parkingSlot';
import { UserSearchResult } from '../model/user-search';
import { vehicleLog } from '../model/vehicleLog';

@Component({
  selector: 'app-vehicle-logs',
  standalone: true, 
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './vehicle-logs.html',
  styleUrls: ['./vehicle-logs.css']
})
export class VehicleLogs implements OnInit, OnDestroy {
  
  // --- Data Streams ---
  public parkingRecords$: Observable<vehicleLog[]>;
  public parkingCount$: Observable<number>;
  public exitCount$: Observable<number>;

  // --- "Log Entry" Modal Properties ---
  entryForm: FormGroup;
  availableSlots: ParkingSlot[] = [];
  
  userSearch$ = new Subject<string>();
  userSearchResults: UserSearchResult[] = [];
  selectedUserId: string | null = null;
  
  modalError: string | null = null;
  
  // --- Subscriptions ---
  private subscriptions = new Subscription();

  constructor(
    private fb: FormBuilder,
    public parkingService: Parkingservice // Made public to access 'parkingRecords$' in the template
  ) {
    // --- Initialize Data Streams ---
    this.parkingRecords$ = this.parkingService.parkingRecords$; // Get the stream from the service

    // Derive statistic observables from the main records stream
    this.parkingCount$ = this.parkingRecords$.pipe(
      map(records => records.filter(p => p.status === 'Parked').length)
    );

    this.exitCount$ = this.parkingRecords$.pipe(
      map(records => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return records.filter(p => {
          if (p.status === 'Completed' && p.exitTime) {
            const exitDate = new Date(p.exitTime);
            exitDate.setHours(0, 0, 0, 0);
            return exitDate.getTime() === today.getTime();
          }
          return false;
        }).length;
      })
    );

    // --- Initialize Reactive Form for "Log Entry" Modal ---
    this.entryForm = this.fb.group({
      userSearchInput: [''], // Field for typing the phone number
      customerName: ['', Validators.required],
      vehicleNumber: ['', [Validators.required, Validators.pattern('^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}$')]],
      vehicleType: ['', Validators.required],
      slotId: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // Load available slots when the component starts
    this.loadAvailableSlots();

    // --- Set up User Search Pipeline ---
    const searchSub = this.userSearch$.pipe(
      debounceTime(300), // Wait 300ms after user stops typing
      distinctUntilChanged(), // Only search if the text is new
      switchMap(phone => this.parkingService.searchUsersByPhone(phone)) // Switch to the API call
    ).subscribe(users => {
      this.userSearchResults = users;
    });
    this.subscriptions.add(searchSub); // Add to main subscription

    // --- Set up Form Listeners ---
    // 1. Listen to the user search input and push values to the subject
    const searchInputSub = this.entryForm.get('userSearchInput')?.valueChanges.subscribe(value => {
      this.userSearch$.next(value || '');
    });
    this.subscriptions.add(searchInputSub);

    // 2. Listen to vehicleType changes to reset the slot selection
    const typeChangeSub = this.entryForm.get('vehicleType')?.valueChanges.subscribe(() => {
      this.entryForm.get('slotId')?.setValue(''); // Reset slot dropdown
    });
    this.subscriptions.add(typeChangeSub);
  }

  ngOnDestroy(): void {
    // Clean up all subscriptions to prevent memory leaks
    this.subscriptions.unsubscribe();
  }

  /**
   * Fetches the list of available slots from the service.
   * Called on init and after a successful log entry.
   */
  loadAvailableSlots(): void {
    const slotSub = this.parkingService.getAvailableSlots().subscribe(slots => {
      this.availableSlots = slots;
    });
    this.subscriptions.add(slotSub);
  }

  /**
   * Called when an admin clicks a user from the search results.
   */
  selectUser(user: UserSearchResult): void {
    this.selectedUserId = user._id; 
    this.entryForm.patchValue({
      customerName: user.name, // Auto-fill customer name
      userSearchInput: user.phone // Keep phone in the input
    });
    this.userSearchResults = []; // Hide the results list
  }

  /**
   * Clears the user search and resets the related form fields.
   */
  clearUserSearch(): void {
    this.selectedUserId = null; // Clear the ID
    this.entryForm.patchValue({
      customerName: '', // Clear the name
      userSearchInput: '' // Clear the search bar
    });
    this.userSearchResults = [];
  }


  onSubmitLogEntry(): void {
    if (this.entryForm.invalid) {
      this.entryForm.markAllAsTouched(); 
      return;
    }
    
    this.parkingService.logEntry(form.value);
    form.reset();
    
    this.loadData();   // Manually refresh the data after the change
  }
  // --- NEW METHOD ---
  // This method is triggered when the user selects a different parking slot.
  onSlotChange(form: NgForm): void {
    const slotId = form.value.slotId;
    if (!slotId) return;

    // Find the full slot object from the selected ID
    const selectedSlot = this.availableSlots.find(slot => slot.slotName === slotId);

    if (selectedSlot) {
      // Use patchValue to update only the vehicleType field in the form
      form.form.patchValue({
        vehicleType: selectedSlot.vehicleType
      });
    }
  }
  logExit(form: NgForm): void {
    if (form.invalid) return;
    
    const vehicleNumber = form.value.selectedVehicleNumber;
    this.parkingService.logExit(vehicleNumber).subscribe({
      next: () => {
        console.log(`Vehicle ${vehicleNumber} exited successfully.`);
        form.resetForm();
        // (Close modal logic here)
        // Data refreshes automatically because the service's 'tap' operator
      },
      error: (err) => {
        console.error("Exit error:", err);
        // (Show error message in the exit modal)
      }
    });
  }
 
  /**
   * Called from the "Log Exit" button in the main table.
   */
  markAsExitedFromTable(vehicleNumber: string): void {
    if (!vehicleNumber) return;

    this.parkingService.logExit(vehicleNumber).subscribe({
      next: () => {
        console.log(`Vehicle ${vehicleNumber} exited successfully from table.`);
      },
      error: (err) => {
        console.error("Exit error:", err);
      }
    });
  }    
}
//changes 
