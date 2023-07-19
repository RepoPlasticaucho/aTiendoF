import { Component, OnInit, ViewChild } from '@angular/core';
import { faList, faEdit, faTrashAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import Swal from 'sweetalert2';
import { DetallesmovimientoService } from 'src/app/services/detallesmovimiento.service';
import { SociedadesEntity } from 'src/app/models/sociedades';
import { DetallesMovimientoEntity } from 'src/app/models/detallesmovimiento';
import { FormControl, FormGroup } from '@angular/forms';
import { AlmacenesService } from 'src/app/services/almacenes.service';
import { AlmacenesEntity } from 'src/app/models/almacenes';


@Component({
  selector: 'app-movimientos',
  templateUrl: './movimientos.component.html',
  styleUrls: ['./movimientos.component.css']
})
export class MovimientosComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  private datatableElement!: DataTableDirective;
  faList = faList;
  faEdit = faEdit;
  faTrashAlt = faTrashAlt;
  faPlus = faPlus;
  //Declaración de variables
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  lstDetalleMovimientos: DetallesMovimientoEntity[] = [];
  lstDetalleMovimientos2: DetallesMovimientoEntity[] = [];
  lstDetalleMovimientos3: DetallesMovimientoEntity[] = [];
  lstDetalleMovimientos4: DetallesMovimientoEntity[] = [];
  lstAlmacenes: AlmacenesEntity[] = [];

  constructor(private readonly httpService: DetallesmovimientoService,
    private readonly httpServiceAlm: AlmacenesService,
    private router: Router) { }

  filtroForm = new FormGroup({
    almacen: new FormControl('0'),
    fechaDesde: new FormControl(),
    fechaHasta: new FormControl(),
    tipo: new FormControl('0')
  });


  ngOnInit(): void {
    this.dtOptions = {
      language: {
        url: "//cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json"
      },
      paging: true,
      pageLength: 25,
      search: false,
      searching: true,
      ordering: false,
      info: true,
      responsive: true
    }
    const sociedadNew: SociedadesEntity = {
      idGrupo: '',
      idSociedad: localStorage.getItem('sociedadid')!,
      razon_social: '',
      nombre_comercial: '',
      id_fiscal: '',
      email: '',
      telefono: '',
      password: '',
      funcion: ''
    }
    this.httpServiceAlm.obtenerAlmacenesSociedad(sociedadNew).subscribe(res => {
      if (res.codigoError != 'OK') {
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error.',
          text: res.descripcionError,
          showConfirmButton: false,
        });
      } else {
        this.lstAlmacenes = res.lstAlmacenes;
      }
    });
    Swal.fire({
      title: 'CARGANDO...',
      html: 'Se están cargando los proveedores.',
      timer: 30000,
      didOpen: () => {
        Swal.showLoading();
        this.httpService.obtenerDetalleMovimientoSociedad(sociedadNew).subscribe(res => {
          if (res.codigoError != "OK") {
            Swal.fire({
              icon: 'error',
              title: 'Ha ocurrido un error.',
              text: res.descripcionError,
              showConfirmButton: false,
            });
          } else {
            this.lstDetalleMovimientos = res.lstDetalleMovimientos;
            this.lstDetalleMovimientos3 = res.lstDetalleMovimientos;
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
  }

  changeGroup(tipoC: any): void {
    this.filtroForm.get('fechaDesde')?.setValue(null);
    this.filtroForm.get('fechaHasta')?.setValue(null);
    this.filtroForm.get('tipo')?.setValue('0');
    this.filtroForm.get('fechaHasta')?.enable();
    this.filtroForm.get('fechaDesde')?.enable();
    this.lstDetalleMovimientos2.length = 0;
    this.lstDetalleMovimientos3.length = 0;
    this.lstDetalleMovimientos4.length = 0;
    const almacen: AlmacenesEntity = {
      idAlmacen: '',
      sociedad_id: '',
      nombresociedad: '',
      nombre_almacen: tipoC.target.value,
      direccion: '',
      telefono: '',
      codigo: '',
      pto_emision: ''
    }
    if (tipoC.target.value == '0') {
      const sociedadNew: SociedadesEntity = {
        idGrupo: '',
        idSociedad: localStorage.getItem('sociedadid')!,
        razon_social: '',
        nombre_comercial: '',
        id_fiscal: '',
        email: '',
        telefono: '',
        password: '',
        funcion: ''
      }
      this.httpService.obtenerDetalleMovimientoSociedad(sociedadNew).subscribe(res => {
        if (res.codigoError != "OK") {
          Swal.fire({
            icon: 'error',
            title: 'Ha ocurrido un error.',
            text: res.descripcionError,
            showConfirmButton: false,
          });
        } else {
          this.lstDetalleMovimientos = res.lstDetalleMovimientos;
          this.lstDetalleMovimientos4 = res.lstDetalleMovimientos;
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
    } else {
      this.httpService.obtenerDetalleMovimientoAlm(almacen).subscribe(res => {
        if (res.codigoError != "OK") {
          this.filtroForm.get('almacen')?.enable();
          Swal.fire({
            icon: 'error',
            title: 'No se pudo obtener movimientos.',
            text: res.descripcionError,
            showConfirmButton: false,
          });
        } else {
          this.filtroForm.get('almacen')?.disable();
          this.lstDetalleMovimientos = res.lstDetalleMovimientos;
          this.lstDetalleMovimientos4 = res.lstDetalleMovimientos;

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

  filterByDate(): void {
    const fechaDesdeControl = this.filtroForm.get('fechaDesde');
    const fechaHastaControl = this.filtroForm.get('fechaHasta');
    const fechaDesde = fechaDesdeControl?.value;
    const fechaHasta = fechaHastaControl?.value;

    let movimientosFiltrados: DetallesMovimientoEntity[];

    if (fechaDesde && fechaHasta) {
      movimientosFiltrados = this.lstDetalleMovimientos.filter(
        detalle => {
          const fechaMovimiento = this.formatDate(detalle.created_at!);

          return fechaMovimiento >= fechaDesde && fechaMovimiento <= fechaHasta;
        }
      );
    } else {
      movimientosFiltrados = this.lstDetalleMovimientos;
    }
    if (movimientosFiltrados.length > 0) {

      this.lstDetalleMovimientos = movimientosFiltrados;
      this.lstDetalleMovimientos2 = movimientosFiltrados;
      this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.dtTrigger.next('');
        dtInstance.page('first').draw('page');
      });
      if (fechaDesde) {
        fechaDesdeControl?.disable();
      }
      if (fechaHasta) {
        fechaHastaControl?.disable();
      }
    } else {
      this.filtroForm.get('fechaHasta')?.enable();
      this.filtroForm.get('fechaDesde')?.enable();
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo obtener movimientos con las fechas especificadas.',
        showConfirmButton: false,
      });
    }

  }

  formatDate(dateString: string): string {
    const parts = dateString.split(' ');
    const fechaParts = parts[0].split('/');
    const year = fechaParts[2];
    const month = fechaParts[1].padStart(2, '0');
    const day = fechaParts[0].padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  }

  changeGroup2(): void {
    if (this.lstDetalleMovimientos2.length > 0) {
      const tipo = this.filtroForm.get('tipo')?.value;
      if (tipo !== '0') {
        const movimientosFiltrados = this.lstDetalleMovimientos2.filter(
          detalle => detalle.tipo_movimiento === tipo
        );
        if (movimientosFiltrados.length > 0) {
          this.lstDetalleMovimientos = movimientosFiltrados;
          this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();
            this.dtTrigger.next('');
            dtInstance.page('first').draw('page');
          });
        } else {
          this.filtroForm.get('tipo')?.enable();
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo obtener movimientos con las fechas especificadas.',
            showConfirmButton: false,
          });
        }
      }
    } else if (this.lstDetalleMovimientos3.length > 0){
      const tipo = this.filtroForm.get('tipo')?.value;
      if (tipo !== '0') {
        const movimientosFiltrados = this.lstDetalleMovimientos3.filter(
          detalle => detalle.tipo_movimiento === tipo
        );
        if (movimientosFiltrados.length > 0) {
          this.lstDetalleMovimientos = movimientosFiltrados;
          this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();
            this.dtTrigger.next('');
            dtInstance.page('first').draw('page');
          });
        } else {
          this.filtroForm.get('tipo')?.enable();
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo obtener movimientos con las fechas especificadas.',
            showConfirmButton: false,
          });
        }

      }
    } else if(this.lstDetalleMovimientos4.length > 0) {
      const tipo = this.filtroForm.get('tipo')?.value;
      if (tipo !== '0') {
        const movimientosFiltrados = this.lstDetalleMovimientos4.filter(
          detalle => detalle.tipo_movimiento === tipo
        );
        if (movimientosFiltrados.length > 0) {
          this.lstDetalleMovimientos = movimientosFiltrados;
          this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();
            this.dtTrigger.next('');
            dtInstance.page('first').draw('page');
          });
        } else {
          this.filtroForm.get('tipo')?.enable();
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo obtener movimientos con las fechas especificadas.',
            showConfirmButton: false,
          });
        }
      }
    }

  }

  reiniciarFiltros() {
    this.filtroForm.get('fechaDesde')?.setValue(null);
    this.filtroForm.get('fechaHasta')?.setValue(null);
    this.filtroForm.get('almacen')?.setValue('0');
    this.filtroForm.get('tipo')?.setValue('0');
    this.filtroForm.get('fechaHasta')?.enable();
    this.filtroForm.get('fechaDesde')?.enable();
    this.filtroForm.get('almacen')?.enable();
    this.filtroForm.get('tipo')?.enable();
    this.lstDetalleMovimientos2.length = 0;
    this.lstDetalleMovimientos3.length = 0;
    this.lstDetalleMovimientos4.length = 0;
    const sociedadNew: SociedadesEntity = {
      idGrupo: '',
      idSociedad: localStorage.getItem('sociedadid')!,
      razon_social: '',
      nombre_comercial: '',
      id_fiscal: '',
      email: '',
      telefono: '',
      password: '',
      funcion: ''
    }
    this.httpService.obtenerDetalleMovimientoSociedad(sociedadNew).subscribe(res => {
      if (res.codigoError != "OK") {
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error.',
          text: res.descripcionError,
          showConfirmButton: false,
        });
      } else {
        this.lstDetalleMovimientos = res.lstDetalleMovimientos;
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


  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

}

