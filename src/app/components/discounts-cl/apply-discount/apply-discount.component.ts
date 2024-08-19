import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DetallesMovimientoEntity } from 'src/app/models/detallesmovimiento';
import { DetallesmovimientoService } from 'src/app/services/detallesmovimiento.service';
import { MovimientosService } from 'src/app/services/movimientos.service';
import { MovimientosEntity } from 'src/app/models/movimientos';
import { SociedadesService } from 'src/app/services/sociedades.service';
import { faShoppingCart, faEdit, faTrashAlt, faMoneyBillAlt, faFileInvoice, faCheck, faSave } from '@fortawesome/free-solid-svg-icons';
import { Subject, finalize } from 'rxjs';
import Swal from 'sweetalert2';
import { DetalleImpuestosEntity } from 'src/app/models/detalle-impuestos';

import { SociedadesEntity } from 'src/app/models/sociedades';
import { FormasPagoSociedadEntity } from 'src/app/models/formas-pago-sociedad';
import { TercerosService } from 'src/app/services/terceros.service';
import { TercerosEntity } from 'src/app/models/terceros';
import { FormasPagoService } from 'src/app/services/formas-pago.service';
import { FormasPagoEntity } from 'src/app/models/formas-pago';
import { DetallesPagoEntity } from 'src/app/models/detalles-pago';
import { DetallesPagoService } from 'src/app/services/detalles-pago.service';
import { AlmacenesEntity } from 'src/app/models/almacenes';
import { AlmacenesService } from 'src/app/services/almacenes.service';
import { SriwsService } from 'src/app/services/sriws.service';
import { DataTableDirective } from 'angular-datatables';
import { environment } from 'src/environments/environment.prod';
import { FormasPagoServiceSociedad } from 'src/app/services/formaspagosociedad.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { parse } from 'path';
import { DetalleImpuestosService } from 'src/app/services/detalle-impuestos.service';
import { MenuventComponent } from '../../all_components';
import { DescuentosEntity } from 'src/app/models/descuentos';
import { DescuentosService } from 'src/app/services/descuentos.service';

@Component({
  selector: 'app-apply-discount',
  templateUrl: './apply-discount.component.html',
  styleUrls: ['./apply-discount.component.css']
})
export class ApplyDiscountComponent implements OnInit {



  //Declaración de variables
  dtOptions: DataTables.Settings = {};
  dtOptions2: DataTables.Settings = {};
  faEdit = faEdit;
  faCheck = faCheck;
  faSave = faSave;
  faShoppingCart = faShoppingCart;
  faTrashAlt = faTrashAlt;
  faMoneyBillAlt = faMoneyBillAlt;
  dtTrigger: Subject<any> = new Subject<any>();
  dtTrigger2: Subject<any> = new Subject<any>();
  lstDescuentos: DescuentosEntity[] = [];
  lstDetalleMovimientos: DetallesMovimientoEntity[] = [];
  lstFormasPago: FormasPagoEntity[] = [];
  lstFormasPago2: FormasPagoEntity[] = [];
  sumaTotal: any;
  isBotonHabilitado = false;
  resto: any;
  nombreSoc: string = '';
  idFiscalSoc: string = '';
  numFactura: string = '';
  fechaEmision: string = '';
  direccionAlm: string = '';
  telefonoAlm: string = '';
  cliente: string = '';
  idFiscalCliente: string = '';
  email: string = '';
  telefono: string = '';
  ultSecuencial: any = '';
  secuencial: any;
  inputColor: string = '';
  private datatableElement!: DataTableDirective;
  esRestoCero: boolean = false;
  descuentoN: number = 0;
  descuentoP: number = 0;
  totalF: number = 0;
  deshabilitarIn = false;
  editarDetalle: boolean = false;
  detalleEditIndex: number = -1;
  detalleEditBackup: DetallesPagoEntity | null = null;
  valorAnterior: string = '';
  lstFormasPagoSociedad: FormasPagoSociedadEntity[] = [];
  lstFormasPagoAux: FormasPagoEntity[] = [];
  documento: string = '';

  iva=environment.iva;
  
