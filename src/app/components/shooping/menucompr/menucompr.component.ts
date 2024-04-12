import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Subject, finalize } from 'rxjs';
import { faShoppingBag, faSave, faList, faTimes, faCartPlus, faEdit, faTrashAlt, faMoneyBillAlt, faCheck, faPlus } from '@fortawesome/free-solid-svg-icons';
import { DetallesMovimientoEntity } from 'src/app/models/detallesmovimiento';
import { DetallesmovimientoService } from 'src/app/services/detallesmovimiento.service';
import { CompraNuevoComponent } from '../compra-nuevo/compra-nuevo.component';
import '../../../../../src/disable-alerts';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MovimientosService } from 'src/app/services/movimientos.service';
import { MovimientosEntity } from 'src/app/models/movimientos';
import { ProveedoresEntity } from 'src/app/models/proveedores';
import { ProveedoresService } from 'src/app/services/proveedores.service';
import { SustentosTributariosService } from 'src/app/services/sustentos-tributarios.service';
import { SustentosTributariosEntity } from 'src/app/models/sustentos_tributarios';
import { DatePipe } from '@angular/common';
import { NuevoProductoComponent } from '../nuevo-producto/nuevo-producto.component';
import { AlmacenesEntity } from 'src/app/models/almacenes';
import { SociedadesEntity } from 'src/app/models/sociedades';
import { InventariosService } from 'src/app/services/inventarios.service';
import { InventariosEntity } from 'src/app/models/inventarios';
import { DataTableDirective } from 'angular-datatables';
import { DetalleImpuestosEntity } from 'src/app/models/detalle-impuestos';
import { DetalleImpuestosService } from 'src/app/services/detalle-impuestos.service';
import { ComprobanteComprasEntity } from 'src/app/models/comprobante_compras';
import { ComprobanteComprasService } from 'src/app/services/comprobante-compras.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-menucompr',
  templateUrl: './menucompr.component.html',
  styleUrls: ['./menucompr.component.css'],
  providers: [DatePipe]
})
export class MenucomprComponent implements OnInit {
  clienteForm = new FormGroup({
    tipo: new FormControl('0', Validators.required)
  });

  //Iconos para la pagina de grupos
  faList = faList;
  faTimes = faTimes;
  faCheck = faCheck;
  faSave = faSave;
  faPlus = faPlus;
  faCartPlus = faCartPlus;
  faEdit = faEdit;
  faTrashAlt = faTrashAlt;
  faMoneyBillAlt = faMoneyBillAlt;
  faShoppingBag = faShoppingBag;
  public buttonsDisabled = true;

  public proveedorSeleccionado = false;
  public sustentoSeleccionado = false;
  public comprobanteCompraSeleccionado = false;
  public comprobanteLleno = false;
  public autorizacionLlena = false;

  //Declaración de variables
  dtOptions: DataTables.Settings = {};
  private datatableElement!: DataTableDirective;
  dtTrigger: Subject<any> = new Subject<any>();
  lstDetalleMovimientos: DetallesMovimientoEntity[] = [];
  sumaTotal: any;
  detalleEditIndex: number = -1;
  detalleEditBackup: DetallesMovimientoEntity | null = null;
  formGroup: any;
  lstProveedores: ProveedoresEntity[] = [];
  lstProveedores2: ProveedoresEntity[] = [];
  lstSustentos: SustentosTributariosEntity[] = [];
  lstSustentos2: SustentosTributariosEntity[] = [];
  lstComprobantes: ComprobanteComprasEntity[] = [];
  lstComprobantes2: ComprobanteComprasEntity[] = [];
  editarDetalle: boolean = false;
  selectTipo: boolean = false;
  disableProveedor: boolean = false;
  autorizacion: string = '';
  comprobante: string = '';
  fechaSeleccionada: Date | null = null;
  fechaFormateada: any = '';

  iva=environment.iva

