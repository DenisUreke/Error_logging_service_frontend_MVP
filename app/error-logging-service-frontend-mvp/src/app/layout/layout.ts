import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopNavComponent } from '../shared/top-nav/top-nav';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, TopNavComponent],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class LayoutComponent {}
