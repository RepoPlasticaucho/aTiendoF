import { Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { AuthenticationService } from "src/app/services/authentication.service";
import { Location } from '@angular/common';
@Component({
  selector: 'app-dashboard-adm',
  templateUrl: './dashboard-adm.component.html',
  styleUrls: ['./dashboard-adm.component.css']
})
export class DashboardAdmComponent {
  /** Based on the screen size, switch from standard to one column per row */
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


  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          { title: 'Categorias', cols: 1, rows: 1, name: "las categorias de productos", figure: "file_copy", dir: "navegation-adm/(contentAdmin:categorias)" },
          { title: 'Lineas', cols: 1, rows: 1, name: "las lineas de productos", figure: "assignment", dir: "navegation-adm/(contentAdmin:lineas)" },
          { title: 'Modelos', cols: 1, rows: 1, name: "los modelos de productos", figure: "shopping_bag", dir: "navegation-adm/(contentAdmin:modelos)" },
          { title: 'Marcas', cols: 1, rows: 1, name: "las marcas de productos", figure: "bookmarks", dir: "navegation-adm/(contentAdmin:marcas)" },
          { title: 'Colores', cols: 1, rows: 1, name: "los colores de productos", figure: "shopping_cart", dir: "navegation-adm/(contentAdmin:colores)" },
          { title: 'Caracteristicas', cols: 1, rows: 1, name: "las caracteristicas ", figure: "pie_chart", dir: "navegation-adm/(contentAdmin:atributos)" },
          { title: 'Géneros', cols: 1, rows: 1, name: "los géneros de productos", figure: "pie_chart", dir: "navegation-adm/(contentAdmin:generos)" },
          { title: 'Modelo Producto', cols: 1, rows: 1, name: "los modelos productos", figure: "widgets", dir: "navegation-adm/(contentAdmin:modeloProductos)" },
          { title: 'Productos', cols: 1, rows: 1, name: "los productos", figure: "widgets", dir: "navegation-adm/(contentAdmin:productos)" },
          { title: 'Grupos', cols: 1, rows: 1, name: "los grupos", figure: "person", dir: "navegation-adm/(contentAdmin:grupos)" },
          // { title: 'Proveedores', cols: 1, rows: 1, name: "los proveedores", figure: "supervisor_account", dir: "navegation-adm/(contentAdmin:proveedores)" },
          { title: 'Sociedades', cols: 1, rows: 1, name: "las sociedades", figure: "supervisor_account", dir: "navegation-adm/(contentAdmin:sociedades)" },
          { title: 'Almacenes', cols: 1, rows: 1, name: "los almacenes", figure: "location_city", dir: "navegation-adm/(contentAdmin:almacenes)" }
          //  { title: 'Usuarios', cols: 1, rows: 1, name: "los usuarios", figure: "person", dir: "navegation-adm/(contentAdmin:terceros)" },
        ];
      }

      return [
        { title: 'Categorias', cols: 1, rows: 1, name: "las categorias de productos", figure: "file_copy", dir: "navegation-adm/(contentAdmin:categorias)" },
        { title: 'Lineas', cols: 1, rows: 1, name: "las lineas de productos", figure: "assignment", dir: "navegation-adm/(contentAdmin:lineas)" },
        { title: 'Modelos', cols: 1, rows: 1, name: "los modelos de productos", figure: "shopping_bag", dir: "navegation-adm/(contentAdmin:modelos)" },
        { title: 'Marcas', cols: 1, rows: 1, name: "las marcas de productos", figure: "bookmarks", dir: "navegation-adm/(contentAdmin:marcas)" },
        { title: 'Colores', cols: 1, rows: 1, name: "los colores de productos", figure: "shopping_cart", dir: "navegation-adm/(contentAdmin:colores)" },
        { title: 'Caracteristicas', cols: 1, rows: 1, name: "las caracteristicas ", figure: "pie_chart", dir: "navegation-adm/(contentAdmin:atributos)" },
        { title: 'Géneros', cols: 1, rows: 1, name: "los géneros de productos", figure: "pie_chart", dir: "navegation-adm/(contentAdmin:generos)" },
        { title: 'Modelo Producto', cols: 1, rows: 1, name: "los modelos productos", figure: "widgets", dir: "navegation-adm/(contentAdmin:modeloProductos)" },
        { title: 'Productos', cols: 1, rows: 1, name: "los productos", figure: "widgets", dir: "navegation-adm/(contentAdmin:productos)" },
        { title: 'Grupos', cols: 1, rows: 1, name: "los grupos", figure: "person", dir: "navegation-adm/(contentAdmin:grupos)" },
        // { title: 'Proveedores', cols: 1, rows: 1, name: "los proveedores", figure: "supervisor_account", dir: "navegation-adm/(contentAdmin:proveedores)" },
        { title: 'Sociedades', cols: 1, rows: 1, name: "las sociedades", figure: "supervisor_account", dir: "navegation-adm/(contentAdmin:sociedades)" },
        { title: 'Almacenes', cols: 1, rows: 1, name: "los almacenes", figure: "location_city", dir: "navegation-adm/(contentAdmin:almacenes)" },
        //S  { title: 'Usuarios', cols: 1, rows: 1, name: "los usuarios", figure: "person", dir: "navegation-adm/(contentAdmin:terceros)" },
        //  { title: 'Roles', cols: 1, rows: 1, name: "los roles", figure: "lock_person" }
      ];
    })
  );

  constructor(private breakpointObserver: BreakpointObserver,
    private authService: AuthenticationService,
    private location: Location) {

  }

  logout() {
    this.authService.logout();
    this.location.replaceState('/');
    window.location.reload();
  }
}
