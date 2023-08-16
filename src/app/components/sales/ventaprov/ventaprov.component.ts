import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { faEdit, faList, faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Subject } from 'rxjs';
import { MovimientosEntity } from 'src/app/models/movimientos';
import { MovimientosService } from 'src/app/services/movimientos.service';
import { VentaCreateComponent } from '../../outcome/venta-create/venta-create.component';
import { VerDetalleComponent } from '../ver-detalle/ver-detalle.component';
import Swal from 'sweetalert2';
import { DataTableDirective } from 'angular-datatables';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-ventaprov',
  templateUrl: './ventaprov.component.html',
  styleUrls: ['./ventaprov.component.css']
})
export class VentaprovComponent implements OnInit {

  //Iconos para la pagina de grupos
  faList = faList;
  faEdit = faEdit;
  faTrashAlt = faTrashAlt;
  faPlus = faPlus;
  //Declaración de variables
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  private datatableElement!: DataTableDirective;
  lstMovimientos: MovimientosEntity[] = [];

  filtroForm = new FormGroup({
    fechaDesde: new FormControl(),
    fechaHasta: new FormControl()
  });

  fechaActual: string = '';

  constructor(private readonly httpService: MovimientosService,
    private router: Router,
    private dialog: MatDialog) { }
    
    
  openModal(): void {
    const dialogRef = this.dialog.open(VentaCreateComponent, {
      width: '500px',
      // Agrega cualquier configuración adicional del modal aquí
    });

    dialogRef.afterClosed().subscribe(result => {
      // Lógica para manejar el resultado después de cerrar el modal
    });
  }

  openModalDetalle(movimiento: MovimientosEntity): void {
    this.httpService.asignarMovimiento(movimiento);
    const dialogRef = this.dialog.open(VerDetalleComponent, {
      width: '900px',
      // Agrega cualquier configuración adicional del modal aquí
    });

    dialogRef.afterClosed().subscribe(result => {
      // Lógica para manejar el resultado después de cerrar el modal
    });
  }

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
    const newMovimiento: MovimientosEntity = {
      id: '',
      tipo_id: '',
      tipo_emision_cod: '',
      estado_fact_id: '',
      tipo_comprb_id: '',
      almacen_id: localStorage.getItem('almacenid')!,
      cod_doc: '',
      secuencial: ''
    }
    Swal.fire({
      title: 'CARGANDO...',
      html: 'Se están cargando los pedidos.',
      timer: 30000,
      didOpen: () => {
        Swal.showLoading();
        this.httpService.obtenerMovimientosAlmacenv(newMovimiento).subscribe(res => {
          if (res.codigoError != "OK") {
            Swal.fire({
              icon: 'error',
              title: 'Ha ocurrido un error.',
              text: res.descripcionError,
              showConfirmButton: false,
              // timer: 3000
            });
          } else {
            this.lstMovimientos = res.lstMovimientos;
            this.dtTrigger.next('');
            Swal.close();
          }
        });
      },
    }).then((result) => {
      /* Read more about handling dismissals below */
      if (result.dismiss === Swal.DismissReason.timer) {
        console.log('I was closed by the timer');
      }
    });
    this.fechaActual = new Date().toISOString().split('T')[0];
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  crearCompra() {
    const newMovimiento: MovimientosEntity = {
      almacen_id: localStorage.getItem('almacenid')!,
      id: '',
      tipo_id: '2',
      tipo_emision_cod: '',
      estado_fact_id: '1',
      tipo_comprb_id: '1',
      cod_doc: '',
      secuencial: ''
    }
    localStorage.setItem('idfiscalCl', '');
    this.httpService.agregarMovimiento(newMovimiento).subscribe(res => {
      if (res.codigoError == "OK") {
        
        // localStorage.setItem('tipo', this.pedidoForm.value.tipo!)
        // this.router.navigate(['/navegation-cl', { outlets: { 'contentClient': ['menuvent'] } }]);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error.',
          text: res.descripcionError,
          showConfirmButton: false,
        });
      }
      this.httpService.obtenerMovimientoUno(newMovimiento).subscribe(res1 => {
        console.log(res1)
        if (res1.codigoError == "OK") {
          localStorage.setItem('movimiento_id', res1.lstMovimientos[0].id);
          localStorage.setItem('estab', res1.lstMovimientos[0].estab!);
          this.router.navigate(['/navegation-cl', { outlets: { 'contentClient': ['menuvent'] } }]);
        }
      })
    })
  }

  filterByDate(): void {
    const fechaDesdeControl = this.filtroForm.get('fechaDesde');
    const fechaHastaControl = this.filtroForm.get('fechaHasta');
    const fechaDesde = fechaDesdeControl?.value;
    const fechaHasta = fechaHastaControl?.value;
    const almacen = localStorage.getItem('almacenid')!;
    this.httpService.obtenerMovimientosVentF(almacen,fechaDesde, fechaHasta).subscribe(res => {
      console.log(res)
      if (res.codigoError != "OK") {
        this.filtroForm.get('almacen')?.enable();
        Swal.fire({
          icon: 'error',
          title: 'No se pudo obtener movimientos.',
          text: res.descripcionError,
          showConfirmButton: false,
        });
      } else {
        this.lstMovimientos = res.lstMovimientos;
        this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
          // Destruye la tabla existente y elimina los datos
          dtInstance.destroy();

          // Renderiza la tabla con los nuevos datos
          this.dtTrigger.next('');

          // Opcional: Reinicia la página a la primera página
          dtInstance.page('first').draw('page');
        });
      }
    });
  }

  reiniciarFiltros() {
    this.filtroForm.get('fechaDesde')?.setValue(null);
    this.filtroForm.get('fechaHasta')?.setValue(null);
    this.filtroForm.get('fechaDesde')?.enable();
    this.filtroForm.get('fechaHasta')?.enable();
    const newMovimiento: MovimientosEntity = {
      id: '',
      tipo_id: '',
      tipo_emision_cod: '',
      estado_fact_id: '',
      tipo_comprb_id: '',
      almacen_id: localStorage.getItem('almacenid')!,
      cod_doc: '',
      secuencial: ''
    }
    this.httpService.obtenerMovimientosAlmacenv(newMovimiento).subscribe(res => {
      if (res.codigoError != "OK") {
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error.',
          text: res.descripcionError,
          showConfirmButton: false,
          // timer: 3000
        });
      } else {
        this.lstMovimientos = res.lstMovimientos;
        this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
          // Destruye la tabla existente y elimina los datos
          dtInstance.destroy();

          // Renderiza la tabla con los nuevos datos
          this.dtTrigger.next('');

          // Opcional: Reinicia la página a la primera página
          dtInstance.page('first').draw('page');
        });
      }
    });
  }

}