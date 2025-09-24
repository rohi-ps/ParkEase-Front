import { Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Activity } from '../dashboard-user-model';
@Component({
  selector: 'app-recent-activity',
  imports: [CommonModule],
  templateUrl: './recent-activity.html',
  styleUrl: './recent-activity.css'
})
export class RecentActivity {

  @Input() activities: Activity[] = [];

  constructor() { }

  ngOnInit(): void {
    // You can also populate this with static data if not using an input
    if (this.activities.length === 0) {
      this.activities = [
        { text: 'Parking A-15 has been reserved.', time: '10:30 PM' },
        { text: 'A new 4W slot has been added.', time: '09:45 PM' },
        { text: 'Parking A-12 is now available.', time: '09:00 PM' },
        { text: 'Parking B-08 has been reserved.', time: '08:15 PM' },
        { text: 'A new 2W slot has been added.', time: '07:30 PM' },
      ];
    }
  }
}
