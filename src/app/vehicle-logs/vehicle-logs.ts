import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { Parkingservice } from '../Services/parkingservice'; // Adjust path
import { ParkingSlot } from '../model/parkingSlot';
import { UserSearchResult } from '../model/user-search';
import { vehicleLog } from '../model/vehicleLog';
import { Observable, Subject, Subscription } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

// --- REMOVED: import { Modal } from 'bootstrap'; ---

@Component({
  selector: 'app-vehicle-logs',
  standalone: true, 
  imports: [
    CommonModule,         // For *ngIf, *ngFor, | async
    FormsModule,          // For the simple Exit Modal (NgForm)
    ReactiveFormsModule,  // For the complex Entry Modal (FormGroup)
    DatePipe
  ],
  templateUrl: './vehicle-logs.html',
  styleUrls: ['./vehicle-logs.css']
})
export class VehicleLogs implements OnInit, OnDestroy {
  
  // --- Data Streams ---
  public parkingRecords$: Observable<vehicleLog[]>;
  public parkingCount$: Observable<number>;
  public exitCount$: Observable<number>;
  private userSearch$ = new Subject<string>();


  // --- "Log Entry" Modal Properties ---
  entryForm: FormGroup;
  availableSlots: ParkingSlot[] = [];
  
  userSearchResults: UserSearchResult[] = [];
  userSearchError: string | null = null;
  userSearchSuccess: string | null = null;
  
  modalError: string | null = null;
  
  // --- Subscriptions ---
  private subscriptions = new Subscription();


  constructor(
    private parkingService: Parkingservice,
    private parkingSlotsService: ParkingSlotsUserService
  ) {}

  ngOnInit() {
    // Load the initial data when the component loads
    this.loadData();
  }

  private loadData(): void {
    // Replace 'admin' and 'username' with actual values as needed
    const role = 'admin'; // or 'user'
    const username = ''; // provide username if role is not 'admin'
    this.parkingRecords = this.parkingService.getParkingRecords(role, username); 
    // this.availableSlots = this.parkingSlotsService.getAvailableSlots();
  }

  public get parkingCount(): number {
    return this.parkingRecords.filter(p => p.status === 'Parked').length;
  }

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

    this.entryForm = this.fb.group({
      phoneSearchInput: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      vehicleNumber: ['', [Validators.required, Validators.pattern('^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}$')]],
      vehicleType: ['', Validators.required],
      slotId: ['', Validators.required],
      userId: [null as string | null], 
      customerName: [''] 
    });
  }

  ngOnInit(): void {
    this.loadAvailableSlots();

    const searchSub = this.userSearch$.pipe(
      debounceTime(300), 
      distinctUntilChanged(), 
      switchMap(phone => this.parkingService.searchUsersByPhone(phone)) 
    ).subscribe(users => {
      this.userSearchResults = users;
    });
    this.subscriptions.add(searchSub); 

    const searchInputSub = this.entryForm.get('phoneSearchInput')?.valueChanges.subscribe(value => {
      this.userSearch$.next(value || '');
      if (!value) {
        this.entryForm.get('userId')?.setValue(null);
      }
    });
    this.subscriptions.add(searchInputSub);

    const typeChangeSub = this.entryForm.get('vehicleType')?.valueChanges.subscribe(() => {
      this.entryForm.get('slotId')?.setValue(''); 
    });
    this.subscriptions.add(typeChangeSub);

  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadAvailableSlots(): void {
    const slotSub = this.parkingService.getAvailableSlots().subscribe(slots => {
      this.availableSlots = slots;
    });
    this.subscriptions.add(slotSub);
  }

  onFetchUser(): void {
    const phoneControl = this.entryForm.get('phoneSearchInput');
    if (phoneControl?.invalid) {
        this.userSearchError = 'Please enter a valid 10-digit phone number.';
        this.userSearchSuccess = null;
        this.userSearchResults = [];
        this.entryForm.patchValue({ userId: null, customerName: '' });
        return;
    }
    
    this.userSearchError = null;
    this.userSearchSuccess = null;
    this.userSearchResults = [];

    const phone = phoneControl?.value;
    this.parkingService.searchUsersByPhone(phone).subscribe(users => {
        if (users.length > 0) {
            if (users.length === 1) {
                this.selectUser(users[0]);
            } else {
                this.userSearchResults = users;
            }
        } else {
            this.userSearchError = 'No registered user found. Proceeding as walk-in.';
            this.entryForm.patchValue({ userId: null, customerName: `Walk-in (${phone})` });
        }
    });
  }

  selectUser(user: UserSearchResult): void {
    this.entryForm.patchValue({
      phoneSearchInput: user.phone, 
      userId: user._id,
      customerName:user.name
    });
    this.userSearchResults = []; 
    this.userSearchSuccess = `User ${user.name} selected.`;
    this.userSearchError = null;
  }

  resetEntryForm(): void {
    this.entryForm.reset({
        phoneSearchInput: '',
        vehicleNumber: '',
        vehicleType: '',
        slotId: '',
        userId: null
    });
    this.userSearchResults = [];
    this.userSearchError = null;
    this.userSearchSuccess = null;
    this.modalError = null;
  }

  onSubmitLogEntry(): void {
    if (this.entryForm.invalid) {
      this.entryForm.markAllAsTouched(); 
      return;
    }
    this.modalError = null;

    const formValue = this.entryForm.value;
    const customerName = formValue.userId ? formValue.customerName : `Walk-in (${formValue.phoneSearchInput})`;

    this.parkingService.logEntry({
      vehicleNumber: formValue.vehicleNumber,
      vehicleType: formValue.vehicleType,
      slotId: formValue.slotId, 
      userId: formValue.userId 
    }).subscribe({
      next: () => {
        // Success!
        this.resetEntryForm();
        this.loadAvailableSlots(); 
        console.log("Log entry successful!");
        
      },
      error: (err) => {
        this.modalError = err.message;
      }
    });
  }

  logExit(form: NgForm): void {
    if (form.invalid) return;
    
    const vehicleNumber = form.value.selectedVehicleNumber;
    this.parkingService.logExit(vehicleNumber).subscribe({
      next: () => {
        console.log(`Vehicle ${vehicleNumber} exited successfully.`);
        form.resetForm();
        
      },
      error: (err) => {
        console.error("Exit error:", err);
      }
    });
  }
 
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