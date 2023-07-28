import { ContentObserver } from '@angular/cdk/observers';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ProductosCompraEntity } from 'src/app/models/productocompras';
import { ProveedoresProductosEntity } from 'src/app/models/proveedoresproductos';
import { ProductoComprasService } from 'src/app/services/productocompras.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-productocompra',
  templateUrl: './productocompra.component.html',
  styleUrls: ['./productocompra.component.css']
})
export class ProductocompraComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  lstProductoscompras: ProductosCompraEntity[] = [];
  lstProveedoresProducto : ProveedoresProductosEntity[] = []
  constructor(private readonly httpService: ProductoComprasService,
    private router: Router) { }


  ngOnInit(): void {
    this.dtOptions = {
      language: {
        url: "//cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json"
      },
      paging: true,
      pageLength:100,
      search: false,
      searching: true,
      ordering: true,
      info: true,
      responsive: true
    }
    this.httpService.ObtenerProductosCompras().subscribe(res => {
      if (res.codigoError != "OK") {
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error.',
          text: res.descripcionError,
          showConfirmButton: false,
        });
      } else {
        this.lstProductoscompras = res.lstProductos_Compra;
        this.dtTrigger.next('');
        //console.log(res);
        this.ProductosCompras()
      }
      /*
      Swal.fire({
        icon: 'info',
        title: 'Carga Masiva realizada con EXITO.',
        text: `Se ha cargado los Portafolios`,
        showConfirmButton: true,
        confirmButtonText: "Ok"
      }).finally(() => {
        this.router.navigate(['/navegation-adm', { outlets: { 'contentAdmin': ['productos'] } }]);
      })  */
    });
  }

  ProductosCompras(){
    const productoscompras = this.lstProductoscompras;
    productoscompras.forEach((valor) => {
      const proveedoresproducto : ProveedoresProductosEntity ={
        id: '',
        provedor_id: valor.proveedorid!,
        producto_id: valor.productoid!,
        nombre_producto: valor.nombre_producto,
        precio: valor.precio,
        created_at: '',
        updated_at: ''
      }
      this.httpService.obtenerProductosProveedor(proveedoresproducto).subscribe(res=>{
        if (res.codigoError != "OK") {
          //CREAR
          const proveedoresproductonew : ProveedoresProductosEntity ={
            id: '',
            provedor_id: valor.proveedorid!,
            producto_id: valor.productoid!,
            nombre_producto: valor.nombre_producto,
            precio: valor.precio,
            created_at: '',
            updated_at: ''
          }
          this.httpService.agregarProductosProveedor(proveedoresproductonew).subscribe(res=>{
            if (res.codigoError != "OK") {
              Swal.fire({
                icon: 'error',
                title: 'Ha ocurrido un error.',
                text: res.descripcionError,
                showConfirmButton: false,
              });
            } else {
              console.log("NUEVO PROVEEDOR PRODUCTO");

            }
          })
        } else {
          //ACTUALIZAR
          this.lstProveedoresProducto = res.lstProveedoresProductos;
          const productocompras = this.lstProveedoresProducto
          productocompras.forEach((value) => {
            const proveedoresproductonew : ProveedoresProductosEntity ={
              id: value.id,
              provedor_id: valor.proveedorid!,
              producto_id: valor.productoid!,
              nombre_producto: valor.nombre_producto,
              precio: valor.precio,
              created_at: '',
              updated_at: ''
            }
            this.httpService.actualizarProductosProveedor(proveedoresproductonew).subscribe(res=>{
              if (res.codigoError != "OK") {
                Swal.fire({
                  icon: 'error',
                  title: 'Ha ocurrido un error.',
                  text: res.descripcionError,
                  showConfirmButton: false,
                });
              } else {
                console.log("ACTUALIZADO PROVEEDOR PRODUCTO");
  
              }
            })
          });
        }
      })
    });
  }
}
