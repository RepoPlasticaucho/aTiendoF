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
  selector: 'app-dashboard-cl',
  templateUrl: './dashboard-cl.component.html',
  styleUrls: ['./dashboard-cl.component.css']
})
export class DashboardClComponent {
  /** Based on the screen size, switch from standard to one column per row */
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          { title: 'Compras', cols: 1, rows: 1, name: "las compras", figure: "book" , dir: "navegation-cl/(contentClient:almacenesshooping)"},
          { title: 'Ventas', cols: 1, rows: 1, name: "las ventas", figure: "payment" ,  dir: "navegation-cl/(contentClient:almacenegresos)"},
          { title: 'Cuentas', cols: 1, rows: 1, name: "las cuentas", figure: "monetization_on" },
          { title: 'Productos', cols: 1, rows: 1, name: "los productos", figure: "apps" , dir: "navegation-cl/(contentClient:inventarios-productos)"},
          { title: 'Inventarios', cols: 1, rows: 1, name: "los inventarios", figure: "apps" , dir: "navegation-cl/(contentClient:inventarios-almacen)"},
          { title: 'Pedido Sugerido', cols: 1, rows: 1, name: "el pedido sugerido", figure: "widgets", dir: "navegation-cl/(contentClient:pedido-sugeridos)"},
          { title: 'Movimientos', cols: 1, rows: 1, name: "los movimientos", figure: "monitor" ,  dir: "navegation-cl/(contentClient:movimientos)"},
          { title: 'Almacenes', cols: 1, rows: 1, name: "los almacenes", figure: "location_city", dir: "navegation-cl/(contentClient:almacenes)" },
          { title: 'Usuarios', cols: 1, rows: 1, name: "los usuarios", figure: "person", dir: "navegation-cl/(contentClient:tercerosalmacen)" },
          { title: 'Pedidos Plasticaucho', cols: 1, rows: 1, name: "plasticaucho", figure: "book" , dir: "navegation-cl/(contentClient:almaceningresos)"},

        ];
      }

      return [
        { title: 'Compras', cols: 1, rows: 1, name: "las compras", figure: "book" , dir: "navegation-cl/(contentClient:almacenesshooping)"},
        { title: 'Ventas', cols: 1, rows: 1, name: "las ventas", figure: "payment" ,  dir: "navegation-cl/(contentClient:almacenegresos)"},
        { title: 'Cuentas', cols: 1, rows: 1, name: "las cuentas", figure: "monetization_on" },
        { title: 'Productos', cols: 1, rows: 1, name: "los productos", figure: "apps" , dir: "navegation-cl/(contentClient:inventarios-productos)"},
        { title: 'Inventarios', cols: 1, rows: 1, name: "los inventarios", figure: "apps" , dir: "navegation-cl/(contentClient:inventarios-almacen)"},
        { title: 'Pedido Sugerido', cols: 1, rows: 1, name: "los pedidos sugerido", figure: "widgets", dir: "navegation-cl/(contentClient:pedido-sugeridos)"},
        { title: 'Movimientos', cols: 1, rows: 1, name: "los movimientos", figure: "monitor" ,  dir: "navegation-cl/(contentClient:movimientos)"},
        { title: 'Almacenes', cols: 1, rows: 1, name: "los almacenes", figure: "location_city", dir: "navegation-cl/(contentClient:almacenes)" },
        { title: 'Usuarios', cols: 1, rows: 1, name: "los usuarios", figure: "person", dir: "navegation-cl/(contentClient:tercerosalmacen)" },
        { title: 'Plasticaucho', cols: 1, rows: 1, name: "plasticaucho", figure: "book" , dir: "navegation-cl/(contentClient:almaceningresos)"},

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
