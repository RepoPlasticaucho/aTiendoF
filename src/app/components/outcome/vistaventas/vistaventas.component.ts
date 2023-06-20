import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { AlmacenesEntity } from 'src/app/models/almacenes';
import { Location } from '@angular/common';
import { faEdit, faPlus, faTrashAlt, faShoppingBag } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-vistaventas',
  templateUrl: './vistaventas.component.html',
  styleUrls: ['./vistaventas.component.css']
})

export class VistaventasComponent implements OnInit {
  ///Iconos para la pagina de grupos
  faShoppingBag = faShoppingBag;
  faEdit = faEdit;
  faTrashAlt = faTrashAlt;
  faPlus = faPlus;
  /** Based on the screen size, switch from standard to one column per row */
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          { title: 'Gestión de Ventas', cols: 1, rows: 1, name: "la creación de facturas", figure: "sell" , dir: "navegation-cl/(contentClient:ventaprov)"},
          { title: 'Estado de Facturas', cols: 1, rows: 1, name: "estado de las facturas", figure: "local_shipping" ,  dir: "navegation-cl/(contentClient:estadopedido)"},
        ];
      }

      return [
        { title: 'Gestión de Ventas', cols: 1, rows: 1, name: "la creación de facturas", figure: "sell" , dir: "navegation-cl/(contentClient:ventaprov)"},
        { title: 'Estado de Facturas', cols: 1, rows: 1, name: "estado de las facturas", figure: "local_shipping" ,  dir: "navegation-cl/(contentClient:estadopedido)"},
      ]
    })
  );

  lstAlmacenes: AlmacenesEntity[] = [];

  constructor(private breakpointObserver: BreakpointObserver,
    private location: Location,
    private router: Router) {
  
  }

  ngOnInit(): void {
  }

}
