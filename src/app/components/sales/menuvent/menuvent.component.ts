import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Subject, finalize } from 'rxjs';
import { faShoppingBag, faSave, faList, faTimes, faShoppingCart, faEdit, faTrashAlt, faMoneyBillAlt, faCheck } from '@fortawesome/free-solid-svg-icons';
import { DetallesMovimientoEntity } from 'src/app/models/detallesmovimiento';
import { DetallesmovimientoService } from 'src/app/services/detallesmovimiento.service';
import { VerCarritoComponent } from '../ver-carrito/ver-carrito.component';
import '../../../../../src/disable-alerts';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MovimientosService } from 'src/app/services/movimientos.service';
import { MovimientosEntity } from 'src/app/models/movimientos';
import { VerClienteComponent } from '../ver-cliente/ver-cliente.component';
import { TercerosService } from 'src/app/services/terceros.service';
import { TercerosEntity } from 'src/app/models/terceros';
import { CiudadesService } from 'src/app/services/ciudades.service';
import { CiudadesEntity } from 'src/app/models/ciudades';
import { DetalleImpuestosService } from 'src/app/services/detalle-impuestos.service';
import { DetalleImpuestosEntity } from 'src/app/models/detalle-impuestos';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-menuvent',
  templateUrl: './menuvent.component.html',
  styleUrls: ['./menuvent.component.css'],
})
export class MenuventComponent implements OnInit {
  editarDetalle: boolean = false;
  selectTipo: boolean = false;

  clienteForm = new FormGroup({
    tipo: new FormControl('0', Validators.required),
  });

  //Iconos para la pagina de grupos
  faList = faList;
  faTimes = faTimes;
  faCheck = faCheck;
  faSave = faSave;
  faShoppingCart = faShoppingCart;
  faEdit = faEdit;
  faTrashAlt = faTrashAlt;
  faMoneyBillAlt = faMoneyBillAlt;
  faShoppingBag = faShoppingBag;

  //Declaración de variables
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  lstDetalleMovimientos: DetallesMovimientoEntity[] = [];
  lstCiudades: CiudadesEntity[] = [];
  lstCiudades2: CiudadesEntity[] = [];
  sumaTotal: any;
  clienteDatosCompletos: boolean = false;
  private datatableElement!: DataTableDirective;
  detalleEditIndex: number = -1;
  detalleEditBackup: DetallesMovimientoEntity | null = null;
  formGroup: any;
  nombre: string = '';
  identificacion: string = '';
  correo: string = '';
  telefono: string = '';
  ciudad: string = '';
  direccion: string = '';
  ciudadId: any;

  constructor(
    private dialog: MatDialog,
    private readonly httpServiceCiudades: CiudadesService,
    private readonly httpService: DetallesmovimientoService,
    private readonly httpServiceMov: MovimientosService,
    private readonly httpServiceTer: TercerosService,
    private readonly httpServiceDet: DetalleImpuestosService,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.dtOptions = {
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json',
      },
      paging: true,
      search: false,
      searching: true,
      ordering: true,
      info: false,
      responsive: true,
    };

    this.httpServiceCiudades.obtenerCiudadesAll().subscribe((res) => {
      if (res.codigoError != 'OK') {
        Swal.fire({
          icon: 'error',
          title: 'No se pudo obtener las ciudades.',
          text: res.descripcionError,
          showConfirmButton: false,
        });
      } else {
        this.lstCiudades = res.lstCiudades;
      }
    });

