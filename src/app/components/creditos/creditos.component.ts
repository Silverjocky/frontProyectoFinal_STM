import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Developer {
  name: string;
  group: string;
  role?: string;
  email?: string;
}

@Component({
  selector: 'app-creditos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './creditos.component.html',
  styleUrl: './creditos.component.css'
})
export class CreditosComponent implements OnInit {
  developer: Developer = {
    name: 'Salvador Trejo Martínez',
    group: '7CM2',
    role: 'Desarrollador Full Stack',
    email: 'salvador.trejo@example.com'
  };

  currentYear: number = new Date().getFullYear();

  ngOnInit() {
    // Puedes agregar aquí cualquier lógica de inicialización adicional
    this.setPageTitle();
  }

  private setPageTitle() {
    document.title = `Créditos - ${this.developer.name}`;
  }
}