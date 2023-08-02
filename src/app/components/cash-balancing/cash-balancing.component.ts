import { Component, OnInit, ViewChild } from '@angular/core';
import { faList, faEdit, faTrashAlt, faPlus, faMoneyBillAlt } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import Swal from 'sweetalert2';
import { FormControl, FormGroup } from '@angular/forms';
import { AlmacenesService } from 'src/app/services/almacenes.service';
import { AlmacenesEntity } from 'src/app/models/almacenes';
import { SociedadesEntity } from 'src/app/models/sociedades';
import { DetallesPagoService } from 'src/app/services/detalles-pago.service';
import { FormasPagoEntity } from 'src/app/models/formas-pago';
import { MatDialog } from '@angular/material/dialog';
import { CuadreMovComponent } from './cuadre-mov/cuadre-mov.component';

@Component({
  selector: 'app-cash-balancing',
  templateUrl: './cash-balancing.component.html',
  styleUrls: ['./cash-balancing.component.css']
})
export class CashBalancingComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  private datatableElement!: DataTableDirective;
  faList = faList;
  faEdit = faEdit;
  faTrashAlt = faTrashAlt;
  faPlus = faPlus;
  faMoneyBillAlt = faMoneyBillAlt;
  //Declaración de variables
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  efectivo: string = '';
  tar_deb: string = '';
  tar_cre: string = '';
  lstAlmacenes: AlmacenesEntity[] = [];
  fechaActual: string = '';
  sumaTotal: any;

  constructor(private readonly httpServiceAlm: AlmacenesService,
    private dialog: MatDialog,
    private readonly httpService: DetallesPagoService,
    private router: Router) { }

  filtroForm = new FormGroup({
    almacen: new FormControl('0'),
    fechaDesde: new FormControl(),
    fechaHasta: new FormControl()
  });


  ngOnInit(): void {
    localStorage.setItem('nombrealmacen','')
    localStorage.setItem('fechadesde','')
    localStorage.setItem('fechahasta','')
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
    const almacen: AlmacenesEntity = {
      idAlmacen: '',
      sociedad_id: localStorage.getItem('sociedadid')!,
      nombresociedad: '',
      nombre_almacen: '',
      direccion: '',
      telefono: '',
      codigo: '',
      pto_emision: ''
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
      html: 'Se están cargando los valores.',
      timer: 30000,
      didOpen: () => {
        Swal.showLoading();
        this.httpService.obtenerDetallePagoE(almacen).subscribe(res => {
          if (res.codigoError != "OK") {
            Swal.fire({
              icon: 'error',
              title: 'Ha ocurrido un error.',
              text: res.descripcionError,
              showConfirmButton: false,
            });
          } else {
            this.efectivo = res.lstDetallePagos[0].valorE!;
            console.log(this.efectivo)
            this.httpService.obtenerDetallePagoTD(almacen).subscribe(res => {
              if (res.codigoError != "OK") {
                Swal.fire({
                  icon: 'error',
                  title: 'Ha ocurrido un error.',
                  text: res.descripcionError,
                  showConfirmButton: false,
                });
              } else {
                this.tar_deb = res.lstDetallePagos[0].valorTD!;
    
                this.httpService.obtenerDetallePagoTC(almacen).subscribe(res => {
                  if (res.codigoError != "OK") {
                    Swal.fire({
                      icon: 'error',
                      title: 'Ha ocurrido un error.',
                      text: res.descripcionError,
                      showConfirmButton: false,
                    });
                  } else {
                    this.tar_cre = res.lstDetallePagos[0].valorTC!;

                    this.calcularSumaTotal();
                    Swal.close();
                  }
                });
              }
            });
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

  calcularSumaTotal() {
    if(this.efectivo == ''){
      this.efectivo = '0';
    }
    if(this.tar_deb == '') {
      this.tar_deb = '0';
    }
    if(this.tar_cre == ''){
      this.tar_cre = '0';
    }
    const suma = parseFloat(this.efectivo) + parseFloat(this.tar_deb) + parseFloat(this.tar_cre)
    console.log(this.efectivo)
    this.sumaTotal = suma
      .toLocaleString(undefined, { minimumFractionDigits: 2 })
      .replace('.', ',');
  }

  verDetalleMovimiento(tipoPago: string) {
    const dialogRef = this.dialog.open(CuadreMovComponent, {
      width: '900px',
      height: '600px',
      data: { tipoPago }
      // Agrega cualquier configuración adicional del modal aquí
    });
    dialogRef.afterClosed().subscribe((result) => {
      // Lógica para manejar el resultado después de cerrar el modal
    });
  }

  changeGroup(tipoC: any): void {
    this.filtroForm.get('fechaDesde')?.setValue(null);
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
    localStorage.setItem('nombrealmacen', tipoC.target.value);
    const forma1: FormasPagoEntity = {
      id: '1',
      nombre: '',
      codigo: '',
      fecha_inicio: '',
      fecha_fin: '',
      created_at: '',
      updated_at: ''
    }
    const forma2: FormasPagoEntity = {
      id: '2',
      nombre: '',
      codigo: '',
      fecha_inicio: '',
      fecha_fin: '',
      created_at: '',
      updated_at: ''
    }
    const forma3: FormasPagoEntity = {
      id: '3',
      nombre: '',
      codigo: '',
      fecha_inicio: '',
      fecha_fin: '',
      created_at: '',
      updated_at: ''
    }
    if (tipoC.target.value == '0') {
      const sociedadNew: SociedadesEntity = {
        idGrupo: '',
        idSociedad: localStorage.getItem('sociedadid')!,
        razon_social: '',
        nombre_comercial: '',
        tipo_ambienteid: '',
        id_fiscal: '',
        email: '',
        telefono: '',
        password: '',
        funcion: ''
      }
      this.httpService.obtenerDetallePagoE(almacen).subscribe(res => {
        if (res.codigoError != "OK") {
          Swal.fire({
            icon: 'error',
            title: 'Ha ocurrido un error.',
            text: res.descripcionError,
            showConfirmButton: false,
          });
        } else {
          this.efectivo = res.lstDetallePagos[0].valorE!;
          this.httpService.obtenerDetallePagoTD(almacen).subscribe(res => {
            if (res.codigoError != "OK") {
              Swal.fire({
                icon: 'error',
                title: 'Ha ocurrido un error.',
                text: res.descripcionError,
                showConfirmButton: false,
              });
            } else {
              this.tar_deb = res.lstDetallePagos[0].valorTD!;
              this.httpService.obtenerDetallePagoTC(almacen).subscribe(res => {
                if (res.codigoError != "OK") {
                  Swal.fire({
                    icon: 'error',
                    title: 'Ha ocurrido un error.',
                    text: res.descripcionError,
                    showConfirmButton: false,
                  });
                } else {
                  this.tar_cre = res.lstDetallePagos[0].valorTC!;
                  this.calcularSumaTotal();
                }
              });
            }
          });
        }
      });
    } else {
      this.httpService.obtenerDetallePagoAlm(almacen, forma1).subscribe(res => {
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
          this.efectivo = res.lstDetallePagos[0].valor!;
          this.httpService.obtenerDetallePagoAlm(almacen, forma2).subscribe(res => {
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
              this.tar_deb = res.lstDetallePagos[0].valor!;

              this.httpService.obtenerDetallePagoAlm(almacen, forma3).subscribe(res => {
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
                  this.tar_cre = res.lstDetallePagos[0].valor!;
                  this.calcularSumaTotal();
                }
              });
            }
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
    localStorage.setItem('fechadesde', fechaDesde);
    localStorage.setItem('fechahasta', fechaHasta);
    const almacen = this.filtroForm.get('almacen')?.value!;
    const forma1 = '1';
    const forma2 = '2';
    const forma3 = '3';
    const sociedadid = localStorage.getItem('sociedadid');

    if(almacen == '0'){
      this.httpService.obtenerDetallePagoF(sociedadid!, forma1, fechaDesde, fechaHasta).subscribe(res => {
        if (res.codigoError != "OK") {
          this.filtroForm.get('almacen')?.enable();
          Swal.fire({
            icon: 'error',
            title: 'No se pudo obtener movimientos.',
            text: res.descripcionError,
            showConfirmButton: false,
          });
        } else {
          this.efectivo = res.lstDetallePagos[0].valor;
          this.httpService.obtenerDetallePagoF(sociedadid!, forma2, fechaDesde, fechaHasta).subscribe(res => {
            if (res.codigoError != "OK") {
              this.filtroForm.get('almacen')?.enable();
              Swal.fire({
                icon: 'error',
                title: 'No se pudo obtener movimientos.',
                text: res.descripcionError,
                showConfirmButton: false,
              });
            } else {
              this.tar_deb = res.lstDetallePagos[0].valor;
              this.httpService.obtenerDetallePagoF(sociedadid!, forma3, fechaDesde, fechaHasta).subscribe(res => {
                if (res.codigoError != "OK") {
                  this.filtroForm.get('almacen')?.enable();
                  Swal.fire({
                    icon: 'error',
                    title: 'No se pudo obtener movimientos.',
                    text: res.descripcionError,
                    showConfirmButton: false,
                  });
                } else {
                  this.tar_cre = res.lstDetallePagos[0].valor;
                  this.calcularSumaTotal();
                }
              });
            }
          });
        }
      }); 
    } else {
      this.httpService.obtenerDetallePagoAlmF(almacen, forma1, fechaDesde, fechaHasta).subscribe(res => {
        if (res.codigoError != "OK") {
          this.filtroForm.get('almacen')?.enable();
          Swal.fire({
            icon: 'error',
            title: 'No se pudo obtener movimientos.',
            text: res.descripcionError,
            showConfirmButton: false,
          });
        } else {
          this.efectivo = res.lstDetallePagos[0].valor;
          this.httpService.obtenerDetallePagoAlmF(almacen, forma2, fechaDesde, fechaHasta).subscribe(res => {
            if (res.codigoError != "OK") {
              this.filtroForm.get('almacen')?.enable();
              Swal.fire({
                icon: 'error',
                title: 'No se pudo obtener movimientos.',
                text: res.descripcionError,
                showConfirmButton: false,
              });
            } else {
              this.tar_deb = res.lstDetallePagos[0].valor;
              this.httpService.obtenerDetallePagoAlmF(almacen, forma3, fechaDesde, fechaHasta).subscribe(res => {
                if (res.codigoError != "OK") {
                  this.filtroForm.get('almacen')?.enable();
                  Swal.fire({
                    icon: 'error',
                    title: 'No se pudo obtener movimientos.',
                    text: res.descripcionError,
                    showConfirmButton: false,
                  });
                } else {
                  this.tar_cre = res.lstDetallePagos[0].valor;
                  this.calcularSumaTotal();
                }
              });
            }
          });
        }
      });
    }
  }

  reiniciarFiltros() {
    this.filtroForm.get('fechaDesde')?.setValue(null);
    this.filtroForm.get('fechaHasta')?.setValue(null);
    this.filtroForm.get('almacen')?.setValue('0');
    this.filtroForm.get('fechaDesde')?.enable();
    this.filtroForm.get('fechaHasta')?.enable();
    this.filtroForm.get('almacen')?.enable();
    localStorage.setItem('nombrealmacen','')
    localStorage.setItem('fechadesde','')
    localStorage.setItem('fechahasta','')
    const almacen: AlmacenesEntity = {
      idAlmacen: '',
      sociedad_id: localStorage.getItem('sociedadid')!,
      nombresociedad: '',
      nombre_almacen: '',
      direccion: '',
      telefono: '',
      codigo: '',
      pto_emision: ''
    }
    this.httpService.obtenerDetallePagoE(almacen).subscribe(res => {
      if (res.codigoError != "OK") {
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error.',
          text: res.descripcionError,
          showConfirmButton: false,
        });
      } else {
        this.efectivo = res.lstDetallePagos[0].valorE!;
        this.httpService.obtenerDetallePagoTD(almacen).subscribe(res => {
          if (res.codigoError != "OK") {
            Swal.fire({
              icon: 'error',
              title: 'Ha ocurrido un error.',
              text: res.descripcionError,
              showConfirmButton: false,
            });
          } else {
            this.tar_deb = res.lstDetallePagos[0].valorTD!;
            this.httpService.obtenerDetallePagoTC(almacen).subscribe(res => {
              if (res.codigoError != "OK") {
                Swal.fire({
                  icon: 'error',
                  title: 'Ha ocurrido un error.',
                  text: res.descripcionError,
                  showConfirmButton: false,
                });
              } else {
                this.tar_cre = res.lstDetallePagos[0].valorTC!;
                this.calcularSumaTotal();
              }
            });
          }
        });
      }
    });
  }


  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

}
