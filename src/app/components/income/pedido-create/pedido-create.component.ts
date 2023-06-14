import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { faSave, faList, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CategoriasEntity } from 'src/app/models/categorias';
import { CategoriasService } from 'src/app/services/categorias.service';
import { MatDialogRef } from '@angular/material/dialog';
import { PedidoprovComponent } from '../pedidoprov/pedidoprov.component';
import { MovimientosEntity } from 'src/app/models/movimientos';
import { MovimientosService } from 'src/app/services/movimientos.service.ts.service';

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

  constructor(private readonly httpService: MovimientosService,
    private readonly httpServiceCategorias: CategoriasService,
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
    console.log(this.pedidoForm.valid);
    if (!this.pedidoForm.valid) {
      this.pedidoForm.markAllAsTouched();
      console.log("Error");
    } else {
      const newMovimiento: MovimientosEntity = {
        almacen_id: JSON.parse(localStorage.getItem('almacenid') || "[]"),
        id: '',
        tipo_id: '1',
        tipo_emision_cod: '',
        estado_fact_id: '1',
        tipo_comprb_id: '7',
        cod_doc: '',
        secuencial: ''
      }
      console.log(newMovimiento);

      this.httpService.agregarMovimiento(newMovimiento).subscribe(res => {
        console.log(res)
        if (res.codigoError == "OK") {
          this.httpService.obtenerMovimientoUno(newMovimiento).subscribe(res1 => {
            localStorage.setItem('movimiento_id', res1.lstMovimientos[0].id);
          })
          localStorage.setItem('categoria', this.pedidoForm.value.categoria!)
          localStorage.setItem('tipo', this.pedidoForm.value.tipo!)
          localStorage.setItem('motivo', this.pedidoForm.value.motivo!)
          this.router.navigate(['/navegation-cl', { outlets: { 'contentClient': ['vistamarcas'] } }]);
          this.dialogRef.close();
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

  }


}
