import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { Subject, finalize, take } from 'rxjs';
import { faShoppingBag, faSave, faList, faTimes, faCartPlus, faEdit, faTrashAlt, faMoneyBillAlt, faCheck, faPlus, faFolderPlus, faArchive } from '@fortawesome/free-solid-svg-icons';
import { DetallesMovimientoEntity } from 'src/app/models/detallesmovimiento';
import { DetallesmovimientoService } from 'src/app/services/detallesmovimiento.service';
import { CompraNuevoComponent } from '../compra-nuevo/compra-nuevo.component';
import '../../../../../src/disable-alerts';
import { AbstractControl, FormControl, FormGroup, Validators, ValidatorFn } from '@angular/forms';
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
import { HttpClient } from '@angular/common/http';
import { XmlCarga, XmlCargaEntity } from 'src/app/models/xmlCarga';
import { ProveedoresproductosService } from 'src/app/services/proveedoresproductos.service';
import { ProveedoresProductos, ProveedoresProductosEntity } from 'src/app/models/proveedoresproductos';

@Component({
  selector: 'app-menucompr',
  templateUrl: './menucompr.component.html',
  styleUrls: ['./menucompr.component.css'],
  providers: [DatePipe]
})
export class MenucomprComponent implements OnInit {
  clienteForm = new FormGroup({
    proveedor: new FormControl('0', Validators.required),
    tipo: new FormControl('0', Validators.required)
  });

  nombreAlmacenCompra = localStorage.getItem('nombreAlmacenCompra')!;

  //Iconos para la pagina de grupos
  faList = faList;
  faTimes = faTimes;
  faCheck = faCheck;
  faSave = faSave;
  faArchive = faArchive;
  faPlus = faPlus;
  faCartPlus = faCartPlus;
  faEdit = faEdit;
  faTrashAlt = faTrashAlt;
  faMoneyBillAlt = faMoneyBillAlt;
  faShoppingBag = faShoppingBag;
  faFolderPlus = faFolderPlus;
  errorAutorizacion: boolean = false;
  public buttonsDisabled = true;
  selectedProveedor: string = '';
  selectedComprobante: string = '';
  selectedSustento: string = '';
  lstXmlProveedoresProductos: ProveedoresProductosEntity[] = [];
  failedCodSap: string[] = [];

  costo: any;
  costoStatic: any;
  stockStatic: any;
  costo2: any;
  precio: any;

  ruc?: string | null;
  detalle?: any[] | null;
  codigosPrincipales?: any[] | null;

  lstXmlCarga: XmlCargaEntity[] = [];

  public proveedorSeleccionado = false;
  public sustentoSeleccionado = false;
  public comprobanteCompraSeleccionado = false;
  public comprobanteLleno = false;
  public autorizacionLlena = false;


  attributeForm = new FormGroup({
    autorizacion: new FormControl('', [Validators.required, this.autorizacionLengthValidator()])
  });


  autorizacionLengthValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value: string = control.value;
      if (value && (value.length === 10 || value.length === 49)) {
        return null; // La longitud es válida, así que no hay error
      }
      return { 'autorizacion': true }; // La longitud no es válida, devolvemos un error
    };
  }

  keyPressValidator49or10(event: any) {
    //Validar que sea numero
    var charCode = (event.which) ? event.which : event.keyCode;
    // Only Numbers 0-9
    if ((charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    } else {
      //Validar que autorizacion tenga 10 o 49 digitos
      if (event.target.value.length !== 10 || event.target.value.length !== 49) {
        this.errorAutorizacion = true
      }
      if (event.target.value.length == 10 || event.target.value.length == 49) {
        this.errorAutorizacion = false
      }
      return true;
    }
  }


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

  iva = environment.iva

  constructor(private dialog: MatDialog,
    private readonly httpServiceProvProd: ProveedoresproductosService,
    private readonly httpServiceInventario: InventariosService,
    private readonly httpServiceDetalle: DetallesmovimientoService,
    private readonly httpService: DetallesmovimientoService,
    private readonly httpServiceProv: ProveedoresService,
    private readonly httpServiceMov: MovimientosService,
    private readonly httpServiceSus: SustentosTributariosService,
    private readonly httpServiceInv: InventariosService,
    private readonly httpServiceDet: DetalleImpuestosService,
    private readonly httpProveedorProducto: ProveedoresproductosService,
    private readonly httpServiceComprobante: ComprobanteComprasService,
    private readonly httpServiceDetalleImp: DetalleImpuestosService,

    private datePipe: DatePipe,
    private router: Router,
    private http: HttpClient) { }

  ngOnInit(): void {




    let component = this;
    this.dtOptions = {
      language: {
        url: "//cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json"
      },
      paging: true,
      search: false,
      searching: true,
      ordering: true,
      info: false,
      responsive: {
        details: {
          renderer: function (api: any, rowIdx: any, columns: any) {
            var data = $.map(columns, function (col, i) {
              return col.hidden ?
                '<tr data-dt-row="' + col.rowIndex + '" data-dt-column="' + col.columnIndex + '">' +
                '<td>' + col.title + ':' + '</td> ' +
                '<td>' + col.data + '</td>' +
                '</tr>' :
                '';
            }).join('');

            return data ?
              $('<table/>').append(data) :
              false;

          }
        },

      },

      initComplete: function () {
        $('#dtdt tbody').on('click', '.editar-icon', function () {
          console.log("editar")
          //BOTON EDITAR
          if (component.editarDetalle) {
            component.aplicarCambiosDetalle(index);
            //Despues de aplicar los cambios, cerrar el submenu que se abrio de la tabla en responsive
            $(this).closest('tr').removeClass('dt-hasChild parent');
            return
          }
          var index = $(this).closest('span').data('index');
          component.editarDetalleMovimiento(index);
          //Cambiar el icono  <fa-icon         
          $(this).html('<fa-icon class="btn-success"></fa-icon>').removeClass('btn btn-info').addClass('btn btn-success fa-check')
        });
        $('#dtdt tbody').on('click', '.delete-icon', function () {
          console.log("eliminar")

          //BOTON ELIMINAR
          var index = $(this).closest('span').data('index');
          component.eliminarDetalle(index);
          return
        });
      }
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

        //Si hay en el localStorge un proveedor seleccionado
        if (localStorage.getItem('proveedorid') != '0') {
          //Buscar el la lista lstProveedores el indice del proveedor seleccionado 
          let index = this.lstProveedores.findIndex(x => x.id == localStorage.getItem('proveedorid'));

          //Si existe el proveedor seleccionado
          this.selectedProveedor = this.lstProveedores[index].nombre;
          this.proveedorSeleccionado = true;
        }
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
        //Si hay en el localStorge un proveedor seleccionado
        //Si hay en el localStorge un proveedor seleccionado
        if (localStorage.getItem('comprobanteCompraid') != '0') {
          //   //Buscar el la lista lstProveedores el indice del proveedor seleccionado 
          let index = this.lstComprobantes.findIndex(x => x.id == localStorage.getItem('comprobanteCompraid'));


          //   //Si existe el proveedor seleccionado
          this.selectedComprobante = this.lstComprobantes[index].tipo;
          this.comprobanteCompraSeleccionado = true;


          const sustento: SustentosTributariosEntity = {
            id: '',
            etiquetas: '',
            codigo: '',
            sustento: '',
            comprobante_id: localStorage.getItem('comprobanteCompraid')!
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
              if (localStorage.getItem('sustentoid') != "0") {
                //   //Buscar el la lista lstProveedores el indice del proveedor seleccionado 
                //Concatener el codigo con el sustento y buscarlo en la lista

                //   //Buscar el la lista lstProveedores el indice del proveedor seleccionado 
                let index3 = this.lstSustentos.findIndex(x => parseInt(x.codigo) == parseInt(localStorage.getItem('sustentoid')!));

                //   //Si existe el proveedor seleccionado
                this.selectedSustento = this.lstSustentos[index3].sustento;
                this.sustentoSeleccionado = true;

              }


            }
          });




        }




      }
    });


    this.loadFormStateFromLocalStorage();
    this.buttonsDisabled = this.checkAllConditions();

    this.cargarTablaMenucompr();
    this.checkRegistros();
  }

  checkRegistros() {
    this.disableProveedor = this.lstDetalleMovimientos.length > 0;
  }

  changeGroup(tipoC: any): void {
    console.log("entro a changeGroup")
    this.proveedorSeleccionado = tipoC.target.value !== "0";
    this.buttonsDisabled = !this.checkAllConditions();
    if (tipoC.target.value == 0) {
      console.log("entro a changeGroup if 1")
      this.selectTipo = true;
      localStorage.setItem('proveedorid', '0')
      localStorage.setItem('proveedor', '')
    } else {
      console.log("entro a changeGroup else 1")
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

        console.log("entro a changeGroup if 2")

        Swal.fire({
          icon: 'error',
          title: 'No se pudo obtener la Sociedad.',
          text: res.descripcionError,
          showConfirmButton: false,
        });
      } else {
        console.log("entro a changeGroup if 3")

        localStorage.setItem('proveedorid', res.lstProveedores[0].id);
        localStorage.setItem('proveedor', tipoC.target.options[tipoC.target.selectedIndex].text);
      }
    })
  }

  changeGroup2(sustento: any): void {
    console.log("entro a changeGroup2")
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
        //Guardar el nombre del sustento seleccionado
        localStorage.setItem('sustento', sustento.target.options[sustento.target.selectedIndex].text);
      }
    })
  }

  changeGroup3(comprobanteCompra: any): void {
    console.log("entro a changeGroup3")
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

    //Guardar el comprobante seleccionado


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

        //Guardar el nombre del comprobante seleccionado
        // comprobanteCompra.target.options[comprobanteCompra.target.selectedIndex].text;
        localStorage.setItem('comprobanteCompra', comprobanteCompra.target.options[comprobanteCompra.target.selectedIndex].text);

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
      .filter((detalleMovimientos) => detalleMovimientos.tarifa === this.iva + '%')
      .reduce((total, detalleMovimientos) => {
        return total + parseFloat(detalleMovimientos.precio.replace(',', '.'));
      }, 0);
    const porcen = totalTarifa15 * (this.iva / 100);

    return totalTarifa15 + porcen;
  }

  calcularTotalTarifa15P(): number {
    const totalTarifa15 = this.lstDetalleMovimientos
      .filter((detalleMovimientos) => detalleMovimientos.tarifa === this.iva + '%')
      .reduce((total, detalleMovimientos) => {
        return total + parseFloat(detalleMovimientos.precio.replace(',', '.'));
      }, 0);

    return totalTarifa15;
  }

  calcularIva15(): number {
    const totalTarifa15 = this.lstDetalleMovimientos
      .filter((detalleMovimientos) => detalleMovimientos.tarifa === this.iva + '%')
      .reduce((total, detalleMovimientos) => {
        return total + parseFloat(detalleMovimientos.precio.replace(',', '.'));
      }, 0);
    const porcen = totalTarifa15 * (this.iva / 100);

    return porcen;
  }

  eliminarDetalle(detalle: DetallesMovimientoEntity): void {

    this.httpService.eliminarDetalleCompra(detalle).subscribe(res => {
      if (res.codigoError == 'OK') {

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

            console.log("MOvimientos ", this.lstDetalleMovimientos);

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
        ;
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
    localStorage.setItem('comprobante', JSON.stringify(event.target.value.trim()));

  }

  onInputAutorizacion(event: any) {
    this.autorizacionLlena = event.target.value.trim() !== "" && event.target.value.length == 10 || event.target.value.length == 49
    this.buttonsDisabled = !this.checkAllConditions();
    localStorage.setItem('autorizacion', JSON.stringify(event.target.value.trim()));

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

  //Metodo que agrega guion cada tres digitos y su maximo es 15
  keyPressNumbers2(event: any) {
    var charCode = (event.which) ? event.which : event.keyCode;
    // Only Numbers 0-9

    //Si ya se llego a 15 ya no deja escribir mas
    if (event.target.value.length == 17) {
      event.preventDefault();
      return false;
    }

    if ((charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    } else {
      var value = event.target.value;
      if (value.length == 3 || value.length == 7) {
        event.target.value = value + '-';
      }

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

    //Comprobar y validar que la autorizacion tenga 10 o 49 numeros
    if (this.autorizacion.length != 10 && this.autorizacion.length != 49) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'La autorización debe tener 10 (impreso) o 49 (electronico) números',
        showConfirmButton: true,
        confirmButtonText: "Ok"
      });
      return;
    }

    //Eliminar guiones de comprobante
    this.comprobante = this.comprobante.replace(/-/g, '');
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

  //Metodo keyPress que muestre una alerta debajo del input que diga que solo se pueden ingresar numeros 10 o 49
  keyPressNumbers3(event: any) {
    var charCode = (event.which) ? event.which : event.keyCode;
    // Only Numbers 0-9
    if ((charCode < 48 || charCode > 57)) {
      event.preventDefault();
      //Si no tiene 10 o 49 digitos

      return false;
    } else {
      return true;
    }
  }

  loadFormStateFromLocalStorage() {
    //Trear el id y el nombre del proveedor seleccionado
    const proveedorid = localStorage.getItem('proveedorid');
    const proveedor = localStorage.getItem('proveedor');

    const sustentoid = localStorage.getItem('sustentoid');
    const comprobanteCompraid = localStorage.getItem('comprobanteCompraid');
    const comprobante = localStorage.getItem('comprobanteCompra');
    const sustento = localStorage.getItem('sustento');


    //Obtener el proveedor del local storage y eliminar el numero del inicio hasta el guion 

    this.selectedProveedor = localStorage.getItem('proveedor') ?? '';




    const c = localStorage.getItem('autorizacion') ?? '';
    //eliminar comillas
    this.autorizacion = c.replace(/['"]+/g, '');

    const d = localStorage.getItem('comprobante') ?? '';

    this.comprobante = d.replace(/['"]+/g, '');



    //Activar boton
    this.autorizacionLlena = this.autorizacion.trim() !== "" && this.autorizacion.length == 10 || this.autorizacion.length == 49;
    this.comprobanteLleno = this.comprobante.trim() !== "";
    this.buttonsDisabled = !this.checkAllConditions();




  }


  //Limpiar el local storage los valores de los inputs
  clearLocalStorage() {
    localStorage.removeItem('proveedorid');
    localStorage.removeItem('proveedor');
    localStorage.removeItem('sustentoid');
    localStorage.removeItem('comprobanteCompraid');
    localStorage.removeItem('comprobanteCompra');
    localStorage.removeItem('compventa');
    localStorage.removeItem('autorizacion');
    localStorage.removeItem('fecha');
  }


  onFileSelected(event: any) {
    Swal.fire({
      title: 'Cargando XML...',
      text: 'Por favor espere',
      allowOutsideClick: false,
      showConfirmButton: false,
      willOpen: () => {
        Swal.showLoading();
      }
    });

    let counterCompleted = 0;
    let counterError = 0;
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const xmlString = reader.result as string;
        this.parseXML(xmlString);

        // Crear un array de promesas para todas las llamadas asíncronas
        const promises = this.lstXmlCarga.map((element) => {
          const proveedorProducto: ProveedoresProductosEntity = {
            id: '',
            provedor_id: localStorage.getItem('proveedorid')!,
            producto_id: '',
            nombre_producto: '',
            precio: element.precioUnitario!,
            costo: element.costo,
            created_at: '',
            updated_at: '',
            cod_sap: element.codigoSap,
            cantidad: element.cantidad,
          };

          return this.httpProveedorProducto.obtenerProveedoresProductosXML(proveedorProducto).toPromise()
            .then(res => {
              if (res?.codigoError != "OK") {
                counterError++;
                this.failedCodSap.push(element.codigoSap);
              } else {
                res.lstProveedoresProductos.forEach((producto) => {
                  producto.cantidad = element.cantidad;
                  producto.cod_sap = element.codigoSap;
                  producto.costo = element.costo;
                  producto.pvp2 = producto.precio;
                  producto.precio = element.precioUnitario!;

                  console.log('Producto aquiiiii', producto);

                  this.lstXmlProveedoresProductos.push(producto);
                });

                counterCompleted++;
              }
            })
            .catch(err => {
              counterError++;
              this.failedCodSap.push(element.codigoSap);
              console.error('Error fetching proveedor producto', err);
            });
        });

        // Esperar a que todas las promesas se resuelvan
        Promise.all(promises).then(() => {
          Swal.close();
          console.log(`Completed: ${counterCompleted}, Errors: ${counterError}`);


        }).then(async () => {
          try {
            //Mostrar carga
            Swal.fire({
              title: 'Creando detalles...',
              text: 'Por favor espere',
              allowOutsideClick: false,
              showConfirmButton: false,
              willOpen: () => {
                Swal.showLoading()
              },
            });

            await this.realizarAccionConDetalles(this.lstXmlProveedoresProductos).finally(() => {


              if (counterError == 0) {
                Swal.fire({
                  icon: 'success',
                  title: 'XML cargado correctamente.',
                  text: `Se han cargado ${counterCompleted} productos correctamente.`,
                  showConfirmButton: true,
                  confirmButtonText: "Ok"
                }).finally(() => {
                  this.cargarTablaMenucompr();
                })
              } else {
                Swal.fire({
                  icon: 'warning',
                  title: 'XML cargado correctamente.',
                  text: `Se han cargado ${counterCompleted} productos correctamente y ${counterError} productos no se han podido cargar.
              Los productos que no se han podido cargar son: ${this.failedCodSap.join(', ')}`,
                  showConfirmButton: true,
                  confirmButtonText: "Ok"
                }).finally(() => {
                  this.cargarTablaMenucompr();
                })
              }

            });
            console.log('Detalles creados y página recargada');


          } catch (err) {
            console.error('Error creating details', err);
          }
        }).catch(err => {
          console.error('Error creating details', err);
        })


      };
      reader.readAsText(file);
    }
  }



  async realizarAccionConDetalles(detalles: ProveedoresProductosEntity[]): Promise<void> {



    try {
      for (const detalle of detalles) {
        await this.crearDetalle(detalle);
      }
      Swal.fire({
        icon: 'success',
        title: 'Detalles creados con éxito',
        showConfirmButton: true,
      }).then(() => {
        this.router.navigate(['/navegation-cl', { outlets: { contentClient: ['menucompr'] } }]);
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Error al crear detalles',
        text: "error",
        showConfirmButton: true,
      });
    }
  }


  crearDetalle(proveedorProducto: ProveedoresProductosEntity): Promise<void> {
    return new Promise((resolve, reject) => {
      this.httpServiceProvProd.asignarProveedorProducto(proveedorProducto);
      this.httpServiceProvProd.obtenerProveedorProducto$.pipe(take(1)).subscribe((res) => {
        if (res.producto_id == '') {
          Swal.fire({
            icon: 'error',
            title: 'Ha ocurrido un error.',
            text: 'No se ha obtenido información.',
            showConfirmButton: false,
          }).finally(() => {
            this.router.navigate([
              '/navegation-cl',
              { outlets: { contentClient: ['menucompr'] } },
            ]);
            reject(new Error('No se ha obtenido información.'));
          });
        } else {
          //Asignamos los valores a los campos
          this.costo = proveedorProducto.costo;
          this.costo2 = proveedorProducto.costo;
          this.precio = proveedorProducto.precio;

          const newInventario: InventariosEntity = {
            categoria_id: '',
            categoria: '',
            linea: '',
            modelo: '',
            marca_id: '',
            marca: '',
            modelo_producto_id: '',
            idProducto: '',
            Producto: '',
            id: '',
            etiquetas: res.etiquetas,
            dInventario: '',
            producto_id: proveedorProducto.producto_id,
            almacen_id: localStorage.getItem('almacenid')!,
            almacen: '',
            stock_optimo: '',
            fav: '0',
            costo: proveedorProducto.precio,
            color: '',
            stock: proveedorProducto.cantidad!,
            pvp2: proveedorProducto.pvp2,
          };

          this.httpServiceInventario.obtenerInventariosExiste(newInventario).subscribe(res1 => {
            if (res1.codigoError == 'NEXISTE') {

              console.log('ENTRO A NEXISTEEEEE0000000000000000000000000000');

              this.httpServiceInventario.agregarInventario(newInventario).pipe(
                finalize(() => {
                  this.httpServiceInventario.obtenerInventariosExiste(newInventario).subscribe(res5 => {
                    const newDetalle: DetallesMovimientoEntity = {
                      id: '',
                      producto_nombre: '',
                      inventario_id: res5.lstInventarios[0].id,
                      producto_id: proveedorProducto.producto_id,
                      movimiento_id: JSON.parse(localStorage.getItem('movimiento_id') || "[]"),
                      cantidad: proveedorProducto.cantidad!,
                      costo: proveedorProducto.precio,
                      precio: proveedorProducto.costo!
                    };


                    this.httpServiceDetalle.agregarDetalleCompra(newDetalle).pipe(finalize(() => {
                      this.httpServiceDetalle.obtenerUltDetalleMovimiento(newDetalle).subscribe(res1 => {
                        if (res1.codigoError == 'OK') {
                          const newDetalleImp: DetalleImpuestosEntity = {
                            id: '',
                            detalle_movimiento_id: res1.lstDetalleMovimientos[0].id,
                            cod_impuesto: res1.lstDetalleMovimientos[0].codigo_impuesto!,
                            codigo_tarifa: res1.lstDetalleMovimientos[0].cod_tarifa!,
                            porcentaje: res1.lstDetalleMovimientos[0].tarifa!,
                            base_imponible: '',
                            valor: res1.lstDetalleMovimientos[0].costo!,
                            created_at: '',
                            updated_at: ''
                          };
                          this.httpServiceDetalleImp.agregarDetalleImpuestos(newDetalleImp).subscribe(res2 => {
                            if (res2.codigoError != 'OK') {
                              Swal.fire({
                                icon: 'error',
                                title: 'Ha ocurrido un error.',
                                text: res2.descripcionError,
                                showConfirmButton: false
                              });
                            }
                          });
                        }
                      });
                    })).subscribe(res4 => {
                      if (res4.codigoError != 'OK') {
                        Swal.fire({
                          icon: 'error',
                          title: 'Ha ocurrido un error.',
                          text: 'La cantidad no puede ser vacía',
                          showConfirmButton: false
                        });
                        reject(new Error('La cantidad no puede ser vacía'));
                      } else {
                        resolve();
                      }
                    });
                  });
                })
              ).subscribe(res2 => {
                if (res2.codigoError != 'OK') {
                  Swal.fire({
                    icon: 'error',
                    title: 'Ha ocurrido un error.',
                    text: res2.descripcionError,
                    showConfirmButton: false
                  });
                  reject(new Error(res2.descripcionError));
                } else {
                  resolve();
                }
              });
            } else if (res1.codigoError == 'OK') {
              console.log('ENTRO A EXISTE 12911110000000000000000000');

              this.costoStatic = res1.lstInventarios[0].costo;
              this.stockStatic = res1.lstInventarios[0].stock;
              const oper1 = parseFloat(res1.lstInventarios[0].costo!) * parseFloat(res1.lstInventarios[0].stock!);
              const oper2 = parseFloat(proveedorProducto.cantidad!) * parseFloat(proveedorProducto.costo!);
              const nuevoCosto = (oper1 + oper2) / (parseFloat(res1.lstInventarios[0].stock!) + parseFloat(proveedorProducto.cantidad!));
              const inventarioCosto: InventariosEntity = {
                categoria_id: '',
                categoria: '',
                linea: '',
                modelo: '',
                marca_id: '',
                marca: '',
                modelo_producto_id: '',
                idProducto: '',
                Producto: '',
                costo: nuevoCosto.toString(),
                id: res1.lstInventarios[0].id,
                dInventario: '',
                producto_id: '',
                almacen_id: '',
                almacen: '',
                stock_optimo: '',
                fav: '',
                color: ''
              };
              this.httpServiceInventario.actualizarCosto(inventarioCosto).subscribe(resC => {
                if (resC.codigoError != 'OK') {
                  Swal.fire({
                    icon: 'error',
                    title: 'Ha ocurrido un error.',
                    text: resC.descripcionError,
                    showConfirmButton: false
                  });
                  reject(new Error(resC.descripcionError));
                } else {
                  resolve();
                }
              });
              const newDetalle: DetallesMovimientoEntity = {
                id: '',
                producto_nombre: '',
                inventario_id: res1.lstInventarios[0].id,
                producto_id: proveedorProducto.producto_id,
                movimiento_id: JSON.parse(localStorage.getItem('movimiento_id') || "[]"),
                cantidad: proveedorProducto.cantidad!,
                costo: proveedorProducto.precio!,
                precio: proveedorProducto.costo!
              };

              if (!proveedorProducto.productoExistente) {
                if (proveedorProducto.cantidad == "0") {
                  Swal.fire({
                    icon: 'error',
                    title: 'No se puede agregar 0',
                    text: "La cantidad no puede ser 0",
                    showConfirmButton: false
                  });
                  reject(new Error('La cantidad no puede ser 0'));
                }
                this.httpServiceDetalle.agregarDetalleCompras(newDetalle).pipe(finalize(() => {
                  this.httpServiceDetalle.obtenerUltDetalleMovimiento(newDetalle).subscribe(res1 => {
                    if (res1.codigoError == 'OK') {
                      const newDetalleImp: DetalleImpuestosEntity = {
                        id: '',
                        detalle_movimiento_id: res1.lstDetalleMovimientos[0].id,
                        cod_impuesto: res1.lstDetalleMovimientos[0].codigo_impuesto!,
                        codigo_tarifa: res1.lstDetalleMovimientos[0].cod_tarifa!,
                        porcentaje: res1.lstDetalleMovimientos[0].tarifa!,
                        base_imponible: '',
                        valor: res1.lstDetalleMovimientos[0].costo!,
                        created_at: '',
                        updated_at: ''
                      };
                      this.httpServiceDetalleImp.agregarDetalleImpuestos(newDetalleImp).subscribe(res2 => {
                        if (res2.codigoError != 'OK') {
                          Swal.fire({
                            icon: 'error',
                            title: 'Ha ocurrido un error.',
                            text: res2.descripcionError,
                            showConfirmButton: false
                          });
                          reject(new Error(res2.descripcionError));
                        } else {
                          resolve();
                        }
                      });
                    } else {
                      resolve();
                    }
                  });
                })).subscribe(res3 => {
                  if (res3.codigoError != 'OK') {
                    Swal.fire({
                      icon: 'error',
                      title: 'Ha ocurrido un error.',
                      text: 'La cantidad no puede ser vacía',
                      showConfirmButton: false
                    });
                    reject(new Error('La cantidad no puede ser vacía'));
                  } else {
                    resolve();
                  }
                });
              } else {
                if (proveedorProducto.cantidad! != '0') {
                  newDetalle.precio = (parseFloat(newDetalle.cantidad!) * parseFloat(newDetalle.costo!)).toString();

                  console.log("ESTE ES EL nuevo precio ", newDetalle.precio)
                  console.log(newDetalle);

                  this.httpServiceDetalle.modificarDetallePedidoVenta(newDetalle).subscribe(res => {
                    if (res.codigoError == 'OK') {
                      resolve();
                    } else {
                      reject(new Error(res.descripcionError));
                    }
                  });
                } else {
                  this.httpServiceDetalle.eliminarDetallePedidoVenta(newDetalle).subscribe(res => {
                    resolve();
                  });
                }
              }
            }
          });
        }
      });
    });
  }

  parseXML(xmlString: string) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'application/xml');

    // Asegurarse de que no hay errores en el parsing
    const parserError = xmlDoc.getElementsByTagName('parsererror');
    if (parserError.length) {
      console.error('Error parsing XML', parserError[0].textContent);
      return;
    }

    const getTextContent = (tagName: string) => {
      const elements = xmlDoc.getElementsByTagName(tagName);
      return elements.length ? elements[0].textContent : '';
    };

    const cdataContent = getTextContent('comprobante');

    if (cdataContent) {
      const cdataDoc = parser.parseFromString(cdataContent, 'application/xml');
      this.ruc = this.getTextContentFromElement(cdataDoc, 'ruc');

      // Extraer todos los códigos principales
      const detalles = cdataDoc.getElementsByTagName('detalle');
      this.codigosPrincipales = [];
      for (let i = 0; i < detalles.length; i++) {
        const codigo = this.getTextContentFromElement(detalles[i], 'codigoPrincipal')
        const cantidad = this.getTextContentFromElement(detalles[i], 'cantidad')
        const costo = this.getTextContentFromElement(detalles[i], 'precioTotalSinImpuesto')
        const descuento = this.getTextContentFromElement(detalles[i], 'descuento')
        const precioUnitario = this.getTextContentFromElement(detalles[i], 'precioUnitario')

        //Crear XmlCargaEntity
        const xmlCarga: XmlCargaEntity = {
          codigoSap: codigo!,
          cantidad: cantidad!,
          costo: costo!,
          descuento: descuento!,
          precioUnitario: precioUnitario!
        }




        if (xmlCarga) {
          this.lstXmlCarga.push(xmlCarga);
        }
      }
    }




    console.log('RUC:', this.ruc);
    console.log('Items:', this.detalle);
    console.log('Códigos Principales:', this.lstXmlCarga);



  }

  getTextContentFromElement(element: Element | Document, tagName: string): string | null {
    const elements = element.getElementsByTagName(tagName);
    return elements.length ? elements[0].textContent : '';
  }
}

