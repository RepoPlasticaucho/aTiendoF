import { Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { AlmacenesEntity } from 'src/app/models/almacenes';
import { AlmacenesService } from 'src/app/services/almacenes.service';
import { Router } from '@angular/router';
import { SociedadesEntity } from 'src/app/models/sociedades';
import { AuthenticationService } from "src/app/services/authentication.service";
import { Location } from '@angular/common';

@Component({
  selector: 'app-dashboard-per',
  templateUrl: './dashboard-per.component.html',
  styleUrls: ['./dashboard-per.component.css']
})
export class DashboardPerComponent {


  //nGONInit
  ngOnInit(): void {
    this.comprobarRol();
  }

  getGridCols(): number {
    return this.breakpointObserver.isMatched('(min-width: 1200px)') ? 3 : // Si la pantalla es de al menos 1200px de ancho, mostrar 3 columnas
           this.breakpointObserver.isMatched('(min-width: 700px)') ? 2 : // Si la pantalla es de al menos 900px de ancho, mostrar 2 columnas
           1; // De lo contrario, mostrar solo 1 columna
  }

  getRowHeight(): string {
    return this.breakpointObserver.isMatched('(min-width: 1200px)') ? '225px' : // Si la pantalla es de al menos 1200px de ancho, usar una altura de fila de 225px
           this.breakpointObserver.isMatched('(min-width: 700px)') ? '225px' : // Si la pantalla es de al menos 900px de ancho, usar una altura de fila de 200px
           '200px'; // De lo contrario, usar una altura de fila de 150px
  }

  rol: boolean = false;
  /** Based on the screen size, switch from standard to one column per row */
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          { title: 'Ventas', cols: 1, rows: 1, name: "las ventas", figure: "payment" ,  dir: "navegation-facturador/(contentPersonal:ventaprov)"},
          { title: 'Cuadre de Caja', cols: 1, rows: 1, name: "las cuentas", figure: "monetization_on" , dir: "navegation-facturador/(contentPersonal:cuadre-caja)"},
          { title: 'Productos', cols: 1, rows: 1, name: "los productos", figure: "apps" , dir: "navegation-facturador/(contentPersonal:inventarios)"},
          { title: 'Inventarios', cols: 1, rows: 1, name: "los inventarios", figure: "apps" , dir: "navegation-facturador/(contentPersonal:inventarios-pedido)"},
          { title: 'Pedido Sugerido', cols: 1, rows: 1, name: "los pedidos sugeridos a Platicaucho", figure: "widgets", dir: "navegation-facturador/(contentPersonal:pedido-sugeridos)"},
          { title: 'Movimientos', cols: 1, rows: 1, name: "los movimientos", figure: "monitor" ,  dir: "navegation-facturador/(contentPersonal:movimientos)"},

        ];
      }

      return [
        { title: 'Ventas', cols: 1, rows: 1, name: "las ventas", figure: "payment" ,  dir: "navegation-facturador/(contentPersonal:ventaprov)"},
        { title: 'Cuadre de Caja', cols: 1, rows: 1, name: "las cuentas", figure: "monetization_on" , dir: "navegation-facturador/(contentPersonal:cuadre-caja)"},
        { title: 'Productos', cols: 1, rows: 1, name: "los productos", figure: "apps" , dir: "navegation-facturador/(contentPersonal:inventarios)"},
        { title: 'Inventarios', cols: 1, rows: 1, name: "los inventarios", figure: "apps" , dir: "navegation-facturador/(contentPersonal:inventarios-pedido)"},
        { title: 'Pedido Sugerido', cols: 1, rows: 1, name: "los pedidos sugeridos a Platicaucho", figure: "widgets", dir: "navegation-facturador/(contentPersonal:pedido-sugeridos)"},
        { title: 'Movimientos', cols: 1, rows: 1, name: "los movimientos", figure: "monitor" ,  dir: "navegation-facturador/(contentPersonal:movimientos)"},

      ];
    })
  );


  comprobarRol(){
    if(this.router.url.includes("facturador")){
      this.rol = true;
    }
  }

  lstAlmacenes: AlmacenesEntity[] = [];

  constructor(private breakpointObserver: BreakpointObserver,
    private readonly httpService: AlmacenesService,
    private authService: AuthenticationService,
    private location: Location,
    private router: Router) {
      console.log(localStorage.getItem('sociedadid'));
      console.log(localStorage.getItem('idalmacenPertenece'));
    }
    
    logout() {
      this.authService.logout();
      this.location.replaceState('/');
      window.location.reload();
    }
  
}