  constructor(private readonly httpService: DetallesmovimientoService,
    private readonly httpServiceMovimiento: MovimientosService,
    private readonly httpServiceSociedad: SociedadesService,
    private readonly httpServiceSRI: SriwsService,
    private dialogRef: MatDialogRef<MenuventComponent>,
    private readonly httpServiceDetallePago: DetallesPagoService,
    private readonly httpServiceAlmacen: AlmacenesService,
    private readonly httpServiceTercero: TercerosService,
    private readonly httpServiceForma: FormasPagoService,
    private readonly httpServiceFormaSociedad: FormasPagoServiceSociedad,
    private readonly httpServiceDet: DetalleImpuestosService,
    private readonly httpServiceDescuento: DescuentosService,
    @Inject(MAT_DIALOG_DATA) public data: any, // Aquí se inyectan los datos

    private router: Router) { }

  ngOnInit(): void {

    this.dtOptions = {
      language: {
        url: "//cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json"
      },
      paging: false,
      search: false,
      searching: false,
      ordering: false,
      info: false,
      responsive: true
    }
    this.dtOptions2 = {
      language: {
        url: "//cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json"
      },
      paging: false,
      search: false,
      searching: false,
      ordering: false,
      info: false,
      responsive: true
    }

    //Crear movimiento con el id del movimiento
    const newMovimiento: MovimientosEntity = {
      id: localStorage.getItem('movimiento_id')!,
      tipo_id: '',
      tipo_emision_cod: '',
      estado_fact_id: '',
      tipo_comprb_id: '',
      almacen_id: '',
      cod_doc: '',
      secuencial: ''
    }


    this, this.httpServiceDescuento.obtenerDescuentosAplicados(newMovimiento).subscribe(res => {
      if (res.codigoError != "OK") {
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error.',
          text: res.descripcionError,
          showConfirmButton: false,
        });

        console.log('ERROR AL OBTENER DESCUENTOS APLICADOS')
      } else {
        this.lstDescuentos = res.lstDescuentos;
        
        //Insertar en el input todos los que tengan en tipo 1 que es monto y sumar el total
        this.lstDescuentos.forEach((descuento) => {
          if (descuento.tipoDescuento == '1') {
            this.descuentoN += parseFloat(descuento.valorDescuento);
          } else {
            this.descuentoP += parseFloat(descuento.valorDescuento);
          }
        });

        console.log("ACA LSITAAAA===================="+this.lstDescuentos)

        this.datatableElement.dtInstance.then((dtInstance2: DataTables.Api) => {
          // Destruye la tabla existente y elimina los datos
          dtInstance2.destroy();

          // Renderiza la tabla con los nuevos datos
          this.dtTrigger2.next('');

          // Opcional: Reinicia la página a la primera página
          dtInstance2.page('first').draw('page');
        });
      }
    })

  }


  //Cuando se cierre y no se a guardado los pagos se eliminan
  // ngOnDestroy(): void {
  //   this.dtTrigger.unsubscribe();
  //   this.dtTrigger2.unsubscribe();

  //   if (this.lstDetallePagos.length > 0) {
  //     this.lstDetallePagos.forEach((detalle) => {
  //       this.httpServiceDetallePago.eliminarDetallePago(detalle).subscribe((res) => {
  //         if (res.codigoError == 'OK') {
  //           console.log('Eliminado')
  //         } else {
  //           console.log('ERROR')
  //         }
  //       });
  //     });
  //   }

  // }

  actualizarColor() {
    const restoNumerico = parseFloat(this.resto); // Convertir a número

    if (restoNumerico === 0.00) {
      this.inputColor = '#9EF291';
      this.esRestoCero = true;
    } else {
      this.inputColor = '#F9ED95';
      this.esRestoCero = false;
    }
  }


  changePago(event: any): void {
    const seleccionado = event.target.value;
    this.isBotonHabilitado = seleccionado !== "0";
    const newPago: FormasPagoEntity = {
      id: '',
      nombre: event.target.value,
      codigo: '',
      fecha_inicio: '',
      fecha_fin: '',
      created_at: '',
      updated_at: ''
    }

    this.httpServiceForma.obtenerFormasPagoN(newPago).subscribe(res => {
      if (res.codigoError != 'OK') {
      } else {
        this.lstFormasPago2 = res.lstFormasPago;
      }
    })
  }

  
  abonar() {
    
    if (this.documento !== 'd') {
      //Imprimir lo que esta dentro del if}

      console.log('Restoooo este eeees: ' + this.documento);

      // this.actualizarColor();
      
      const descuentoDetalle: DescuentosEntity = {
        id: '',
        //Agianar el valor de documento en codigo descuento
        codigoDescuento: this.documento,
        usoMaximo: '',
        valorDescuento: '',
        fecha_inicio: '',
        fecha_fin: '',
        tipoDescuento: '',
        sociedad: localStorage.getItem('sociedadid')!,
        estado: '',
        movimiento_id: localStorage.getItem('movimiento_id')!
      }


      this.httpServiceDescuento.aplicarDescuento(descuentoDetalle).subscribe(res => {
        if (res.codigoError == 'OK') {
 
          this.deshabilitarIn = true;
          const newMovimiento: MovimientosEntity = {
            id: localStorage.getItem('movimiento_id')!,
            tipo_id: '',
            tipo_emision_cod: '',
            estado_fact_id: '',
            tipo_comprb_id: '',
            almacen_id: '',
            cod_doc: '',
            secuencial: ''
          }

          this, this.httpServiceDescuento.obtenerDescuentosAplicados(newMovimiento).subscribe(res => {
            if (res.codigoError != "OK") {
  
            } else {
  

              //sI es mayor que la data.total entonces no se puede abonar y se elimina

              //Calcular el total de descuentos y ver si es mayot que la data.total

              let totalDescuentos = 0;

              res.lstDescuentos.forEach((descuento) => {
                if (descuento.tipoDescuento == '2') {
                  totalDescuentos += parseFloat(descuento.valorDescuento);
                }
              });


              this.lstDescuentos = res.lstDescuentos;

              console.log('TOTAL DESCUENTOS ===???????: ' + totalDescuentos);

              //Verificar si es mayor que el total

              if (totalDescuentos > parseFloat(this.data.total)) {
                Swal.fire({
                  icon: 'warning',
                  title: 'Ha ocurrido un error.',
                  text: 'El descuento excede el total',
                  showConfirmButton: false,
                });

                //Eliminar el descuento
                this.httpServiceDescuento.eliminarDescuento(descuentoDetalle).subscribe(res => {
                  if (res.codigoError == 'OK') {
                    console.log('Eliminado')
                  } else {
                    console.log('ERROR')
                  }
                });


                //ELIMINAR EL VALOR DEL INPUT
                this.documento = '';


                //Actualizar la tabla
                


                this.httpServiceDescuento.updateDescuentos(res.lstDescuentos);

                this.datatableElement.dtInstance.then((dtInstance2: DataTables.Api) => {
                  // Destruye la tabla existente y elimina los datos
                  dtInstance2.destroy();
      
                  // Renderiza la tabla con los nuevos datos
                  this.dtTrigger2.next('');
      
                  // Opcional: Reinicia la página a la primera página
                  dtInstance2.page('first').draw('page');
                });


                //Recargar
                window.location.reload();

                return;
              }

              this.lstDescuentos = res.lstDescuentos;

              //Calcular el total de descuentos
            
              this.httpServiceDescuento.updateDescuentos(res.lstDescuentos);

              this.datatableElement.dtInstance.then((dtInstance2: DataTables.Api) => {
                // Destruye la tabla existente y elimina los datos
                dtInstance2.destroy();
    
                // Renderiza la tabla con los nuevos datos
                this.dtTrigger2.next('');
    
                // Opcional: Reinicia la página a la primera página
                dtInstance2.page('first').draw('page');

                window.location.reload();

              });
            }
          })
          
        } else {
          console.log('ERROR')
        }
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Ha ocurrido un error.',
        text: 'Estás abonando más del resto o has abonado el total',
        showConfirmButton: false,
      });
    }
  }

  descargarInventario() {
    //Si el numero de factura esta vacio
    if (this.documento == '') {
      Swal.fire({
        icon: 'error',
        title: 'Ha ocurrido un error.',
        text: 'El número de factura no puede estar vacío',
        showConfirmButton: false,
      });
      return;
    }



    //1. Comprobar si ya esta abonado

    if (parseFloat(this.resto) > 0) {
      Swal.fire({
        icon: 'error',
        title: 'Ha ocurrido un error.',
        text: 'Aún no has abonado el total',
        showConfirmButton: false,
      });
      return;
    }

    //1. Recorrer la lista de detalles movimientos (no se tiene asi que se puede obtener del padre)

    //2. Crear el detalleImpuesto

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
            if (res.lstDetalleImpuestos[0].porcentaje == this.iva + '%') {
              const newDetalleImp2: DetalleImpuestosEntity = {
                id: '',
                detalle_movimiento_id: detalleMovimiento.id ?? '',
                cod_impuesto: '',
                porcentaje: detalleMovimiento.tarifa ?? '',
                base_imponible: '',
                valor: (parseFloat(res.lstDetalleImpuestos[0].base_imponible) * (this.iva / 100)).toString(),
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
                        valor: (parseFloat(res3.lstDetalleImpuestos[0].base_imponible) * (this.iva / 100)).toString(),
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
                        valor: (parseFloat(res3.lstDetalleImpuestos[0].base_imponible) * (this.iva / 100)).toString(),
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



    //6. Finalizar pedido

    const total_si = this.calcularSubtotal();
    const total_imp = this.calcularTotalTarifa15() + this.calcularTotalTarifa0();

    
    this.httpServiceMovimiento.obtenerUltimoSecuencial(localStorage.getItem('almacenid')!).subscribe(res1 => {
      if (res1.codigoError == 'OK') {
        this.ultSecuencial = res1.lstMovimientos[0].secuencial;
        const numero = parseInt(this.ultSecuencial, 10)
        const num2 = numero + 1;
        this.secuencial = num2.toString().padStart(9, '0');
   
    const newPedido: MovimientosEntity = {
      id: JSON.parse(localStorage.getItem('movimiento_id') || "[]"),
      tipo_id: '',
      tipo_emision_cod: '',
      estado_fact_id: '1',
      tipo_comprb_id: '',
      almacen_id: '',
      total_si: total_si.toString(),
      total_imp: total_imp.toString(),
      total_desc: '',
      cod_doc: '',
      secuencial: this.secuencial,
      estab: localStorage.getItem('estab')!,
      importe_total: this.sumaTotal.replace(',', '.'),
      url_factura: this.documento,
    }

    this.httpServiceMovimiento.finalizarPedidoFisico(newPedido).subscribe(res => {
      if (res.codigoError == 'OK') {
        Swal.fire({
          icon: 'success',
          title: 'Pedido finalizado.',
          text: 'Se ha finalizado el pedido correctamente',
          showConfirmButton: true,
        }).then(() => {
          this.dialogRef.close();
          localStorage.removeItem('totalDescargar');
          localStorage.removeItem('movimiento_id');
          localStorage.removeItem('sociedadid');
          localStorage.removeItem('idfiscalCl');
          localStorage.removeItem('almacenid');
          localStorage.removeItem('estab');
          localStorage.removeItem('movimiento_id');
          this.router.navigate(['/menuvent']);
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error.',
          text: res.descripcionError,
          showConfirmButton: false,
        });
      }
    }
  )
  }});


   
  }


  }

  closeModal() {
    //Cerrar modal
    this.dialogRef.close();
   
  }

    
  //Controlar que lo que ingrese en el input sea solo numeros caso contrario no escribir
  onKeyPress(event: any) {
    const pattern = /[0-9]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  //Controlar que lo que ingrese en el input sea solo numeros o punto o coma caso contrario no escribir
  onKeyPressFloat(event: any) {
    const pattern = /[0-9.,]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }



  calcularSubtotal(): number {
    const subtotal = this.lstDetalleMovimientos
      .filter((detalleMovimientos) => detalleMovimientos.tarifa)
      .reduce((total, detalleMovimientos) => {
        return total + parseFloat(detalleMovimientos.precio.replace(',', '.'));
      }, 0);

    return subtotal;
  }
  // eliminarDetalle(detalle: DetallesPagoEntity): void {
    
  //   Swal.fire({
  //     icon: 'question',
  //     title: `¿Esta seguro de eliminar ${detalle.valor}?`,
  //     showDenyButton: true,
  //     confirmButtonText: 'Si',
  //     denyButtonText: 'No',
  //   }).then((result) => {
  //     if (result.isConfirmed) {
        
  //       this.httpServiceDetallePago.eliminarDetallePago(detalle).subscribe((res) => {
  //         if (res.codigoError == 'OK') {
  //           Swal.fire({
  //             icon: 'success',
  //             title: 'Eliminado Exitosamente.',
  //             text: `Se ha eliminado la forma de pago en ${detalle.nombre}`,
  //             showConfirmButton: true,
  //             confirmButtonText: 'Ok',
  //           }).then(() => {
  //             const newMovimiento: MovimientosEntity = {
  //               id: localStorage.getItem('movimiento_id')!,
  //               tipo_id: '',
  //               tipo_emision_cod: '',
  //               estado_fact_id: '',
  //               tipo_comprb_id: '',
  //               almacen_id: '',
  //               cod_doc: '',
  //               secuencial: ''
  //             }
  //             this, this.httpServiceDetallePago.obtenerDetallePagoMov(newMovimiento).subscribe(res => {
  //               if (res.codigoError != "OK") {
  //                 window.location.reload();
  //                 Swal.fire({
  //                   icon: 'info',
  //                   title: 'Información',
  //                   text: 'Necesitas abonar dinero',
  //                   showConfirmButton: true,
  //                   // timer: 3000
  //                 });
  //               } else {
  //                 this.lstDetallePagos = res.lstDetallePagos;
  //                 this.datatableElement.dtInstance.then((dtInstance2: DataTables.Api) => {
  //                   // Destruye la tabla existente y elimina los datos
  //                   dtInstance2.destroy();

  //                   // Renderiza la tabla con los nuevos datos
  //                   this.dtTrigger2.next('');

  //                   // Opcional: Reinicia la página a la primera página
  //                   dtInstance2.page('first').draw('page');
  //                   //this.calcularSumaTotal();
  //                 });
  //               }
  //             });
  //           });
  //         } else {
  //           Swal.fire({
  //             icon: 'error',
  //             title: 'Ha ocurrido un error.',
  //             text: res.descripcionError,
  //             showConfirmButton: false,
  //           });
  //         }
  //       });
  //     }
  //   });
    
  // }

  // aplicarCambiosDetalle(index: number): void {
  //   if (parseFloat(this.lstDetallePagos[this.detalleEditIndex].valor) <= this.sumaTotal.replace(',', '.') && parseFloat(this.lstDetallePagos[this.detalleEditIndex].valor) <= (parseFloat(this.resto) + parseFloat(this.valorAnterior))){
  //   if (this.detalleEditIndex >= 0 && this.detalleEditBackup) {
  //     // Realizar lógica de guardado o actualización del detalle en tu servicio
  //     // Por ejemplo:
  //     this.httpServiceDetallePago
  //       .modificarDetallePago(
  //         this.lstDetallePagos[this.detalleEditIndex]
  //       )
  //       .subscribe((res) => {
  //         if (res.codigoError == 'OK') {
  //           Swal.fire({
  //             icon: 'success',
  //             title: 'Guardado Exitosamente.',
  //             text: `Se han guardado los cambios del detalle`,
  //             showConfirmButton: true,
  //             confirmButtonText: 'Ok',
  //           }).then(() => {
  //             //this.cargarTablaMenuvent();
  //             this.editarDetalle = false;
  //             this.detalleEditIndex = -1;
  //             this.detalleEditBackup = null;
  //             //this.calcularSumaTotal();
  //             this.actualizarColor();
  //             });
  //         } else {
  //           Swal.fire({
  //             icon: 'error',
  //             title: 'Ha ocurrido un error.',
  //             text: res.descripcionError,
  //             showConfirmButton: false,
  //           });
  //         }
  //       });
  //   }
  // }else {
  //   Swal.fire({
  //     icon: 'error',
  //     title: 'Ha ocurrido un error.',
  //     text: 'Estás abonando más del resto o has abonado el total',
  //     showConfirmButton: false,
  //   });
  // }
    
  // }

  calcularTotalTarifa15(): number {
    const totalTarifa15 = this.lstDetalleMovimientos
      .filter((detalleMovimientos) => detalleMovimientos.tarifa === this.iva+'%')
      .reduce((total, detalleMovimientos) => {
        return total + parseFloat(detalleMovimientos.precio.replace(',', '.'));
      }, 0);
    const porcen = totalTarifa15 * (this.iva/100);

    return totalTarifa15 + porcen;
  }

  onInput(event: any) {
    const inputElement = event.target as HTMLInputElement;
    let inputValue = inputElement.value;

    // Remover caracteres que no son números o puntos
    inputValue = inputValue.replace(/[^0-9.]/g, '');

    // Reemplazar 0 al inicio con un punto
    if (inputValue.length > 0 && inputValue.charAt(0) === '0') {
      inputValue = '.' + inputValue.substring(1);
    }
    inputElement.value = inputValue;
  }

  calcularTotalTarifa0(): number {
    const totalTarifa0 = this.lstDetalleMovimientos
      .filter((detalleMovimientos) => detalleMovimientos.tarifa === '0%')
      .reduce((total, detalleMovimientos) => {
        return total + parseFloat(detalleMovimientos.precio.replace(',', '.'));
      }, 0);

    return totalTarifa0;
  }

}