  constructor(private dialog: MatDialog,
    private readonly httpService: DetallesmovimientoService,
    private readonly httpServiceProv: ProveedoresService,
    private readonly httpServiceMov: MovimientosService,
    private readonly httpServiceSus: SustentosTributariosService,
    private readonly httpServiceInv: InventariosService,
    private readonly httpServiceDet: DetalleImpuestosService,
    private readonly httpServiceComprobante: ComprobanteComprasService,
    private datePipe: DatePipe,
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
      info: false,
      responsive: true,
    }
    this.fechaSeleccionada = new Date();
    const sociedad: SociedadesEntity = {
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
    this.httpServiceProv.obtenerProveedoresS(sociedad).subscribe(res => {
      if (res.codigoError != "OK") {
        Swal.fire({
          icon: 'error',
          title: 'No se pudo obtener proveedores.',
          text: res.descripcionError,
          showConfirmButton: false,
        });
      } else {
        this.lstProveedores = res.lstProveedores;
      }
    });

    this.httpServiceComprobante.obtenerComprobantes().subscribe(res => {
      if (res.codigoError != "OK") {
        Swal.fire({
          icon: 'error',
          title: 'No se pudo obtener comprobantes.',
          text: res.descripcionError,
          showConfirmButton: false,
        });
      } else {
        this.lstComprobantes = res.lstComprobantes;
      }
    });

    this.cargarTablaMenucompr();
    this.checkRegistros();
  }

  checkRegistros() {
    this.disableProveedor = this.lstDetalleMovimientos.length > 0;
  }

  changeGroup(tipoC: any): void {
    this.proveedorSeleccionado = tipoC.target.value !== "0";
    this.buttonsDisabled = !this.checkAllConditions();
    if (tipoC.target.value == 0) {
      this.selectTipo = true;
      localStorage.setItem('proveedorid', '0')
      localStorage.setItem('proveedor', '')
    } else {
      this.selectTipo = false;

    }
    const proveedores: ProveedoresEntity = {
      id: '',
      id_fiscal: '',
      ciudadid: '',
      correo: '',
      direccionprov: '',
      nombre: tipoC.target.value,
      telefono: ''
    }

    this.httpServiceProv.obtenerProveedoresN(proveedores).subscribe(res => {
      if (res.codigoError != "OK") {
        Swal.fire({
          icon: 'error',
          title: 'No se pudo obtener la Sociedad.',
          text: res.descripcionError,
          showConfirmButton: false,
        });
      } else {
        localStorage.setItem('proveedorid', res.lstProveedores[0].id);
        localStorage.setItem('proveedor', tipoC.target.options[tipoC.target.selectedIndex].text);
      }
    })
  }

  changeGroup2(sustento: any): void {
    this.sustentoSeleccionado = sustento.target.value !== "0";
    this.buttonsDisabled = !this.checkAllConditions();
    if (sustento.target.value == 0) {
      localStorage.setItem('sustentoid', '0')
    } else {

    }
    const sustentos: SustentosTributariosEntity = {
      id: '',
      etiquetas: '',
      codigo: '',
      sustento: sustento.target.value,
    }

    this.httpServiceSus.obtenerSustentosN(sustentos).subscribe(res => {
      if (res.codigoError != "OK") {
        Swal.fire({
          icon: 'error',
          title: 'No se pudo obtener el sustento',
          text: res.descripcionError,
          showConfirmButton: false,
        });
      } else {
        localStorage.setItem('sustentoid', res.lstSustentos[0].id);
      }
    })
  }

  changeGroup3(comprobanteCompra: any): void {
    this.comprobanteCompraSeleccionado = comprobanteCompra.target.value !== "0";
    this.buttonsDisabled = !this.checkAllConditions();
    if (comprobanteCompra.target.value == 0) {
      localStorage.setItem('comprobanteCompraid', '0')
    } else {

    }
    const comprobanteCompras: ComprobanteComprasEntity = {
      id: '',
      tipo: comprobanteCompra.target.value,
      codigo: ''
    }

    this.httpServiceComprobante.obtenerComprobantesN(comprobanteCompras).subscribe(res => {
      if (res.codigoError != "OK") {
        Swal.fire({
          icon: 'error',
          title: 'No se pudo obtener el comprobante',
          text: res.descripcionError,
          showConfirmButton: false,
        });
      } else {
        localStorage.setItem('comprobanteCompraid', res.lstComprobantes[0].id);
        const sustento: SustentosTributariosEntity = {
          id: '',
          etiquetas: '',
          codigo: '',
          sustento: '',
          comprobante_id: res.lstComprobantes[0].id,
        }
        this.httpServiceSus.obtenerSustentosComp(sustento).subscribe(res1 => {
          if (res1.codigoError != "OK") {
            this.lstSustentos = [];
            Swal.fire({
              icon: 'error',
              title: 'No se pudo obtener sustentos.',
              text: res1.descripcionError,
              showConfirmButton: false,
            });
          } else {
            this.lstSustentos = res1.lstSustentos;
          }
        });
        
      }
    })
  }


