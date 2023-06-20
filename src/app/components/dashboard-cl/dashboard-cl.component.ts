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
          { title: 'Compras', cols: 1, rows: 1, name: "las grupos", figure: "book" , dir: "navegation-cl/(contentClient:almaceningresos)"},
          { title: 'Ventas', cols: 1, rows: 1, name: "los grupos", figure: "payment" ,  dir: "navegation-cl/(contentClient:almacenegresos)"},
          { title: 'Cuentas', cols: 1, rows: 1, name: "los grupos", figure: "monetization_on" },
          { title: 'Productos', cols: 1, rows: 1, name: "los productos", figure: "apps" , dir: "navegation-cl/(contentClient:inventarios-productos)"},
          { title: 'Inventarios', cols: 1, rows: 1, name: "los productos", figure: "apps" , dir: "navegation-cl/(contentClient:inventarios-almacen)"},
          { title: 'Pedido Sugerido', cols: 1, rows: 1, name: "las productos", figure: "widgets", dir: "navegation-cl/(contentClient:pedido-sugeridos)"},
          { title: 'Movimientos', cols: 1, rows: 1, name: "los productos", figure: "monitor" },
          { title: 'Almacenes', cols: 1, rows: 1, name: "los almacenes", figure: "location_city", dir: "navegation-cl/(contentClient:almacenes)" },
          { title: 'Usuarios', cols: 1, rows: 1, name: "los usuarios", figure: "person", dir: "navegation-cl/(contentClient:tercerosalmacen)" },
        ];
      }

      return [
        { title: 'Compras', cols: 1, rows: 1, name: "los grupos", figure: "book" , dir: "navegation-cl/(contentClient:almaceningresos)"},
        { title: 'Ventas', cols: 1, rows: 1, name: "los grupos", figure: "payment" ,  dir: "navegation-cl/(contentClient:almacenegresos)"},
        { title: 'Cuentas', cols: 1, rows: 1, name: "los grupos", figure: "monetization_on" },
        { title: 'Productos', cols: 1, rows: 1, name: "los productos", figure: "apps" , dir: "navegation-cl/(contentClient:inventarios-productos)"},
        { title: 'Inventarios', cols: 1, rows: 1, name: "los productos", figure: "apps" , dir: "navegation-cl/(contentClient:inventarios-almacen)"},
        { title: 'Pedido Sugerido', cols: 1, rows: 1, name: "las productos", figure: "widgets", dir: "navegation-cl/(contentClient:pedido-sugeridos)"},
        { title: 'Movimientos', cols: 1, rows: 1, name: "los productos", figure: "monitor" },
        { title: 'Almacenes', cols: 1, rows: 1, name: "los almacenes", figure: "location_city", dir: "navegation-cl/(contentClient:almacenes)" },
        { title: 'Usuarios', cols: 1, rows: 1, name: "los usuarios", figure: "person", dir: "navegation-cl/(contentClient:tercerosalmacen)" },
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
