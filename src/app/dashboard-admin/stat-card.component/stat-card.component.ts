import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stat-card.component.html', // Pointing to the separate HTML file
  styleUrls: ['./stat-card.component.css']  // Pointing to the separate CSS file
})
export class StatCardComponent {
  @Input() title: string = '';
  @Input() value: string | number = 0;
  @Input() iconClass: string = 'fas fa-chart-line'; // Font Awesome icon class
  @Input() iconColor: string = '#007bff';
  @Input() isCurrency: boolean = false;
}