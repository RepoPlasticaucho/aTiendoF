import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { faList, faEdit, faTrashAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import { AlmacenesService } from 'src/app/services/almacenes.service';
import { DataTableDirective } from 'angular-datatables';
import Swal from 'sweetalert2';
import { Subject } from 'rxjs';
import { AlmacenesEntity } from 'src/app/models/almacenes';
import { InventariosService } from 'src/app/services/inventarios.service';
import { InventariosEntity } from 'src/app/models/inventarios';
import { Router } from '@angular/router';

@Component({
  selector: 'app-movimiento-inventarios',
  templateUrl: './movimiento-inventarios.component.html',
  styleUrls: ['./movimiento-inventarios.component.css']
})
export class MovimientoInventariosComponent implements OnInit {

  faList = faList;
  faEdit = faEdit;
  faTrashAlt = faTrashAlt;
  faPlus = faPlus;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  lstAlmacenes: AlmacenesEntity[] = [];
  lstInventarios: InventariosEntity[] = [];
  almacenMover: string = '';
  

  filtroForm = new FormGroup({
    almacen: new FormControl('0')
  });

  constructor(private readonly httpServiceAlm: AlmacenesService,
              private readonly httpServiceInventarios: InventariosService,
              private readonly router:Router) { }

  ngOnInit(): void {
    const component = this;
    let cantidadAux = '';
    let inventarioAux: InventariosEntity = {
      categoria_id: '',
      categoria: '',
      linea: '',
      modelo: '',
      marca_id: '',
      marca: '',
      stock: '',
      modelo_producto_id: '',
      idProducto: '',
      Producto: '',
      id: '',
      dInventario: '',
      producto_id: '',
      almacen_id: '',
      almacen: '',
      stock_optimo: '',
      fav: '',
      color: ''
    }
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
      responsive:  {
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

          inventarioAux = component.lstInventarios[rowIdx];


          return data ?
          $('<table/>').append(data) :
          false;
        
          }
        },
        },

        initComplete: function () {
          $('#dtdt tbody').on('input', 'input', function () {
            // Obtener el valor actual del input
            cantidadAux = $(this).val() + ""
            inventarioAux.cantidad = cantidadAux;
            component.lstInventarios.find(x => x.id === inventarioAux.id)!.cantidad = cantidadAux;
            component.moverInventario();
        });
      }
    }
    const almacenNew: AlmacenesEntity = {
      idAlmacen: localStorage.getItem('almacenid')!,
      sociedad_id: localStorage.getItem('sociedadid')!,
      nombresociedad: '',
      direccion: '',
      telefono: '',
      codigo: '',
      pto_emision: ''
    }
    this.httpServiceAlm.obtenerAlmacenesEsp(almacenNew).subscribe(res => {
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
      html: 'Se están cargando los productos.',
      timer: 30000,
      didOpen: () => {
        Swal.showLoading();
        const almacenNew: AlmacenesEntity = {
          idAlmacen: localStorage.getItem('almacenid')!,
          sociedad_id: '',
          nombresociedad: '',
          direccion: '',
          telefono: '',
          codigo: '',
          pto_emision: '',
        };
        this.httpServiceInventarios.obtenerPortafolios(almacenNew).subscribe((res1) => {
          console.log(res1)
          if (res1.codigoError != 'OK') {
            Swal.fire({
              icon: 'error',
              title: 'No se pudo obtener los productos.',
              text: res1.descripcionError,
              showConfirmButton: false,
            });
          } else {
            this.lstInventarios = res1.lstInventarios;
            this.dtTrigger.next('');
            Swal.close();
          }
        });
      },
    }).then((result) => {
      if (result.dismiss === Swal.DismissReason.timer) {
        console.log('I was closed by the timer');
      }
    });
  }

  changeGroup(alm: any): void {
    const newAlm: AlmacenesEntity = {
      idAlmacen: '',
      sociedad_id: localStorage.getItem('sociedadid')!,
      nombresociedad: '',
      direccion: '',
      telefono: '',
      codigo: '',
      nombre_almacen: alm.target.value,
      pto_emision: ''
    }
    this.httpServiceAlm.obtenerAlmacenN(newAlm).subscribe(res => {
      if(res.codigoError == 'OK'){
        this.almacenMover = res.lstAlmacenes[0].idAlmacen;
      }
    })
  }

  moverInventario(){
    for (const inventario of this.lstInventarios) {
      if(inventario.cantidad !== undefined && inventario.cantidad !== '' && inventario.cantidad != '0'){

        if(this.parseInt(inventario.cantidad) <= this.parseInt(inventario.stock!)){
          const newInv: InventariosEntity = {
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
            dInventario: '',
            producto_id: inventario.producto_id!,
            almacen_id: this.almacenMover,
            almacen: '',
            stock_optimo: '',
            fav: '',
            color: ''
          }
          console.log(newInv)
          this.httpServiceInventarios.obtenerInventariosAlm(newInv).subscribe(res => {
            console.log(res)
            if(res.codigoError == 'OK'){
              const actInv: InventariosEntity = {
                categoria_id: '',
                categoria: '',
                linea: '',
                modelo: '',
                marca_id: '',
                marca: '',
                stock: (this.parseInt(res.lstInventarios[0].stock!) + this.parseInt(inventario.cantidad!)).toString(),
                modelo_producto_id: '',
                idProducto: '',
                Producto: '',
                id: res.lstInventarios[0].id,
                dInventario: '',
                producto_id: '',
                almacen_id: '',
                almacen: '',
                stock_optimo: '',
                fav: '',
                color: ''
              }
              this.httpServiceInventarios.actualizarInventarioEx(actInv).subscribe(res1 => {
                console.log(res1)
                if(res1.codigoError == 'OK'){
                  const actInvRes: InventariosEntity = {
                    categoria_id: '',
                    categoria: '',
                    linea: '',
                    modelo: '',
                    marca_id: '',
                    marca: '',
                    stock: (this.parseInt(inventario.stock!) - this.parseInt(inventario.cantidad!)).toString(),
                    modelo_producto_id: '',
                    idProducto: '',
                    Producto: '',
                    id: inventario.id,
                    dInventario: '',
                    producto_id: '',
                    almacen_id: '',
                    almacen: '',
                    stock_optimo: '',
                    fav: '',
                    color: ''
                  }
                  this.httpServiceInventarios.actualizarInventarioEx(actInvRes).subscribe(res2 => {
                    console.log(res2)
                    if(res2.codigoError == 'OK'){
                      if((this.parseInt(inventario.stock!) - this.parseInt(inventario.cantidad!)).toString() == '0'){
                        const sinc: InventariosEntity = {
                          categoria_id: '',
                          categoria: '',
                          linea: '',
                          modelo: '',
                          marca_id: '',
                          marca: '',
                          stock: '',
                          modelo_producto_id: '',
                          idProducto: '',
                          Producto: '',
                          id: inventario.id,
                          dInventario: '',
                          producto_id: '',
                          almacen_id: '',
                          almacen: '',
                          stock_optimo: '',
                          fav: '',
                          color: ''
                        }
                        this.httpServiceInventarios.actualizarSinc(sinc).subscribe(res3 => {
                          if(res3.codigoError == 'OK'){
                            console.log('Bandera cambiada')
                          }
                        });   
                      }
                      Swal.fire({
                        icon: 'success',
                        title: 'Se han movido los productos al almacén',
                        text: `Se ha cambiado la cantidad`,
                        showConfirmButton: true,
                      }).then((result) => {
                        if (result.isConfirmed) {
                          this.router.navigate(['/navegation-cl', { outlets: { 'contentClient': ['movimiento-inventario'] } }]);
                        }
                      });
                    }
                  });
                }
              });
            } else {
              // En el caso de que el inventario no exista en el almacén al que se quiere llevar.
              const insInv: InventariosEntity = {
                categoria_id: '',
                categoria: '',
                linea: '',
                modelo: '',
                marca_id: '',
                pvp_sugerido: inventario.pvp_sugerido,
                marca: '',
                pvp1: inventario.pvp1,
                pvp2: inventario.pvp2,
                costo: inventario.costo,
                stock: inventario.cantidad,
                modelo_producto_id: '',
                idProducto: '',
                Producto: '',
                etiquetas: inventario.etiquetas,
                id: '',
                dInventario: '',
                producto_id: inventario.producto_id,
                almacen_id: this.almacenMover,
                almacen: '',
                stock_optimo: '',
                fav: inventario.fav,
                color: ''
              }
              this.httpServiceInventarios.agregarInventario(insInv).subscribe(res2 => {
                if(res2.codigoError == 'OK') {
                  const actInvRes: InventariosEntity = {
                    categoria_id: '',
                    categoria: '',
                    linea: '',
                    modelo: '',
                    marca_id: '',
                    marca: '',
                    stock: (this.parseInt(inventario.stock!) - this.parseInt(inventario.cantidad!)).toString(),
                    modelo_producto_id: '',
                    idProducto: '',
                    Producto: '',
                    id: inventario.id,
                    dInventario: '',
                    producto_id: '',
                    almacen_id: '',
                    almacen: '',
                    stock_optimo: '',
                    fav: '',
                    color: ''
                  }
                  console.log(actInvRes)
                  this.httpServiceInventarios.actualizarInventarioEx(actInvRes).subscribe(res2 => {
                    if(res2.codigoError == 'OK'){
                      console.log('CORRECTO4')
                      if((this.parseInt(inventario.stock!) - this.parseInt(inventario.cantidad!)).toString() == '0'){
                        const sinc: InventariosEntity = {
                          categoria_id: '',
                          categoria: '',
                          linea: '',
                          modelo: '',
                          marca_id: '',
                          marca: '',
                          stock: '',
                          modelo_producto_id: '',
                          idProducto: '',
                          Producto: '',
                          id: inventario.id,
                          dInventario: '',
                          producto_id: '',
                          almacen_id: '',
                          almacen: '',
                          stock_optimo: '',
                          fav: '',
                          color: ''
                        }
                        this.httpServiceInventarios.actualizarSinc(sinc).subscribe(res3 => {
                          if(res3.codigoError == 'OK'){
                            console.log('Bandera cambiada')
                          }
                        });
                      }
                      Swal.fire({
                        icon: 'success',
                        title: 'Se han movido los productos al almacén',
                        text: `Se ha cambiado la cantidad`,
                        showConfirmButton: true,
                        confirmButtonText: 'Ok',
                      }).then((result) => {
                        if (result.isConfirmed) {
                          window.location.reload();
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'La cantidad ingresada no es válida.',
            showConfirmButton: false,
          });
          inventario.cantidad = '';
        }
        
      }
    }
  }

  onInput(event: any) {
    const inputValue = event.target.value;
    event.target.value = inputValue.replace(/[^0-9]/g, ''); // Filtra solo números
  }

  parseInt(value: string): number {
    return parseInt(value, 10);
  }
  


}
