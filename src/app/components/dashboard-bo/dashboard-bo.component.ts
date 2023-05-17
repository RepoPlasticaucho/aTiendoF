import { Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-dashboard-bo',
  templateUrl: './dashboard-bo.component.html',
  styleUrls: ['./dashboard-bo.component.css']
})
export class DashboardBoComponent {
  /** Based on the screen size, switch from standard to one column per row */
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          { title: 'Categorias', cols: 1, rows: 1, name: "las categorias de productos", figure: "file_copy" },
          { title: 'Lineas', cols: 1, rows: 1, name: "las lineas de productos", figure: "assignment" },
          { title: 'Marcas', cols: 1, rows: 1, name: "las marcas de productos", figure: "bookmarks" },
          { title: 'Colores', cols: 1, rows: 1, name: "los colores de productos", figure: "shopping_cart" },
          { title: 'Caracteristicas', cols: 1, rows: 1, name: "las caracteristicas ", figure: "pie_chart" },
          { title: 'Productos', cols: 1, rows: 1, name: "los productos", figure: "widgets" },
          { title: 'Grupos', cols: 1, rows: 1, name: "los grupos", figure: "person", dir: "grupos" },
          { title: 'Sociedades', cols: 1, rows: 1, name: "las sociedades", figure: "supervisor_account", dir: "sociedades" },
          { title: 'Almacenes', cols: 1, rows: 1, name: "los almacenes", figure: "location_city" },
        ];
      }

      return [
        { title: 'Categorias', cols: 1, rows: 1, name: "las categorias de productos", figure: "file_copy", dir: "navegation-bo/(contentBo:categorias)" },
        { title: 'Lineas', cols: 1, rows: 1, name: "las lineas de productos", figure: "assignment", dir: "navegation-bo/(contentBo:lineas)" },
        { title: 'Marcas', cols: 1, rows: 1, name: "las marcas de productos", figure: "bookmarks", dir: "navegation-bo/(contentBo:marcas)" },
        { title: 'Colores', cols: 1, rows: 1, name: "los colores de productos", figure: "shopping_cart", dir: "navegation-bo/(contentBo:colores)" },
        { title: 'Caracteristicas', cols: 1, rows: 1, name: "las caracteristicas ", figure: "pie_chart", dir: "navegation-bo/(contentBo:atributos)" },
        { title: 'Productos', cols: 1, rows: 1, name: "los productos", figure: "widgets", dir: "navegation-bo/(contentBo:productos)" },
        { title: 'Grupos', cols: 1, rows: 1, name: "los grupos", figure: "person", dir: "navegation-bo/(contentBo:grupos)" },
        { title: 'Sociedades', cols: 1, rows: 1, name: "las sociedades", figure: "supervisor_account", dir: "navegation-bo/(contentBo:sociedades)" },
        { title: 'Almacenes', cols: 1, rows: 1, name: "los almacenes", figure: "location_city", dir: "navegation-bo/(contentBo:almacenes)" },
      ];
    })
  );

  constructor(private breakpointObserver: BreakpointObserver) {}
}