    this.cargarTablaMenuvent();
  }

  changeGroup(tipoC: any): void {
    if (tipoC.target.value == 0) {
      this.selectTipo = true;
    } else {
      this.selectTipo = false;
    }
  }

  actualizar() {
    const city = document.getElementById('ciudad') as HTMLSelectElement;
    const newCiudad: CiudadesEntity = {
      idCiudad: '',
      ciudad: city.value,
      provinciaid: '',
      provincia: '',
      codigo: '',
      created_at: '',
      update_at: '',
    };

    this.httpServiceCiudades.obtenerCiudadesN(newCiudad).subscribe((res) => {
      if (res.codigoError != 'OK') {
        Swal.fire({
          icon: 'info',
          title: 'Información',
          text: 'Ha ocurrido un error',
          showConfirmButton: true,
          // timer: 3000
        });
      } else {
        this.ciudadId = res.lstCiudades[0].idCiudad!;
        const newTercero: TercerosEntity = {
          almacen_id: '',
          id: localStorage.getItem('idClVenta')!,
          sociedad_id: '',
          tipotercero_id: '',
          tipousuario_id: '',
          nombresociedad: '',
          nombrealmacen: '',
          nombretercero: this.nombre,
          tipousuario: '',
          nombre: this.nombre,
          id_fiscal: '',
          direccion: this.direccion,
          telefono: this.telefono,
          correo: this.correo,
          fecha_nac: '',
          ciudad: '',
          provincia: '',
          ciudadid: this.ciudadId,
        };
        console.log(newTercero);
        this.httpServiceTer.actualizarCliente(newTercero).subscribe((res) => {
          if (res.codigoError != 'OK') {
            Swal.fire({
              icon: 'info',
              title: 'Información',
              text: res.descripcionError,
              showConfirmButton: true,
              // timer: 3000
            });
          } else {
            Swal.fire({
              icon: 'success',
              title: 'Actualizado',
              text: 'Se han actualizado los datos',
              showConfirmButton: true,
              // timer: 3000
            });
          }
        });
        this.clienteDatosCompletos = (
          this.identificacion !== '' &&
          this.nombre !== '' &&
          this.correo !== '' &&
          this.ciudad !== '' &&
          this.direccion !== '' &&
          this.telefono !== ''
      );
      }
    });
  }

  realizarAccion() {
    console.log(localStorage.getItem('movimiento_id'));
    const selectedOption = this.clienteForm.get('tipo')!.value;
    if (selectedOption === 'CONSUMIDOR FINAL') {
      localStorage.setItem('idfiscalCl', '9999999999999');
      const newMovimiento: MovimientosEntity = {
        id: localStorage.getItem('movimiento_id')!,
        tipo_id: '',
        tipo_emision_cod: '',
        estado_fact_id: '',
        tipo_comprb_id: '',
        almacen_id: localStorage.getItem('almacenid')!,
        cod_doc: '',
        secuencial: '',
      };
      this.nombre = 'CONSUMIDOR FINAL';
      this.identificacion = 'CONSUMIDOR FINAL';
      this.correo = 'CONSUMIDOR FINAL';
      this.telefono = 'CONSUMIDOR FINAL';
      this.direccion = 'CONSUMIDOR FINAL';
      this.ciudad = 'Ambato';
      this.httpServiceMov
        .actualizarTerceroPedido(newMovimiento)
        .subscribe((res) => {
          if (res.codigoError != 'OK') {
            Swal.fire({
              icon: 'info',
              title: 'Información',
              text: 'Ha ocurrido un error',
              showConfirmButton: true,
              // timer: 3000
            });
          } else {
            Swal.fire({
              icon: 'info',
              title: 'Información',
              text: 'Se ha elegido al Consumidor Final',
              showConfirmButton: true,
              // timer: 3000
            });
          }
        });
        this.clienteDatosCompletos = (
          this.identificacion !== '' &&
          this.nombre !== '' &&
          this.correo !== '' &&
          this.ciudad !== '' &&
          this.direccion !== '' &&
          this.telefono !== ''
      );
    } else if (selectedOption === 'CLIENTE') {
      const dialogRef = this.dialog.open(VerClienteComponent, {
        width: '900px',
        height: '600px',

        // Agrega cualquier configuración adicional del modal aquí
      });

      dialogRef.afterClosed().subscribe((result) => {
        // Lógica para manejar el resultado después de cerrar el modal
      });
      // Verificar si los campos del cliente están completos
      this.clienteDatosCompletos = (
        this.identificacion !== '' &&
        this.nombre !== '' &&
        this.correo !== '' &&
        this.ciudad !== '' &&
        this.direccion !== '' &&
        this.telefono !== ''
      );
    } else {
      console.log('ERROR');
    }
  }

  verDatos() {
    console.log(this.lstDetalleMovimientos.length);
    const terceroNew: TercerosEntity = {
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
      ciudadid: '',
    };
    this.httpServiceTer.obtenerTerceroCedula(terceroNew).subscribe((res) => {
      console.log(res)
      if (res.codigoError == 'OK') {
        this.nombre = res.lstTerceros[0].nombre;
        this.identificacion = res.lstTerceros[0].id_fiscal;
        this.correo = res.lstTerceros[0].correo;
        this.telefono = res.lstTerceros[0].telefono;
        this.direccion = res.lstTerceros[0].direccion;
        this.ciudad = res.lstTerceros[0].ciudad;
      }
    });
    this.clienteDatosCompletos = (
      this.identificacion !== '' &&
      this.nombre !== '' &&
      this.correo !== '' &&
      this.ciudad !== '' &&
      this.direccion !== '' &&
      this.telefono !== ''
  );
  }
  verCarrito() {
    const dialogRef = this.dialog.open(VerCarritoComponent, {
      width: '1200px',
      height: '620px',
      // Agrega cualquier configuración adicional del modal aquí
    });

    dialogRef.componentInstance.productoAgregado.subscribe((producto: any) => {
      // Actualizar la tabla
      this.cargarTablaMenuvent();
    });

    dialogRef.afterClosed().subscribe((result) => {
      const newDetalle: DetallesMovimientoEntity = {
        id: '',
        producto_nombre: '',
        inventario_id: '',
        producto_id: '',
        movimiento_id: localStorage.getItem('movimiento_id')!,
        cantidad: '',
        costo: '',
        precio: '',
      };
  
      this.httpService.obtenerDetalleMovimiento(newDetalle).subscribe((res) => {
        if (res.codigoError != 'OK') {
          Swal.fire({
            icon: 'info',
            title: 'Información',
            text: 'Empieza tu pedido en "AÑADIR".',
            showConfirmButton: true,
            // timer: 3000
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
          this.calcularSumaTotal();
          Swal.close();
        }
      });
    });
  }

  cargarTablaMenuvent() {
    const newDetalle: DetallesMovimientoEntity = {
      id: '',
      producto_nombre: '',
      inventario_id: '',
      producto_id: '',
      movimiento_id: localStorage.getItem('movimiento_id')!,
      cantidad: '',
      costo: '',
      precio: '',
    };

    this.httpService.obtenerDetalleMovimiento(newDetalle).subscribe((res) => {
      if (res.codigoError != 'OK') {
        Swal.fire({
          icon: 'info',
          title: 'Información',
          text: 'Empieza tu pedido en "AÑADIR".',
          showConfirmButton: true,
          // timer: 3000
        });
      } else {
        this.lstDetalleMovimientos = res.lstDetalleMovimientos;
        this.dtTrigger.next('');
        this.calcularSumaTotal();
        Swal.close();
      }
    });
  }

  calcularSumaTotal() {
    const totalTarifa12 = this.calcularTotalTarifa12();
    const totalTarifa0 = this.calcularTotalTarifa0();
    const desc = this.calcularDescuento();

    const suma = totalTarifa12 + totalTarifa0;

    this.sumaTotal = suma
      .toLocaleString(undefined, { maximumFractionDigits: 2 })
      .replace('.', ',');
  }

  calcularSubtotal(): number {
    const subtotal = this.lstDetalleMovimientos
      .filter((detalleMovimientos) => detalleMovimientos.tarifa)
      .reduce((total, detalleMovimientos) => {
        return total + parseFloat(detalleMovimientos.precio.replace(',', '.'));
      }, 0);

    return subtotal;
  }

  calcularTotalTarifa12P(): number {
    const totalTarifa12 = this.lstDetalleMovimientos
      .filter((detalleMovimientos) => detalleMovimientos.tarifa === '12%')
      .reduce((total, detalleMovimientos) => {
        return total + parseFloat(detalleMovimientos.precio.replace(',', '.'));
      }, 0);

    return totalTarifa12;
  }

  calcularTotalTarifa12(): number {
    const totalTarifa12 = this.lstDetalleMovimientos
      .filter((detalleMovimientos) => detalleMovimientos.tarifa === '12%')
      .reduce((total, detalleMovimientos) => {
        return total + parseFloat(detalleMovimientos.precio.replace(',', '.'));
      }, 0);
    const porcen = totalTarifa12 * 0.12;

    return totalTarifa12 + porcen;
  }

  calcularIva12(): number {
    const totalTarifa12 = this.lstDetalleMovimientos
      .filter((detalleMovimientos) => detalleMovimientos.tarifa === '12%')
      .reduce((total, detalleMovimientos) => {
        return total + parseFloat(detalleMovimientos.precio.replace(',', '.'));
      }, 0);
    const porcen = totalTarifa12 * 0.12;

    return porcen;
  }

  calcularDescuento(): number {
    const descuento = this.lstDetalleMovimientos
      .filter((detalleMovimientos) => detalleMovimientos.desc_add)
      .reduce((total, detalleMovimientos) => {
        return total + parseFloat(detalleMovimientos.desc_add!.replace(',', '.'));
      }, 0);

    return descuento;
  }

  calcularTotalTarifa0(): number {
    const totalTarifa0 = this.lstDetalleMovimientos
      .filter((detalleMovimientos) => detalleMovimientos.tarifa === '0%')
      .reduce((total, detalleMovimientos) => {
        return total + parseFloat(detalleMovimientos.precio.replace(',', '.'));
      }, 0);

    return totalTarifa0;
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
        this.httpService.eliminarDetallePedido(detalle).subscribe((res) => {
          if (res.codigoError == 'OK') {
            Swal.fire({
              icon: 'success',
              title: 'Eliminado Exitosamente.',
              text: `Se ha eliminado el producto ${detalle.producto_nombre}`,
              showConfirmButton: true,
              confirmButtonText: 'Ok',
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
                  // this.disableProveedor = this.lstDetalleMovimientos.length > 0;
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
        });
      }
    });
  }

  editarDetalleMovimiento(index: number): void {
    this.detalleEditIndex = index;
    this.detalleEditBackup = { ...this.lstDetalleMovimientos[index] };
    this.editarDetalle = true;
  }

  aplicarCambiosDetalle(index: number): void {
    //this.guardarDetalleMovimiento();
    if (this.detalleEditIndex >= 0 && this.detalleEditBackup) {
      // Realizar lógica de guardado o actualización del detalle en tu servicio
      // Por ejemplo:
      this.httpService
        .modificarDetallePedido(
          this.lstDetalleMovimientos[this.detalleEditIndex]
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
              this.cargarTablaMenuvent();
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
    const desc = parseFloat(detalleMovimientos.desc_add!);

    if (!isNaN(cantidad) && !isNaN(costo)) {
      detalleMovimientos.precio = (cantidad * costo - desc).toFixed(2);
    } else {
      detalleMovimientos.precio = '';
    }

    this.calcularSumaTotal();
  }

  onInput(event: any) {
    const inputValue = event.target.value;
    event.target.value = inputValue.replace(/[^0-9]/g, ''); // Filtra solo números
  }

  onInput2(event: any) {
    const inputValue = event.target.value;
    event.target.value = inputValue.replace(/[^0-9.]/g, ''); // Filtra solo números y punto
  }

  finalizarPedido() {
    Swal.fire({
      title: '¿Continuar con la venta?',
      showDenyButton: true,
      confirmButtonText: 'SÍ',
      denyButtonText: `NO`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        //
        console.log(this.lstDetalleMovimientos[0].id)
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
                if (res.lstDetalleImpuestos[0].porcentaje == '12%') {
                  const newDetalleImp2: DetalleImpuestosEntity = {
                    id: '',
                    detalle_movimiento_id: detalleMovimiento.id ?? '',
                    cod_impuesto: '',
                    porcentaje: detalleMovimiento.tarifa ?? '',
                    base_imponible: '',
                    valor: (parseFloat(res.lstDetalleImpuestos[0].base_imponible) * 0.12).toString(),
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
                            valor: (parseFloat(res3.lstDetalleImpuestos[0].base_imponible) * 0.12).toString(),
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
                            valor: (parseFloat(res3.lstDetalleImpuestos[0].base_imponible) * 0.12).toString(),
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
        Swal.fire({
          icon: 'success',
          title: 'Continuando...',
          showConfirmButton: true,
          confirmButtonText: 'Ok',
        }).finally(() => {
          // this.groupForm.reset();
          this.router.navigate([
            '/navegation-cl',
            { outlets: { contentClient: ['ver-factura'] } },
          ]);
        });
      } else if (result.isDenied) {
        Swal.fire('No se finalizó el proceso de venta', '', 'info');
      }
    });
  }
}
