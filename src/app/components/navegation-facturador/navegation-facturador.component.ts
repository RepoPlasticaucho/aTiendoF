import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AuthenticationService } from "src/app/services/authentication.service";
import { Location } from '@angular/common';
import { MatSidenav } from '@angular/material/sidenav';
import { SociedadesService } from 'src/app/services/sociedades.service';
import { SociedadesEntity } from 'src/app/models/sociedades';


@Component({
  selector: 'app-navegation-facturador',
  templateUrl: './navegation-facturador.component.html',
  styleUrls: ['./navegation-facturador.component.css']
})
export class NavegationFacturadorComponent {

  transaccionesExpandidas = false;
  showNavbar = true; // Variable para controlar la visibilidad de la barra de navegación


  toggleNavbar() {
    //Si la pantalla es pequeña, se oculta la barra de navegación
    this.showNavbar = !this.showNavbar;
  }

   nombre_comercial = this.obtenerNombreComercial();



  
   obtenerNombreComercial() {

    const sociedad: SociedadesEntity = {
      idGrupo: '',
      email: '',
      nombre_comercial: '',
      id_fiscal: '',
      id_fiscal_grupo: '',
      telefono: '',
      password: '',
      funcion: '',
      idSociedad: JSON.parse(localStorage.getItem('sociedadid') || "[]"),
      razon_social: '',
      tipo_ambienteid: '',
      url_certificado: '',
      ambiente: '',
      dir1: '',
      direccion: '',
      clave_certificado: '',
      nombreGrupo: '',
      sociedad_pertenece: '',
      almacen_personal_id: '',
      
    }

    this.sociedadesService.obtenerSociedadDatos(sociedad).subscribe((data) => {
      this.nombre_comercial = data.lstSociedades[0].nombre_comercial;
    }
    );

     return localStorage.getItem('nombreComercial');
   }



  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver,
    private authService: AuthenticationService,
    private location: Location,
    private sociedadesService: SociedadesService
  
  ) {}

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
