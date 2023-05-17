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
          { title: 'Ingresos', cols: 1, rows: 1, name: "las grupos", figure: "book" },
          { title: 'Egresos', cols: 1, rows: 1, name: "los grupos", figure: "book" ,  dir: "navegation-cl/(contentClient:egresos)"},
          { title: 'Saldos', cols: 1, rows: 1, name: "los grupos", figure: "book" },
          // { title: 'Lineas', cols: 1, rows: 1, name: "las lineas de productos", figure: "assignment" },
          { title: 'Productos', cols: 1, rows: 1, name: "los productos", figure: "apps" , dir: "navegation-cl/(contentClient:inventarios-productos)"},
          // { title: 'Modelos', cols: 1, rows: 1, name: "los modelos de productos", figure: "shopping_bag" },
          // { title: 'Marcas', cols: 1, rows: 1, name: "las marcas de productos", figure: "bookmarks" },
          // { title: 'Colores', cols: 1, rows: 1, name: "los colores de productos", figure: "shopping_cart" },
          // { title: 'Caracteristicas', cols: 1, rows: 1, name: "las caracteristicas ", figure: "pie_chart" },
          // { title: 'Géneros', cols: 1, rows: 1, name: "los géneros de productos", figure: "pie_chart" },
          // { title: 'Modelo Producto', cols: 1, rows: 1, name: "los modelos productos", figure: "widgets",  dir: "navegation-cl/(contentClient:modeloproductos)" },
          { title: 'Inventarios', cols: 1, rows: 1, name: "los productos", figure: "apps" , dir: "navegation-cl/(contentClient:inventarios-almacen)"},
          // { title: 'Productos', cols: 1, rows: 1, name: "los productos", figure: "widgets" },
          { title: 'Pedido Sugerido', cols: 1, rows: 1, name: "las productos", figure: "widgets", dir: "navegation-cl/(contentClient:pedido-sugeridos)"},
          { title: 'Movimientos', cols: 1, rows: 1, name: "los productos", figure: "monitor" },
          // { title: 'Grupos', cols: 1, rows: 1, name: "los grupos", figure: "person", dir: "grupos" },
          // { title: 'Sociedades', cols: 1, rows: 1, name: "las sociedades", figure: "supervisor_account", dir: "sociedades" },
          { title: 'Almacenes', cols: 1, rows: 1, name: "los almacenes", figure: "location_city", dir: "navegation-cl/(contentClient:almacenes)" },
          { title: 'Usuarios', cols: 1, rows: 1, name: "los usuarios", figure: "person", dir: "navegation-cl/(contentClient:tercerosalmacen)" },
          // { title: 'Roles', cols: 1, rows: 1, name: "los roles", figure: "lock_person" }
        ];
      }

      return [
        { title: 'Ingresos', cols: 1, rows: 1, name: "los grupos", figure: "book" },
        { title: 'Egresos', cols: 1, rows: 1, name: "los grupos", figure: "book" ,  dir: "navegation-cl/(contentClient:egresos)"},
        { title: 'Saldos', cols: 1, rows: 1, name: "los grupos", figure: "book" },
        // { title: 'Lineas', cols: 1, rows: 1, name: "las lineas de productos", figure: "assignment" },
        { title: 'Productos', cols: 1, rows: 1, name: "los productos", figure: "apps" , dir: "navegation-cl/(contentClient:inventarios-productos)"},
        // { title: 'Modelos', cols: 1, rows: 1, name: "los modelos de productos", figure: "shopping_bag" },
        // { title: 'Marcas', cols: 1, rows: 1, name: "las marcas de productos", figure: "bookmarks" },
        // { title: 'Colores', cols: 1, rows: 1, name: "los colores de productos", figure: "shopping_cart" },
        // { title: 'Caracteristicas', cols: 1, rows: 1, name: "las caracteristicas ", figure: "pie_chart" },
        // { title: 'Géneros', cols: 1, rows: 1, name: "los géneros de productos", figure: "pie_chart" },
        // { title: 'Modelo Producto', cols: 1, rows: 1, name: "los modelos productos", figure: "widgets",  dir: "navegation-cl/(contentClient:modeloproductos)" },
        { title: 'Inventarios', cols: 1, rows: 1, name: "los productos", figure: "apps" , dir: "navegation-cl/(contentClient:inventarios-almacen)"},
        { title: 'Pedido Sugerido', cols: 1, rows: 1, name: "las productos", figure: "widgets", dir: "navegation-cl/(contentClient:pedido-sugeridos)"},
        { title: 'Movimientos', cols: 1, rows: 1, name: "los productos", figure: "monitor" },
        // { title: 'Grupos', cols: 1, rows: 1, name: "los grupos", figure: "person", dir: "grupos" },
        // { title: 'Sociedades', cols: 1, rows: 1, name: "las sociedades", figure: "supervisor_account", dir: "sociedades" },
        { title: 'Almacenes', cols: 1, rows: 1, name: "los almacenes", figure: "location_city", dir: "navegation-cl/(contentClient:almacenes)" },
        { title: 'Usuarios', cols: 1, rows: 1, name: "los usuarios", figure: "person", dir: "navegation-cl/(contentClient:tercerosalmacen)" },
        // { title: 'Roles', cols: 1, rows: 1, name: "los roles", figure: "lock_person" }
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
