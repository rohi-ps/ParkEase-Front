import { Component, OnInit , Input} from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-dashboard-stats',
  imports: [CommonModule],
  templateUrl: './dashboard-stats.html',
  styleUrl: './dashboard-stats.css'
})
export class DashboardStats implements OnInit{
   // Inputs to receive data from a parent component
  @Input() thisMonthSessions: number = 0;
  @Input() totalSpent: number = 0;
  @Input() avgDuration: number = 0;
  @Input() favoriteSlot: string = 'N/A';

  constructor() { }

  ngOnInit(): void {
    // You can also add some default or mock data here if needed
    // if (this.thisMonthSessions === 0) {
    //   this.thisMonthSessions = 23;
    //   this.totalSpent = '$156.8';
    //   this.avgDuration = '1h 45m';
    //   this.favoriteSlot = 'A-15';
    // }
  }


}
