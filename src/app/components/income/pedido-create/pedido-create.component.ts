import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { faSave, faList, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { ModeloProductosEntity } from 'src/app/models/modeloproductos';
import { ModelosEntity } from 'src/app/models/modelos';
import { ModeloproductosService } from 'src/app/services/modeloproductos.service';
import { ModelosService } from 'src/app/services/modelos.service';
import Swal from 'sweetalert2';
import { CategoriasEntity } from 'src/app/models/categorias';
import { CategoriasService } from 'src/app/services/categorias.service';
import { LineasEntity } from 'src/app/models/lineas';
import { LineasService } from 'src/app/services/lineas.service';
import { InventariosEntity } from 'src/app/models/inventarios';
import { InventariosService } from 'src/app/services/inventarios.service';
import { MatDialogRef } from '@angular/material/dialog';
import { PedidoprovComponent } from '../pedidoprov/pedidoprov.component';

@Component({
  selector: 'app-pedido-create',
  templateUrl: './pedido-create.component.html',
  styleUrls: ['./pedido-create.component.css']
})
export class PedidoCreateComponent implements OnInit {

  //Iconos para la pagina de grupos
  faList = faList;
  faTimes = faTimes;
  faSave = faSave;

  ped = 'ped';
  dev = 'dev';
  //Creación de la variable para formulario
  pedidoForm = new FormGroup({
    categoria: new FormControl('0', Validators.required),
    tipo: new FormControl('0', Validators.required),
    motivo: new FormControl('0', Validators.required)
  });

  lstCategorias: CategoriasEntity[] = [];
  selectCategoria: boolean = false;

  selectTipo: boolean = false;

  /*
  lstMotivos: ModelosEntity[] = [];
  lstMotivos2: ModelosEntity[] = [];
  */
  selectMotivo: boolean = false;

  constructor(private readonly httpServiceModelos: ModelosService,
    private readonly httpService: ModeloproductosService,
    private readonly httpServiceCategorias: CategoriasService,
    private readonly httpServiceInventarios: InventariosService,
    private readonly httpServiceLineas: LineasService,
    private router: Router,
    private dialogRef: MatDialogRef<PedidoprovComponent>) { }

  ngOnInit(): void {
    this.httpServiceCategorias.obtenerCategorias().subscribe(res => {
      if (res.codigoError != "OK") {
        Swal.fire({
          icon: 'error',
          title: 'No se pudo obtener la Sociedad.',
          text: res.descripcionError,
          showConfirmButton: false,
        });
      } else {
        this.lstCategorias = res.lstCategorias;
      }
    });
  }

  cerrarDialog(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    /*
    console.log(this.pedidoForm.value);
    console.log(this.pedidoForm.valid);
    if (!this.pedidoForm.valid) {
      this.pedidoForm.markAllAsTouched();
      console.log("Error");
    } else {
      const inventario: InventariosEntity = {
        categoria_id : '',
        categoria : '',
        linea_id : '',
        linea : '',
        modelo_id : '',
        modelo : '',
        marca_id : '',
        marca : '',
        modelo_producto_id : '',
        idProducto : '',
        Producto : '',
        id : '',
        dInventario : '',
        producto_id : '',
        almacen_id : JSON.parse(localStorage.getItem('almacenid') || "[]"),
        almacen : '',
        stock : '',
        etiquetas: '',
        stock_optimo : '',
        fav : '',
        color : '',
      }
      console.log(inventario);

      this.httpServiceInventarios.agregarInventario(inventario).subscribe(res => {
        if (res.codigoError == "OK") {
          Swal.fire({
            icon: 'success',
            title: 'Guardado Exitosamente.',
            text: `Se ha creado el inventario`,
            showConfirmButton: true,
            confirmButtonText: "Ok"
          }).finally(() => {
            this.router.navigate(['/navegation-cl', { outlets: { 'contentClient': ['inventarios'] } }]);
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
    */

   //  this.router.navigate(['/navegation-cl', { outlets: { 'contentClient': ['vistamarcas'] } }]);
   // this.dialogRef.close();

  }

  changeGroup1(e: any) {

    if (e.target.value == 0) {
      this.selectCategoria = true;
    } else {
      this.selectCategoria = false;
    }
    if (e.target.value == null || undefined) {
      
    } else {
      const categoria: CategoriasEntity = {
        id: '',
        categoria: e.target.value,
        cod_sap: '',
        etiquetas: '',
        almacen_id: '',
      }
      this.httpServiceLineas.obtenerLineasCategoriaAdm(categoria).subscribe(res => {
        console.log(res);
        if (res.codigoError != "OK") {
          Swal.fire({
            icon: 'error',
            title: 'No se pudo obtener las líneas.',
            text: res.descripcionError,
            showConfirmButton: false,
          });

        } else {

        }
      })
    }
  }
  changeGroup2(e: any) {

    if (e.target.value == 0) {
      this.selectTipo = true;
    } else {
      this.selectTipo = false;
    }
    if (e.target.value == null || undefined) {

    } else {
      const linea: LineasEntity = {
        id: '',
        categoria_id: '',
        categoria_nombre: '',
        linea: e.target.value,
        etiquetas: '',
        cod_sap: '',
        almacen_id: ''
      }
      this.httpServiceModelos.obtenerModelosLineasAdm(linea).subscribe(res => {
        if (res.codigoError != "OK") {
          Swal.fire({
            icon: 'error',
            title: 'No se pudo obtener las líneas.',
            text: res.descripcionError,
            showConfirmButton: false,
          });

        } else {

        }
      })
    }
  }

  changeGroup3(modelo: any): void {
    if (modelo.target.value == 0) {
      this.selectMotivo = true;
    } else {
      this.selectMotivo = false;

      // Obtener ID del modelo
      //this.selectedModeloProducto = modelo.target.value;
      const modelonew: ModeloProductosEntity = {
        id: '',
        marca_id: '',
        marca: '',
        modelo_id: '',
        modelo: modelo.target.value,
        categoria: '',
        linea: '',
        color_id: '',
        color: '',
        atributo_id: '',
        atributo: '',
        genero_id: '',
        genero: '',
        modelo_producto: '',
        cod_sap: '',
        cod_familia: '',
        etiquetas: '',
        url_image: ''
      }
      console.log(modelonew);
      this.httpService.obtenerModeloProductosModelosAdm(modelonew).subscribe((res) => {
        console.log(res);
        if (res.codigoError != 'OK') {
          Swal.fire({
            icon: 'error',
            title: 'No se pudo obtener Modelos.',
            text: res.descripcionError,
            showConfirmButton: false,
          });

        } else {

        }
      });

    }
  }
}