  verCarrito() {
    const dialogRef = this.dialog.open(CompraNuevoComponent, {
      width: '1900px',
      height: '600px'
      // Agrega cualquier configuración adicional del modal aquí
    });

    dialogRef.componentInstance.productoAgregado.subscribe((proveedorProducto: any) => {
      // Actualizar la tabla
      this.cargarTablaMenucompr();
      this.checkRegistros();
    });

    dialogRef.afterClosed().subscribe(result => {
      // Lógica para manejar el resultado después de cerrar el modal
    });
  }

  nuevoProducto() {
    const dialogRef = this.dialog.open(NuevoProductoComponent, {
      width: '900px',
      height: '600px'
      // Agrega cualquier configuración adicional del modal aquí
    });

    dialogRef.afterClosed().subscribe(result => {
      // Lógica para manejar el resultado después de cerrar el modal
    });
  }

  cargarTablaMenucompr() {
    const newDetalle: DetallesMovimientoEntity = {
      id: '',
      producto_nombre: '',
      inventario_id: '',
      producto_id: '',
      movimiento_id: localStorage.getItem('movimiento_id')!,
      cantidad: '',
      costo: '',
      precio: ''
    }

    this.httpService.obtenerDetalleMovimiento(newDetalle).subscribe(res => {
      if (res.codigoError != "OK") {
        Swal.fire({
          icon: 'info',
          title: 'Información',
          text: 'Empieza tu pedido en "AÑADIR".',
          showConfirmButton: true,
          // timer: 3000
        });
      } else {
        this.lstDetalleMovimientos = res.lstDetalleMovimientos;
        this.disableProveedor = this.lstDetalleMovimientos.length > 0;
        this.dtTrigger.next('');
        this.calcularSumaTotal();
        Swal.close();
      }
    });

  }


  calcularSumaTotal() {
    const totalTarifa15 = this.calcularTotalTarifa15();
    const totalTarifa0 = this.calcularTotalTarifa0();

    const suma = totalTarifa15 + totalTarifa0;

    this.sumaTotal = suma
      .toLocaleString(undefined, { maximumFractionDigits: 2 })
      .replace('.', ',');
  }

  calcularTotalTarifa0(): number {
    const totalTarifa0 = this.lstDetalleMovimientos
      .filter((detalleMovimientos) => detalleMovimientos.tarifa === '0%')
      .reduce((total, detalleMovimientos) => {
        return total + parseFloat(detalleMovimientos.precio.replace(',', '.'));
      }, 0);

    return totalTarifa0;
  }

  calcularSubtotal(): number {
    const subtotal = this.lstDetalleMovimientos
      .filter((detalleMovimientos) => detalleMovimientos.tarifa)
      .reduce((total, detalleMovimientos) => {
        return total + parseFloat(detalleMovimientos.precio.replace(',', '.'));
      }, 0);

    return subtotal;
  }

  calcularTotalTarifa15(): number {
    const totalTarifa15 = this.lstDetalleMovimientos
      .filter((detalleMovimientos) => detalleMovimientos.tarifa === this.iva+'%')
      .reduce((total, detalleMovimientos) => {
        return total + parseFloat(detalleMovimientos.precio.replace(',', '.'));
      }, 0);
    const porcen = totalTarifa15 * (this.iva/100);

    return totalTarifa15 + porcen;
  }

