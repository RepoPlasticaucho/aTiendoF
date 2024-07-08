import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AuthenticationService } from "src/app/services/authentication.service";
import { Location } from '@angular/common';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-navegation-cl',
  templateUrl: './navegation-cl.component.html',
  styleUrls: ['./navegation-cl.component.css']
})
export class NavegationClComponent {

  transaccionesExpandidas = false;
  showNavbar = true; // Variable para controlar la visibilidad de la barra de navegación
  nombre_comercial = this.obtenerNombreComercial();
  
  obtenerNombreComercial() {
    return localStorage.getItem('nombreComercial');
  }


  toggleNavbar() {
    //Si la pantalla es pequeña, se oculta la barra de navegación
    this.showNavbar = !this.showNavbar;
  }

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );


  constructor(private breakpointObserver: BreakpointObserver,
    private authService: AuthenticationService,
    private location: Location) {}

    closeSidenavIfSmallScreen(drawer: MatSidenav) {
      // obtén el tamaño de la pantalla
      const screenWidth = window.innerWidth;
      // si la pantalla es pequeña, cierra el mat-sidenav
      if (screenWidth < 768) {
        drawer.close();
      }
    }
  logout() {
    this.authService.logout();
    this.location.replaceState('/');
    window.location.reload();
  }

}
