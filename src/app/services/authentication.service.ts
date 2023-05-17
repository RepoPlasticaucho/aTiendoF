import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  constructor(private router: Router) {}

  logout() {
    // Aquí se puede limpiar los datos de sesión
    // Eliminar los datos almacenados en localStorage
    localStorage.clear();

    this.router.navigate(['/']);
  }
}