import { Component, OnInit } from '@angular/core';
import { faShoppingBag, faTimes, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import Swal from 'sweetalert2';
import { MovimientosEntity } from 'src/app/models/movimientos';
import { MatDialogRef } from '@angular/material/dialog';
import { MenuventComponent } from '../../all_components';
import { MovimientosService } from 'src/app/services/movimientos.service';

@Component({
  selector: 'app-cuadre-mov',
  templateUrl: './cuadre-mov.component.html',
  styleUrls: ['./cuadre-mov.component.css']
})
export class CuadreMovComponent implements OnInit {

  faShoppingBag = faShoppingBag;
  faShoppingCart = faShoppingCart;
  faTimes = faTimes;
  // Nueva propiedad para las tarjetas de la página actual
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  lstMovimientos: MovimientosEntity[] = [];
  
  constructor(private dialogRef: MatDialogRef<MenuventComponent>,
    private router: Router,
    private httpsMovimientosService: MovimientosService) { }

  ngOnInit(): void {
    this.dtOptions = {
      language: {
        url: "//cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json"
      },
      paging: true,
      search: false,
      searching: true,
      ordering: false,
      info: true,
      responsive: true
    }
    Swal.fire({
      title: 'CARGANDO...',
      html: 'Se están cargando los productos.',
      timer: 30000,
      didOpen: () => {
        Swal.showLoading();
        const almacen = localStorage.getItem('nombrealmacen')!;
        const fechadesde = localStorage.getItem('fechadesde')!;
        const fechahasta = localStorage.getItem('fechahasta')!;
        const sociedadid = localStorage.getItem('sociedadid')!;
        if(almacen != '' && fechadesde != '' && fechahasta != ''){
          this.httpsMovimientosService.obtenerMovimientosAlmacenFecha(almacen, fechadesde, fechahasta).subscribe((res1) => {
            if (res1.codigoError != 'OK') {
              Swal.fire({
                icon: 'error',
                title: 'No se pudo obtener movimientos.',
                text: res1.descripcionError,
                showConfirmButton: false,
              });
            } else {
              this.lstMovimientos = res1.lstMovimientos;
              this.dtTrigger.next('');
              Swal.close();
            }
          });
        } else if (almacen != '' && fechadesde == '' && fechahasta == '') {
          this.httpsMovimientosService.obtenerMovimientosAlmacenNombre(almacen).subscribe((res1) => {
            if (res1.codigoError != 'OK') {
              Swal.fire({
                icon: 'error',
                title: 'No se pudo obtener movimientos.',
                text: res1.descripcionError,
                showConfirmButton: false,
              });
            } else {
              this.lstMovimientos = res1.lstMovimientos;
              this.dtTrigger.next('');
              Swal.close();
            }
          });
        } else if (almacen == '' && fechadesde != ''&& fechahasta != ''){
          this.httpsMovimientosService.obtenerMovimientosFechas(sociedadid, fechadesde, fechahasta).subscribe((res1) => {
            if (res1.codigoError != 'OK') {
              Swal.fire({
                icon: 'error',
                title: 'No se pudo obtener movimientos.',
                text: res1.descripcionError,
                showConfirmButton: false,
              });
            } else {
              this.lstMovimientos = res1.lstMovimientos;
              this.dtTrigger.next('');
              Swal.close();
            }
          });
        } else if (almacen == '' && fechadesde == ''&& fechahasta == ''){
          this.httpsMovimientosService.obtenerMovimientosTodos(sociedadid).subscribe((res1) => {
            if (res1.codigoError != 'OK') {
              Swal.fire({
                icon: 'error',
                title: 'No se pudo obtener movimientos.',
                text: res1.descripcionError,
                showConfirmButton: false,
              });
            } else {
              this.lstMovimientos = res1.lstMovimientos;
              this.dtTrigger.next('');
              Swal.close();
            }
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'No se pudo obtener movimientos.',
            text: '',
            showConfirmButton: false,
          });
          this.cerrarDialog();
        }
      },
    }).then((result) => {
      if (result.dismiss === Swal.DismissReason.timer) {
        console.log('I was closed by the timer');
      }
    });
  }

  cerrarDialog(): void {
    this.dialogRef.close();
  }

}
