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
  /** Based on the screen size, switch from standard to one column per row */
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          { title: 'Compras', cols: 1, rows: 1, name: "las compras", figure: "book" , dir: "navegation-cl/(contentClient:almacenesshooping)"},
          { title: 'Ventas', cols: 1, rows: 1, name: "las ventas", figure: "payment" ,  dir: "navegation-cl/(contentClient:almacenegresos)"},
          { title: 'Estado de Facturas', cols: 1, rows: 1, name: "el estado de las facturas", figure: "description" ,  dir: "navegation-cl/(contentClient:almacenes-estado-facturas)"},
          { title: 'Cuadre de Caja', cols: 1, rows: 1, name: "las cuentas", figure: "monetization_on" , dir: "navegation-cl/(contentClient:cuadre-caja)"},
          { title: 'Productos', cols: 1, rows: 1, name: "los productos", figure: "apps" , dir: "navegation-cl/(contentClient:inventarios-productos)"},
          { title: 'Inventarios', cols: 1, rows: 1, name: "los inventarios", figure: "apps" , dir: "navegation-cl/(contentClient:inventarios-almacen)"},
          { title: 'Pedido Sugerido', cols: 1, rows: 1, name: "los pedidos sugeridos a Platicaucho", figure: "widgets", dir: "navegation-cl/(contentClient:sugerdio-almacen)"},
          { title: 'Ingresos - Egresos', cols: 1, rows: 1, name: "los ingresos y egresos", figure: "monitor" ,  dir: "navegation-cl/(contentClient:movimientos)"},
          { title: 'Almacenes', cols: 1, rows: 1, name: "los almacenes", figure: "location_city", dir: "navegation-cl/(contentClient:almacenes)" },
          { title: 'Terceros', cols: 1, rows: 1, name: "los terceros", figure: "person", dir: "navegation-cl/(contentClient:tercerosalmacen)" },
          { title: 'Pedidos Plasticaucho', cols: 1, rows: 1, name: "plasticaucho", figure: "book" , dir: "navegation-cl/(contentClient:almaceningresos)"},
          { title: 'Proveedores', cols: 1, rows: 1, name: "los proveedores", figure: "supervisor_account", dir: "navegation-cl/(contentClient:proveedores)" },
          { title: 'Personal', cols: 1, rows: 1, name: "el personal", figure: "supervisor_account", dir: "navegation-cl/(contentClient:personal)" },
          { title: 'Descuentos', cols: 1, rows: 1, name: "descuentos", figure: "discounts", dir: "navegation-cl/(contentClient:descuentos)" },
          { title: 'Ayuda', cols: 1, rows: 1, name: "ayuda", figure: "help", dir: "https://docs-atiendo.vercel.app/" },

        ];
      }

      return [
        { title: 'Compras', cols: 1, rows: 1, name: "las compras", figure: "book" , dir: "navegation-cl/(contentClient:almacenesshooping)"},
        { title: 'Ventas', cols: 1, rows: 1, name: "las ventas", figure: "payment" ,  dir: "navegation-cl/(contentClient:almacenegresos)"},
        { title: 'Estado de Facturas', cols: 1, rows: 1, name: "el estado de las facturas", figure: "description" ,  dir: "navegation-cl/(contentClient:almacenes-estado-facturas)"},
        { title: 'Cuadre de Caja', cols: 1, rows: 1, name: "las cuentas", figure: "monetization_on" , dir: "navegation-cl/(contentClient:cuadre-caja)"},
        { title: 'Productos', cols: 1, rows: 1, name: "los productos", figure: "apps" , dir: "navegation-cl/(contentClient:inventarios-productos)"},
        { title: 'Inventarios', cols: 1, rows: 1, name: "los inventarios", figure: "apps" , dir: "navegation-cl/(contentClient:inventarios-almacen)"},
        { title: 'Pedido Sugerido', cols: 1, rows: 1, name: "los pedidos sugeridos a Platicaucho", figure: "widgets", dir: "navegation-cl/(contentClient:sugerdio-almacen)"},
        { title: 'Ingresos - Egresos', cols: 1, rows: 1, name: "los ingreso y egresos", figure: "monitor" ,  dir: "navegation-cl/(contentClient:movimientos)"},
        { title: 'Almacenes', cols: 1, rows: 1, name: "los almacenes", figure: "location_city", dir: "navegation-cl/(contentClient:almacenes)" },
        { title: 'Terceros', cols: 1, rows: 1, name: "los terceros", figure: "person", dir: "navegation-cl/(contentClient:tercerosusuarios)" },
        { title: 'Proveedores', cols: 1, rows: 1, name: "los proveedores", figure: "supervisor_account", dir: "navegation-cl/(contentClient:proveedores)" },
        { title: 'Personal', cols: 1, rows: 1, name: "el personal", figure: "supervisor_account", dir: "navegation-cl/(contentClient:personal)" },
        { title: 'Descuentos', cols: 1, rows: 1, name: "descuentos", figure: "discounts", dir: "navegation-cl/(contentClient:descuentos)" },
        { title: 'Ayuda', cols: 1, rows: 1, name: "ayuda", figure: "help", dir: "https://docs-atiendo.vercel.app/" },
 


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
