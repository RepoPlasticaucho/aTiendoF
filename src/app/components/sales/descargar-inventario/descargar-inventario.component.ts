import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DetallesMovimientoEntity } from 'src/app/models/detallesmovimiento';
import { DetallesmovimientoService } from 'src/app/services/detallesmovimiento.service';
import { MovimientosService } from 'src/app/services/movimientos.service';
import { MovimientosEntity } from 'src/app/models/movimientos';
import { SociedadesService } from 'src/app/services/sociedades.service';
import { faShoppingCart, faEdit, faTrashAlt, faMoneyBillAlt, faFileInvoice, faCheck, faSave } from '@fortawesome/free-solid-svg-icons';
import { BehaviorSubject, Subject, finalize, takeUntil } from 'rxjs';
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
import { MenuventComponent } from '../menuvent/menuvent.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { parse } from 'path';
import { DetalleImpuestosService } from 'src/app/services/detalle-impuestos.service';
import { ApplyDiscountComponent } from '../../discounts-cl/apply-discount/apply-discount.component';
import { DescuentosService } from 'src/app/services/descuentos.service';
import { DescuentosEntity } from 'src/app/models/descuentos';

@Component({
  selector: 'app-descargar-inventario',
  templateUrl: './descargar-inventario.component.html',
  styleUrls: ['./descargar-inventario.component.css']
})
export class DescargarInventarioComponent implements OnInit {

  private descuentosSubject = new BehaviorSubject<DescuentosEntity[]>([]);
  private destroy$ = new Subject<void>();
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
  lstDetallePagos: DetallesPagoEntity[] = [];
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

