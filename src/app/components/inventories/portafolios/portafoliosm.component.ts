import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { InventariosEntity } from 'src/app/models/inventarios';
import { PortafoliosM, PortafoliosEntity } from 'src/app/models/portafoliosm';
import { PortafoliosMService } from 'src/app/services/portafoliosm.service';
import { InventariosService } from 'src/app/services/inventarios.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-portafolios',
  templateUrl: './portafoliosm.component.html',
  styleUrls: ['./portafoliosm.component.css']
})

export class PortafoliosComponentM implements OnInit {
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  lstPortafoliosm: PortafoliosEntity[] = [];

  constructor(
    private readonly httpService: PortafoliosMService,
    private router: Router) { 

  }
  
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
    this.httpService.ObtenerPortafolioM().subscribe(res => {
      if (res.codigoError != "OK") {
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error.',
          text: res.descripcionError,
          showConfirmButton: false,
        });
      } else {
        this.lstPortafoliosm = res.lstPortafolios;
        this.dtTrigger.next('');
        console.log(res);
        this.Portafolios()
      }
      
      Swal.fire({
        icon: 'info',
        title: 'Carga Masiva realizada con EXITO.',
        text: `Se ha cargado los Portafolios`,
        showConfirmButton: true,
        confirmButtonText: "Ok"
      }).finally(() => {
        this.router.navigate(['/navegation-adm', { outlets: { 'contentAdmin': ['productos'] } }]);
      })   
    });
  }

  Portafolios(){
    const portafolios = this.lstPortafoliosm;
    portafolios.forEach((valor) => {
      const inventario : InventariosEntity={
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
        producto_id: valor.materialid,
        almacen_id: valor.almacenid,
        almacen: '',
        stock : valor.stock,
        stock_optimo: '',
        fav: '',
        color: '',
        etiquetas : valor.materialnombre
      }
      console.log(valor);
      this.httpService.obtenerPortafoliosInventarios(inventario).subscribe(res => {
        if (res.codigoError != "OK") {
          const inventarionew : InventariosEntity={
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
            producto_id: valor.materialid,
            almacen_id: valor.almacenid,
            almacen: '',
            stock: valor.stock,
            stock_optimo: '',
            fav: '',
            color: '',
            costo: valor.costo,
            pvp1 : valor.pvp1,
            pvp2 : valor.pvp1,
            pvp_sugerido: valor.pvp_sugerido,
            cod_principal : '',
            cod_secundario : '',
            etiquetas: valor.materialnombre,
          }
          
          this.httpService.agregarInventario(inventarionew).subscribe(res =>{
            if (res.codigoError != "OK") {
              Swal.fire({
                icon: 'error',
                title: 'Ha ocurrido un error.',
                text: res.descripcionError,
                showConfirmButton: false,
              });
            } else {
              console.log("NUEVO")
            }
          })

        } else {
          const inventarios = res.lstInventarios;
          inventarios.forEach((value) => {
            const inventarionew : InventariosEntity={
              categoria_id: '',
              categoria: '',
              linea: '',
              modelo: '',
              marca_id: '',
              marca: '',
              modelo_producto_id: '',
              idProducto: '',
              Producto: '',
              id: value.id,
              dInventario: '',
              producto_id: valor.materialid,
              almacen_id: valor.almacenid,
              almacen: '',
              stock: (parseInt (value.stock!) + parseInt (valor.stock!)).toString(),
              stock_optimo: '',
              fav: '',
              color: '',
              costo: valor.costo,
              pvp2 : valor.pvp1,
              pvp_sugerido: valor.pvp_sugerido,
              cod_principal : '',
              cod_secundario : '',
              etiquetas : valor.materialnombre
            }
            this.httpService.actualizarInventarios(inventarionew).subscribe(res => {
              if (res.codigoError != "OK") {
                Swal.fire({
                  icon: 'error',
                  title: 'Ha ocurrido un error.',
                  text: res.descripcionError,
                  showConfirmButton: false,
                });
              } else {
                console.log("ACTUALIZACION")
              }
            
            })
          });
        }
      }); 
    });
  }
}
