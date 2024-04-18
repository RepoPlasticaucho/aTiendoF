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
  /** Based on the screen size, switch from standard to one column per row */
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          { title: 'Ventas', cols: 1, rows: 1, name: "las ventas", figure: "payment" ,  dir: "navegation-facturador/(contentPersonal:almacenegresos)"},
          { title: 'Cuadre de Caja', cols: 1, rows: 1, name: "las cuentas", figure: "monetization_on" , dir: "navegation-facturador/(contentPersonal:cuadre-caja)"},
          { title: 'Productos', cols: 1, rows: 1, name: "los productos", figure: "apps" , dir: "navegation-facturador/(contentPersonal:inventarios-productos)"},
          { title: 'Inventarios', cols: 1, rows: 1, name: "los inventarios", figure: "apps" , dir: "navegation-facturador/(contentPersonal:inventarios-almacen)"},
          { title: 'Pedido Sugerido', cols: 1, rows: 1, name: "los pedidos sugeridos a Platicaucho", figure: "widgets", dir: "navegation-facturador/(contentPersonal:pedido-sugeridos)"},
          { title: 'Movimientos', cols: 1, rows: 1, name: "los movimientos", figure: "monitor" ,  dir: "navegation-facturador/(contentPersonal:movimientos)"},

        ];
      }

      return [
        { title: 'Ventas', cols: 1, rows: 1, name: "las ventas", figure: "payment" ,  dir: "navegation-facturador/(contentPersonal:almacenegresos)"},
        { title: 'Cuadre de Caja', cols: 1, rows: 1, name: "las cuentas", figure: "monetization_on" , dir: "navegation-facturador/(contentPersonal:cuadre-caja)"},
        { title: 'Productos', cols: 1, rows: 1, name: "los productos", figure: "apps" , dir: "navegation-facturador/(contentPersonal:inventarios-productos)"},
        { title: 'Inventarios', cols: 1, rows: 1, name: "los inventarios", figure: "apps" , dir: "navegation-facturador/(contentPersonal:inventarios-almacen)"},
        { title: 'Pedido Sugerido', cols: 1, rows: 1, name: "los pedidos sugeridos a Platicaucho", figure: "widgets", dir: "navegation-facturador/(contentPersonal:pedido-sugeridos)"},
        { title: 'Movimientos', cols: 1, rows: 1, name: "los movimientos", figure: "monitor" ,  dir: "navegation-facturador/(contentPersonal:movimientos)"},

      ];
    })
  );

  lstAlmacenes: AlmacenesEntity[] = [];

  constructor(private breakpointObserver: BreakpointObserver,
    private readonly httpService: AlmacenesService,
    private authService: AuthenticationService,
    private location: Location,
    private router: Router) {}
    
    logout() {
      this.authService.logout();
      this.location.replaceState('/');
      window.location.reload();
    }
  
}
