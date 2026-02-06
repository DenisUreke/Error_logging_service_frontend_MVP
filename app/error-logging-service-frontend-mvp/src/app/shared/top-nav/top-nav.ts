import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-top-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './top-nav.html',
  styleUrls: ['./top-nav.css'],

})
export class TopNavComponent {}
