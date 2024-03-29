import { Component, OnInit } from '@angular/core';
import { faSave, faList, faTimes, faShoppingCart, faEdit, faTrashAlt, faMoneyBillAlt } from '@fortawesome/free-solid-svg-icons';
import { MatDialogRef } from '@angular/material/dialog';
import { VentaprovComponent } from '../ventaprov/ventaprov.component'
import { DetallesMovimiento, DetallesMovimientoEntity } from 'src/app/models/detallesmovimiento';
import { DetallesmovimientoService } from 'src/app/services/detallesmovimiento.service';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { MovimientosService } from 'src/app/services/movimientos.service';

@Component({
  selector: 'app-ver-detalle',
  templateUrl: './ver-detalle.component.html',
  styleUrls: ['./ver-detalle.component.css']
})
export class VerDetalleComponent implements OnInit {

  //Iconos para la pagina de grupos
  faList = faList;
  faTimes = faTimes;
  faSave = faSave;
  faShoppingCart = faShoppingCart;
  faEdit = faEdit;
  faTrashAlt = faTrashAlt;
  faMoneyBillAlt = faMoneyBillAlt;

  //Declaración de variables
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  lstDetalleMovimientos: DetallesMovimientoEntity[] = [];
  sumaTotal: any;

  constructor(private dialogRef: MatDialogRef<VentaprovComponent>,
    private readonly httpServiceMov: MovimientosService,
    private readonly httpService: DetallesmovimientoService,
    private router: Router) { }

  ngOnInit(): void {
    this.dtOptions = {
      language: {
        url: "//cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json"
      },
      paging: true,
      search: false,
      searching: true,
      ordering: true,
      info: true,
      responsive: true
    }
    //Cargar los datos Modificar
    this.httpServiceMov.obtenermovimiento$.subscribe((res) => {
      if (res.id == '') {
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error.',
          text: 'No se ha obtenido información.',
          showConfirmButton: false,
        })
        this.dialogRef.close();
      } else {
        this.sumaTotal = res.importe_total
        const newDetalle: DetallesMovimientoEntity = {
          id: '',
          producto_nombre: '',
          inventario_id: '',
          producto_id: '',
          movimiento_id: res.id,
          cantidad: '',
          costo: '',
          precio: ''
        }
      
            this.httpService.obtenerDetalleMovimiento(newDetalle).subscribe(res => {
              if (res.codigoError != "OK") {
                Swal.fire({
                  icon: 'error',
                  title: 'No existe nada en el pedido.',
                  text: res.descripcionError,
                  showConfirmButton: false,
                  // timer: 3000
                });
                this.dialogRef.close();
              } else {
                this.lstDetalleMovimientos = res.lstDetalleMovimientos;
                this.dtTrigger.next('');
                Swal.close();
              }
            });
      }
    });
    
  }

  cerrarDialog(): void {
    this.dialogRef.close();
  }


}
