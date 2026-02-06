import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopNavComponent } from '../shared/top-nav/top-nav'; 

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, TopNavComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent {}