  calcularTotalTarifa15P(): number {
    const totalTarifa15 = this.lstDetalleMovimientos
      .filter((detalleMovimientos) => detalleMovimientos.tarifa === this.iva+'%')
      .reduce((total, detalleMovimientos) => {
        return total + parseFloat(detalleMovimientos.precio.replace(',', '.'));
      }, 0);

    return totalTarifa15;
  }

  calcularIva15(): number {
    const totalTarifa15 = this.lstDetalleMovimientos
      .filter((detalleMovimientos) => detalleMovimientos.tarifa === this.iva+'%')
      .reduce((total, detalleMovimientos) => {
        return total + parseFloat(detalleMovimientos.precio.replace(',', '.'));
      }, 0);
    const porcen = totalTarifa15 * (this.iva/100);

    return porcen;
  }

  eliminarDetalle(detalle: DetallesMovimientoEntity): void {
    Swal.fire({
      icon: 'question',
      title: `¿Esta seguro de eliminar ${detalle.producto_nombre}?`,
      showDenyButton: true,
      confirmButtonText: 'Si',
      denyButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.httpService.eliminarDetalleCompra(detalle).subscribe(res => {
          if (res.codigoError == 'OK') {
            Swal.fire({
              icon: 'success',
              title: 'Eliminado Exitosamente.',
              text: `Se ha eliminado el producto ${detalle.producto_nombre}`,
              showConfirmButton: true,
              confirmButtonText: "Ok"
            }).then(() => {
              const newDetalle: DetallesMovimientoEntity = {
                id: '',
                producto_nombre: '',
                inventario_id: '',
                producto_id: '',
                movimiento_id: localStorage.getItem('movimiento_id')!,
                cantidad: '',
                costo: '',
                precio: ''
              }
              this.httpService.obtenerDetalleMovimiento(newDetalle).subscribe(res => {
                if (res.codigoError != "OK") {
                  window.location.reload();
                  Swal.fire({
                    icon: 'info',
                    title: 'Información',
                    text: 'Empieza tu pedido en "AÑADIR".',
                    showConfirmButton: true,
                    // timer: 3000
                  });
                } else {
                  this.lstDetalleMovimientos = res.lstDetalleMovimientos;
                  this.disableProveedor = this.lstDetalleMovimientos.length > 0;
                  // this.groupForm.reset();
                  this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
                    // Destruye la tabla existente y elimina los datos
                    dtInstance.destroy();

                    // Renderiza la tabla con los nuevos datos
                    this.dtTrigger.next('');

                    // Opcional: Reinicia la página a la primera página
                    dtInstance.page('first').draw('page');
                  });
                  this.calcularSumaTotal();
                }
              });
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Ha ocurrido un error.',
              text: res.descripcionError,
              showConfirmButton: false,
            });
          }
        })
      }
    })
  }

  editarDetalleMovimiento(index: number): void {
    this.detalleEditIndex = index;
    this.detalleEditBackup = { ...this.lstDetalleMovimientos[index] };
    this.editarDetalle = true;
  }

  aplicarCambiosDetalle(index: number): void {
    //this.guardarDetalleMovimiento();
    if (this.detalleEditIndex >= 0 && this.detalleEditBackup) {
      // Realizar lógica de guardado o actualización del detalle en el servicio
      this.httpService.modificarDetalleCompra(this.lstDetalleMovimientos[this.detalleEditIndex]).subscribe(res => {
        if (res.codigoError == 'OK') {
          Swal.fire({
            icon: 'success',
            title: 'Guardado Exitosamente.',
            text: `Se han guardado los cambios del detalle`,
            showConfirmButton: true,
            confirmButtonText: "Ok"
          }).then(() => {
            this.editarDetalle = false;
            this.detalleEditIndex = -1;
            this.detalleEditBackup = null;
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Ha ocurrido un error.',
            text: res.descripcionError,
            showConfirmButton: false,
          });
        }
      });
    }
  }

  calcularPrecio(index: number): void {
    const detalleMovimientos = this.lstDetalleMovimientos[index];
    const cantidad = parseFloat(detalleMovimientos.cantidad);
    const costo = parseFloat(detalleMovimientos.costo);

    if (!isNaN(cantidad) && !isNaN(costo)) {
      detalleMovimientos.precio = (cantidad * costo).toFixed(2);
    } else {
      detalleMovimientos.precio = '';
    }

    this.calcularSumaTotal();
  }

  onInput(event: any) {
    const inputValue = event.target.value;
    event.target.value = inputValue.replace(/[^0-9]/g, ''); // Filtra solo números
  }

  onInputComprobante(event: any) {
    this.comprobanteLleno = event.target.value.trim() !== "";
    this.buttonsDisabled = !this.checkAllConditions();
  }

  onInputAutorizacion(event: any) {
    this.autorizacionLlena = event.target.value.trim() !== "";
    this.buttonsDisabled = !this.checkAllConditions();
  }

  keyPressNumbers(event: any) {
    var charCode = (event.which) ? event.which : event.keyCode;
    // Only Numbers 0-9
    if ((charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }

  // Función para verificar si se cumplen todas las condiciones
  checkAllConditions(): boolean {
    return (
      this.proveedorSeleccionado &&
      this.sustentoSeleccionado &&
      this.comprobanteLleno &&
      this.autorizacionLlena
    );
  }

  onInput2(event: any) {
    const inputValue = event.target.value;
    this.autorizacionLlena = event.target.value.trim() !== "";
    event.target.value = inputValue.replace(/[^0-9.]/g, ''); // Filtra solo números y punto
  }

  finalizarPedido() {
    this.fechaFormateada = this.datePipe.transform(this.fechaSeleccionada, 'yyyy-MM-dd');
    localStorage.setItem('compventa', this.comprobante);
    localStorage.setItem('autorizacion', this.autorizacion);
    Swal.fire({
      title: '¿Deseas continuar?',
      showDenyButton: true,
      confirmButtonText: 'SÍ',
      denyButtonText: `NO`,
    }).then((result) => {
      const newMov: MovimientosEntity = {
        id: localStorage.getItem('movimiento_id')!,
        tipo_id: '',
        tipo_emision_cod: '',
        estado_fact_id: '',
        tipo_comprb_id: '',
        almacen_id: '',
        cod_doc: '',
        secuencial: '',
        proveedor_id: localStorage.getItem('proveedorid')!,
        autorizacion_venta: this.autorizacion,
        comp_venta: this.comprobante,
        fecha_emision: this.fechaFormateada,
        sustento_id: localStorage.getItem('sustentoid')!,
        comprobante_compra_id: localStorage.getItem('comprobanteCompraid')!
      }
      if (result.isConfirmed) {
        for (let i = 0; i < this.lstDetalleMovimientos.length; i++) {
          const detalleMovimiento = this.lstDetalleMovimientos[i];
          if (detalleMovimiento) {
            const newDetalleImp: DetalleImpuestosEntity = {
              id: '',
              detalle_movimiento_id: detalleMovimiento.id ?? '',
              cod_impuesto: '',
              porcentaje: detalleMovimiento.tarifa ?? '',
              base_imponible: '',
              valor: '',
              movimiento_id: detalleMovimiento.movimiento_id ?? '',
              created_at: '',
              updated_at: ''
            };
            this.httpServiceDet.obtenerDetalleImpuesto(newDetalleImp).subscribe(res => {
              if (res.codigoError == 'OK') {
                if (res.lstDetalleImpuestos[0].porcentaje == this.iva+'%') {
                  const newDetalleImp2: DetalleImpuestosEntity = {
                    id: '',
                    detalle_movimiento_id: detalleMovimiento.id ?? '',
                    cod_impuesto: '',
                    porcentaje: detalleMovimiento.tarifa ?? '',
                    base_imponible: '',
                    valor: (parseFloat(res.lstDetalleImpuestos[0].base_imponible) * (this.iva/100)).toString(),
                    movimiento_id: detalleMovimiento.movimiento_id ?? '',
                    created_at: '',
                    updated_at: ''
                  };
                  this.httpServiceDet.modificarMovimientoBP(newDetalleImp).subscribe(resp => {
                    if (resp.codigoError == 'OK') {
                      console.log('Actualizado BP GENERAL')
                    } else {
                      console.log('ERROR')
                    }
                  });
                  this.httpServiceDet.modificarDetalleImpuestosBP(newDetalleImp2).pipe(
                    finalize(() => {
                      this.httpServiceDet.obtenerDetalleImpuesto(newDetalleImp).subscribe(res3 => {
                        if (res3.codigoError == 'OK') {
                          const newDetalleImp3: DetalleImpuestosEntity = {
                            id: '',
                            detalle_movimiento_id: detalleMovimiento.id ?? '',
                            cod_impuesto: '',
                            porcentaje: detalleMovimiento.tarifa ?? '',
                            base_imponible: '',
                            valor: (parseFloat(res3.lstDetalleImpuestos[0].base_imponible) * (this.iva/100)).toString(),
                            movimiento_id: detalleMovimiento.movimiento_id ?? '',
                            created_at: '',
                            updated_at: ''
                          };
                          this.httpServiceDet.modificarDetalleImpuestosVal(newDetalleImp3).subscribe(res2 => {
                            if (res2.codigoError == 'OK') {
                              console.log('Actualizado')
                            } else {
                              console.log('ERROR')
                            }
                          });
                        }
                      })
                    })
                  ).subscribe(res1 => {
                    if (res1.codigoError == 'OK') {
                      
                    } else {
                      console.log('ERROR')
                    }
                  });
                } else {
                  const newDetalleImp2: DetalleImpuestosEntity = {
                    id: '',
                    detalle_movimiento_id: detalleMovimiento.id ?? '',
                    cod_impuesto: '',
                    porcentaje: detalleMovimiento.tarifa ?? '',
                    base_imponible: '',
                    valor: (parseFloat(res.lstDetalleImpuestos[0].base_imponible) * 0).toString(),
                    movimiento_id: detalleMovimiento.movimiento_id ?? '',
                    created_at: '',
                    updated_at: ''
                  };
                  this.httpServiceDet.modificarMovimientoBP(newDetalleImp).subscribe(resp => {
                    if (resp.codigoError == 'OK') {
                      console.log('Actualizado BP GENERAL')
                    } else {
                      console.log('ERROR')
                    }
                  });
                  this.httpServiceDet.modificarDetalleImpuestosBP(newDetalleImp2).pipe(
                    finalize(() => {
                      this.httpServiceDet.obtenerDetalleImpuesto(newDetalleImp).subscribe(res3 => {
                        if (res3.codigoError == 'OK') {
                          const newDetalleImp3: DetalleImpuestosEntity = {
                            id: '',
                            detalle_movimiento_id: detalleMovimiento.id ?? '',
                            cod_impuesto: '',
                            porcentaje: detalleMovimiento.tarifa ?? '',
                            base_imponible: '',
                            valor: (parseFloat(res3.lstDetalleImpuestos[0].base_imponible) * (this.iva/100)).toString(),
                            movimiento_id: detalleMovimiento.movimiento_id ?? '',
                            created_at: '',
                            updated_at: ''
                          };
                          this.httpServiceDet.modificarDetalleImpuestosVal(newDetalleImp3).subscribe(res2 => {
                            if (res2.codigoError == 'OK') {
                              console.log('Actualizado')
                            } else {
                              console.log('ERROR')
                            }
                          });
                        }
                      })
                    })
                  ).subscribe(res1 => {
                    if (res1.codigoError == 'OK') {

                    } else {
                      console.log('ERROR')
                    }
                  });
                }
              } else {
                console.log('ERROR')
              }
            });
          }
        }
        this.httpServiceMov.finalizarCompra(newMov).subscribe(res => {
          Swal.fire({
            icon: 'success',
            title: 'Finalizado Correctamente.',
            text: `Se ha finalizado la compra`,
            showConfirmButton: true,
            confirmButtonText: "Ok"
          }).finally(() => {
            // this.groupForm.reset();
            this.router.navigate(['/navegation-cl', { outlets: { 'contentClient': ['ver-compra'] } }]);
          });
        });
      } else if (result.isDenied) {
        Swal.fire('No se finalizó la compra', '', 'info')
      }
    });
  }


  crearProveedor() {
    this.router.navigate(['/navegation-cl', { outlets: { 'contentClient': ['nuevo-proveedor'] } }]);
  }

}

