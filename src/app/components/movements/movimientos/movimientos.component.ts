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
  lstAlmacenes: AlmacenesEntity[] = [];
  fechaActual: string = '';

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
      tipo_ambienteid: '',
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

  changeGroup(tipoC: any): void {
    this.filtroForm.get('fechaDesde')?.setValue(null);
    this.filtroForm.get('tipo')?.setValue('0');
    this.filtroForm.get('fechaHasta')?.enable();
    this.filtroForm.get('fechaDesde')?.enable();
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
        tipo_ambienteid: '',
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
    this.filtroForm.get('tipo')?.setValue('0');
    const fechaDesdeControl = this.filtroForm.get('fechaDesde');
    const fechaHastaControl = this.filtroForm.get('fechaHasta');
    const fechaDesde = fechaDesdeControl?.value;
    const fechaHasta = fechaHastaControl?.value;
    const almacen = this.filtroForm.get('almacen')?.value!;
    console.log(almacen)
    console.log(fechaDesde)
    console.log(fechaHasta)
    this.httpService.obtenerDetalleMovimientoAlmF(almacen, fechaDesde, fechaHasta).subscribe(res => {
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
        this.filtroForm.get('almacen')?.disable();
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

  changeGroup2(): void {
    const fechaDesdeControl = this.filtroForm.get('fechaDesde');
    const fechaHastaControl = this.filtroForm.get('fechaHasta');
    const fechaDesde = fechaDesdeControl?.value;
    const fechaHasta = fechaHastaControl?.value;
    const almacen = this.filtroForm.get('almacen')?.value!;
    const tipo = this.filtroForm.get('tipo')?.value!;
    if(fechaDesde == null || almacen == null){
      this.httpService.obtenerDetalleMovimientoAlmTipo(almacen,tipo).subscribe(res => {
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
    } else if (fechaDesde != null || almacen == null){
      this.httpService.obtenerDetalleMovimientoAlmFTipo(almacen,fechaDesde, fechaHasta, tipo).subscribe(res => {
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
    } else {
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error.',
          text: 'Seleccione un almacén',
          showConfirmButton: false,
        });
    }

  }

  reiniciarFiltros() {
    this.filtroForm.get('fechaDesde')?.setValue(null);
    this.filtroForm.get('fechaHasta')?.setValue(null);
    this.filtroForm.get('almacen')?.setValue('0');
    this.filtroForm.get('tipo')?.setValue('0');
    this.filtroForm.get('fechaDesde')?.enable();
    this.filtroForm.get('fechaHasta')?.enable();
    this.filtroForm.get('almacen')?.enable();
    this.filtroForm.get('tipo')?.enable();
    const sociedadNew: SociedadesEntity = {
      idGrupo: '',
      idSociedad: localStorage.getItem('sociedadid')!,
      razon_social: '',
      nombre_comercial: '',
      id_fiscal: '',
      tipo_ambienteid: '',
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

