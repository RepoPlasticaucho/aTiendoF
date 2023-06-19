import { Component} from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { AlmacenesEntity } from 'src/app/models/almacenes';
import { AlmacenesService } from 'src/app/services/almacenes.service';
import { Router } from '@angular/router';
import { SociedadesEntity } from 'src/app/models/sociedades';
import { AuthenticationService } from "src/app/services/authentication.service";
import { Location } from '@angular/common';
import { faEdit, faPlus, faTrashAlt, faShoppingBag } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-vistapedidos',
  templateUrl: './vistapedidos.component.html',
  styleUrls: ['./vistapedidos.component.css']
})
export class VistapedidosComponent{
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
        { title: 'Gestión de Ventas', cols: 1, rows: 1, name: "la creación de pedidos", figure: "sell" , dir: "navegation-cl/(contentClient:pedidoprov)"},
        { title: 'Estado del Pedido', cols: 1, rows: 1, name: "estado de los pedidos", figure: "local_shipping" ,  dir: "navegation-cl/(contentClient:estadopedido)"},
      ];
    }

    return [
      { title: 'Gestión de Ventas', cols: 1, rows: 1, name: "la creación de pedidos", figure: "sell" , dir: "navegation-cl/(contentClient:pedidoprov)"},
      { title: 'Estado del Pedido', cols: 1, rows: 1, name: "estado de los pedidos", figure: "local_shipping" ,  dir: "navegation-cl/(contentClient:estadopedido)"},
    ]
  })
);

lstAlmacenes: AlmacenesEntity[] = [];

constructor(private breakpointObserver: BreakpointObserver,
  private location: Location,
  private router: Router) {}

  ngOnInit(): void {
  }

}