  confirmacionCerrado = false;

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
    private dialog: MatDialog,
    private readonly httpServiceDescuento: DescuentosService,
    private router: Router) { }

  ngOnInit(): void {



    this.httpServiceDescuento.descuentos$
    .pipe(takeUntil(this.destroy$))
    .subscribe(descuentos => {
      this.handleDescuentosAplicados(descuentos);
  });

    this.actualizarColor();
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

    //Obtener el total del localstorage

    this.resto = localStorage.getItem('totalDescargar');
    this.sumaTotal = this.resto
    .toLocaleString(undefined, { maximumFractionDigits: 2 })
    .replace('.', ',');

    this.httpServiceForma.obtenerFormasPago().subscribe(res => {
      if (res.codigoError == 'OK') {
        this.lstFormasPagoAux = res.lstFormasPago;

        const sociedad: SociedadesEntity = {
          idSociedad: localStorage.getItem('sociedadid')!,
          razon_social: '',
          nombre_comercial: '',
          id_fiscal: '',
          email: '',
          telefono: '',
          password: '',
          funcion: '',
          tipo_ambienteid: '',
          idGrupo: ''
        }
        this.httpServiceFormaSociedad.obtenerFormasPago(sociedad).subscribe(res => {
          if (res.codigoError == 'OK') {
            this.lstFormasPagoSociedad = res.lstFormasPagoSociedad;
            //Recorrer lstFormasPagoAux y solo sacar los que tengan el mismo codigo de lstFormasPagoSociedad
            this.lstFormasPago = this.lstFormasPagoAux.filter((item) => {
              return this.lstFormasPagoSociedad.some((item2) => {
                return parseInt(item.codigo) === parseInt(item2.forma_pago_id);
              });
            });

          } else {
            console.log('ERROR')
          }
        });

      } else {
        Swal.fire({
          icon: 'info',
          title: 'Información',
          text: 'Ha ocurrido un error',
          showConfirmButton: true,
        });
      }
    });

 



    const newDetalle: DetallesMovimientoEntity = {
      id: '',
      producto_nombre: '',
      inventario_id: '',
      producto_id: '',
      movimiento_id: JSON.parse(localStorage.getItem('movimiento_id') || "[]"),
      cantidad: '',
      costo: '',
      precio: ''
    }
    const newAlmacen: AlmacenesEntity = {
      idAlmacen: localStorage.getItem('almacenid')!,
      sociedad_id: '',
      nombresociedad: '',
      direccion: '',
      telefono: '',
      codigo: '',
      pto_emision: ''
    }
    const newTercero: TercerosEntity = {
      almacen_id: '',
      sociedad_id: '',
      tipotercero_id: '',
      tipousuario_id: '',
      nombresociedad: '',
      nombrealmacen: '',
      nombretercero: '',
      tipousuario: '',
      nombre: '',
      id_fiscal: localStorage.getItem('idfiscalCl')!,
      direccion: '',
      telefono: '',
      correo: '',
      fecha_nac: '',
      ciudad: '',
      provincia: '',
      ciudadid: ''
    }
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
    Swal.fire({
      title: 'CARGANDO...',
      html: 'Se está cargando el detalle.',
      timer: 30000,
      didOpen: () => {
        Swal.showLoading();
        this.httpServiceTercero.obtenerTerceroCedula(newTercero).subscribe(res1 => {
          console.log("ACA RES1"+res1.lstTerceros)
          if (res1.codigoError != "OK") {
            this.cliente = "Consumidor Final";
            this.telefono = "999999999";
            this.email = "99999999";

          } else {
            this.numFactura = localStorage.getItem('movimiento_id')!;
            this.cliente = res1.lstTerceros[0].nombre;
            this.telefono = res1.lstTerceros[0].telefono;
            this.email = res1.lstTerceros[0].correo;
            this.idFiscalCliente = res1.lstTerceros[0].id_fiscal;
          }
        });
        this.httpServiceAlmacen.obtenerAlmacenID(newAlmacen).subscribe(res1 => {
          if (res1.codigoError != "OK") {

          } else {
            this.nombreSoc = res1.lstAlmacenes[0].nombresociedad!;
            this.idFiscalSoc = res1.lstAlmacenes[0].idfiscal_sociedad!;
            this.direccionAlm = res1.lstAlmacenes[0].direccion!;
            this.telefonoAlm = res1.lstAlmacenes[0].telefono!;
          }
        });
        this.httpServiceMovimiento.obtenerMovimientoID(newMovimiento).subscribe(res2 => {
          if (res2.codigoError != "OK") {

          } else {
            this.fechaEmision = res2.lstMovimientos[0].fecha_emision!;
          }
        });
        this, this.httpServiceDetallePago.obtenerDetallePagoMov(newMovimiento).subscribe(res => {
          if (res.codigoError != "OK") {
            this.httpService.obtenerDetalleMovimiento(newDetalle).subscribe(res1 => {
              if (res1.codigoError != "OK") {
                Swal.fire({
                  icon: 'error',
                  title: 'No existe nada en el carrito.',
                  text: res.descripcionError,
                  showConfirmButton: false,
                  // timer: 3000
                });
              } else {
                this.lstDetalleMovimientos = res1.lstDetalleMovimientos;
                this.dtTrigger.next('');
                Swal.close();
              }
            });
          } else {
            this.lstDetallePagos = res.lstDetallePagos;
            this.dtTrigger2.next('');
            console.log(this.lstDetalleMovimientos)
            this.httpService.obtenerDetalleMovimiento(newDetalle).subscribe(res1 => {
              console.log(res1)
              
              if (res1.codigoError != "OK") {
                Swal.fire({
                  icon: 'error',
                  title: 'No existe nada en el carrito.',
                  text: res.descripcionError,
                  showConfirmButton: false,
                  // timer: 3000
                });
              } else {
                this.lstDetalleMovimientos = res1.lstDetalleMovimientos;
                this.dtTrigger.next('');
                Swal.close();
              }
            });
          }
        })
        
      },
      
    }).then((result) => {
      /* Read more about handling dismissals below */
      if (result.dismiss === Swal.DismissReason.timer) {
        console.log('I was closed by the timer');
      }
    });

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
    const restoNumerico = parseFloat(this.sumaTotal); // Convertir a número
    if (restoNumerico === 0.00 || restoNumerico === 0 || this.sumaTotal === '0,00' || this.sumaTotal === '0') {
      this.inputColor = '#9EF291';
      this.esRestoCero = true;
    } else {
      this.inputColor = '#F9ED95';
      this.esRestoCero = false;
    }
  }


  handleDescuentosAplicados(descuentos: DescuentosEntity[]) {
    //Reemplazar en lso descuentos valor las , por .
    descuentos.forEach(descuento => {
      descuento.valorDescuento = descuento.valorDescuento.replace(',', '.');
    });

    const descuentosTipo1 = descuentos.filter(descuento => descuento.tipoDescuento === "2");

    // Suma los valores de los descuentos filtrados
    this.descuentoN = descuentosTipo1.reduce((total, descuento) => total + parseFloat(descuento.valorDescuento), 0);

    const descuentosTipo2 = descuentos.filter(descuento => descuento.tipoDescuento === "1");
    this.descuentoP = descuentosTipo2.reduce((total, descuento) => total + parseFloat(descuento.valorDescuento), 0);

    //Calcular el total
    this.calcularSumaTotal();
    
    console.log('Descuentos aplicados:', descuentos);
    // Actualiza los datos según los descuentos aplicados
    // Por ejemplo, puedes calcular el total con los descuentos aplicados aquí
  }
  
  onInput2(event: any) {
    let inputValue = event.target.value;
    const filteredValue = inputValue.replace(/[^0-9.]/g, ''); // Filtra solo números y punto

    if (/^\d*\.?\d*$/.test(inputValue) && !filteredValue.startsWith('.')) {
      this.calcularSumaTotal();
    } else {
      event.target.value = inputValue.length === 0 ? '0' : '';
    }
  }


  calcularSumaTotal() {
    const totalTarifa15 = this.calcularTotalTarifa15();
    const totalTarifa0 = this.calcularTotalTarifa0();
    const desc = this.calcularDescuento();
    const descP = this.validarDescuento();
    const resto = this.calcularTotalAbonado();
    this.totalF = totalTarifa15 + totalTarifa0 - this.descuentoN;

    const suma = totalTarifa15 + totalTarifa0 - this.descuentoN - descP;

    this.sumaTotal = suma
      .toLocaleString(undefined, { maximumFractionDigits: 2 })
      .replace('.', ',');

    this.resto = (this.sumaTotal.replace(',', '.') - resto).toFixed(2);
  }

  calcularTotalAbonado(): number {
    const totalAb = this.lstDetallePagos
      .filter((detallePagos) => detallePagos.valor)
      .reduce((total, detallePagos) => {
        console.log(total)
        return total + parseFloat(detallePagos.valor.replace(',', '.'));
      }, 0);

    return totalAb;
  }

  validarDescuento(): number {
    if (this.sumaTotal) {
      const descuento = (((this.descuentoP) * (this.totalF)) / 100);

      return descuento;
    }
    return 0;
  }
  
  calcularDescuento(): number {
    const descuento = this.lstDetalleMovimientos
      .filter((detalleMovimientos) => detalleMovimientos.desc_add)
      .reduce((total, detalleMovimientos) => {
        return total + parseFloat(detalleMovimientos.desc_add!.replace(',', '.'));
      }, 0);

    return descuento;
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
    const monto = document.getElementById('monto') as HTMLInputElement;

    //Si el monto contiene , cambiarlo por .
    if (monto.value.includes(',')) {
      monto.value = monto.value.replace(',', '.');
    }


    console.log('Monto parseado: ' + parseFloat(monto.value));

    console.log('Suma total parseado cambiado: ' + this.sumaTotal.replace(',', '.'));

    //Cambiar el resto , por .
    if (this.resto.includes(',')) {
      this.resto = this.resto.replace(',', '.');
    }

    
    if (parseFloat(monto.value) <= parseFloat(this.sumaTotal.replace(',', '.')) && parseFloat(monto.value) <= parseFloat(this.resto)) {
      //Imprimir lo que esta dentro del if}


      console.log('Resto antes de restar: ' + this.resto);
      this.resto = (this.resto -parseFloat(monto.value)).toFixed(2);

      
      console.log('Monto: ' + parseFloat(monto.value));

      console.log('Restoooo este eeees: ' + this.resto);

      this.actualizarColor();
      const newDetallePago: DetallesPagoEntity = {
        id: '',
        movimiento_id: localStorage.getItem('movimiento_id')!,
        forma_pago_id: this.lstFormasPago2[0].id,
        descripcion: 'PAGO',
        valor: monto.value,
        fecha_recaudo: '',
        created_at: '',
        updated_at: ''
      }

      this.httpServiceDetallePago.agregarDetallePago(newDetallePago).subscribe(res => {
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
          this, this.httpServiceDetallePago.obtenerDetallePagoMov(newMovimiento).subscribe(res => {
            if (res.codigoError != "OK") {
  
            } else {
              this.lstDetallePagos = res.lstDetallePagos;
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

  //Si cierra por otra via se elimina todos los descuentos aplicados en el movimiento
  ngOnDestroy(): void {
  
    this.destroy$.next();
    this.destroy$.complete();
    //Si confirmacionCerrado es true se retorna
    if (this.confirmacionCerrado) {
      return;
    }

    const descuentoDetalle: DescuentosEntity = {
      id: '',
      //Agianar el valor de documento en codigo descuento
      codigoDescuento: "",
      usoMaximo: '',
      valorDescuento: '',
      fecha_inicio: '',
      fecha_fin: '',
      tipoDescuento: '',
      sociedad: localStorage.getItem('sociedadid')!,
      estado: '',
      movimiento_id: localStorage.getItem('movimiento_id')!
    }

    this.httpServiceDescuento.eliminarDescuentoMovimiento(descuentoDetalle).subscribe(res => {
      if (res.codigoError == 'OK') {
        console.log('Descuentos eliminados')

        
      this.descuentoN = 0;
      this.descuentoP = 0;
      //Eliminar en el observable los descuentos
      this.httpServiceDescuento.updateDescuentos([]);
      
      // Actualizar los inputs en 0
      this.calcularSumaTotal();

      } else {
        console.log('ERROR')
      }
    });
  }


  descargarInventario() {
    this.confirmacionCerrado = true;
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
          this.router.navigate(['navegation-cl']);


          // localStorage.removeItem('totalDescargar');
          // localStorage.removeItem('movimiento_id');
          // localStorage.removeItem('sociedadid');
          // localStorage.removeItem('idfiscalCl');
          // localStorage.removeItem('almacenid');
          // localStorage.removeItem('estab');
          // localStorage.removeItem('movimiento_id');
  
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


  updateDescuentos(descuentos: DescuentosEntity[]) {
    this.descuentosSubject.next(descuentos);
  }

  openModalDescuentoNominal() {
    //Guardar el total en el local storage
    localStorage.setItem('totalDescargar', this.sumaTotal);
    
        if(this.lstDetalleMovimientos.length == 0){
          Swal.fire({
            icon: 'info',
            title: 'Información',
            text: 'No hay productos en el carrito.',
            showConfirmButton: true,
            // timer: 3000
          });
          return
        }
    
        const dialogRef = this.dialog.open(ApplyDiscountComponent, {
          width: 'auto', // Ancho automático basado en el contenido
          maxWidth: '90vw', // Máximo ancho del modal al 90% del viewport width
          height: 'auto', // Altura automática basada en el contenido
          maxHeight: '80vh', // Máxima altura del modal al 80% del viewport height
          data: { /* Aquí pasas los datos que quieres enviar */ 
            total: this.totalF,
            sumaTotal: this.sumaTotal,
          }
        });

        dialogRef.afterClosed().subscribe(result => {
          const descuentos = this.httpServiceDescuento.descuentos$; // Obtén los descuentos desde el servicio
          console.log('Descuentos después de cerrar el modal:', descuentos);
        })
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
  eliminarDetalle(detalle: DetallesPagoEntity): void {
    
    Swal.fire({
      icon: 'question',
      title: `¿Esta seguro de eliminar ${detalle.valor}?`,
      showDenyButton: true,
      confirmButtonText: 'Si',
      denyButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        
        this.httpServiceDetallePago.eliminarDetallePago(detalle).subscribe((res) => {
          if (res.codigoError == 'OK') {
            Swal.fire({
              icon: 'success',
              title: 'Eliminado Exitosamente.',
              text: `Se ha eliminado la forma de pago en ${detalle.nombre}`,
              showConfirmButton: true,
              confirmButtonText: 'Ok',
            }).then(() => {
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
              this, this.httpServiceDetallePago.obtenerDetallePagoMov(newMovimiento).subscribe(res => {
                if (res.codigoError != "OK") {
                  window.location.reload();
                  Swal.fire({
                    icon: 'info',
                    title: 'Información',
                    text: 'Necesitas abonar dinero',
                    showConfirmButton: true,
                    // timer: 3000
                  });
                } else {
                  this.lstDetallePagos = res.lstDetallePagos;
                  this.datatableElement.dtInstance.then((dtInstance2: DataTables.Api) => {
                    // Destruye la tabla existente y elimina los datos
                    dtInstance2.destroy();

                    // Renderiza la tabla con los nuevos datos
                    this.dtTrigger2.next('');

                    // Opcional: Reinicia la página a la primera página
                    dtInstance2.page('first').draw('page');
                    //this.calcularSumaTotal();
                  });
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
        });
      }
    });
    
  }

  aplicarCambiosDetalle(index: number): void {
    if (parseFloat(this.lstDetallePagos[this.detalleEditIndex].valor) <= this.sumaTotal.replace(',', '.') && parseFloat(this.lstDetallePagos[this.detalleEditIndex].valor) <= (parseFloat(this.resto) + parseFloat(this.valorAnterior))){
    if (this.detalleEditIndex >= 0 && this.detalleEditBackup) {
      // Realizar lógica de guardado o actualización del detalle en tu servicio
      // Por ejemplo:
      this.httpServiceDetallePago
        .modificarDetallePago(
          this.lstDetallePagos[this.detalleEditIndex]
        )
        .subscribe((res) => {
          if (res.codigoError == 'OK') {
            Swal.fire({
              icon: 'success',
              title: 'Guardado Exitosamente.',
              text: `Se han guardado los cambios del detalle`,
              showConfirmButton: true,
              confirmButtonText: 'Ok',
            }).then(() => {
              //this.cargarTablaMenuvent();
              this.editarDetalle = false;
              this.detalleEditIndex = -1;
              this.detalleEditBackup = null;
              //this.calcularSumaTotal();
              this.actualizarColor();
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
  }else {
    Swal.fire({
      icon: 'error',
      title: 'Ha ocurrido un error.',
      text: 'Estás abonando más del resto o has abonado el total',
      showConfirmButton: false,
    });
  }
    
  }

  editarDetallePago(index: number): void {
    this.detalleEditIndex = index;
    this.detalleEditBackup = { ...this.lstDetallePagos[index] };
    this.editarDetalle = true;
    this.valorAnterior = this.lstDetallePagos[this.detalleEditIndex].valor;
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

