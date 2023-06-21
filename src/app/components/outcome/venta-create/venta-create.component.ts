import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { faSave, faList, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { MatDialogRef } from '@angular/material/dialog';
import { VentaprovComponent } from '../ventaprov/ventaprov.component';
import { MovimientosEntity } from 'src/app/models/movimientos';
import { MovimientosService } from 'src/app/services/movimientos.service';
import { TipocomprobanteEntity } from 'src/app/models/tipo_comprobante';
import { TipocomprobanteService } from 'src/app/services/tipocomprobante.service';

@Component({
  selector: 'app-venta-create',
  templateUrl: './venta-create.component.html',
  styleUrls: ['./venta-create.component.css']
})
export class VentaCreateComponent implements OnInit {

  //Iconos para la pagina de grupos
  faList = faList;
  faTimes = faTimes;
  faSave = faSave;

  
  tipoSeleccionado: string = '';
  //Creación de la variable para formulario
  pedidoForm = new FormGroup({
    tipo: new FormControl('0', Validators.required)
  });

  lstTipos: TipocomprobanteEntity[] = [];
  lstTipos2: TipocomprobanteEntity[] = [];
  selectTipo: boolean = false;

  /*
  lstMotivos: ModelosEntity[] = [];
  lstMotivos2: ModelosEntity[] = [];
  */
  selectMotivo: boolean = false;

  constructor(private readonly httpService: MovimientosService,
    private readonly httpServiceTipos: TipocomprobanteService,
    private router: Router,
    private dialogRef: MatDialogRef<VentaprovComponent>) { }

  ngOnInit(): void {
    this.httpServiceTipos.obtenerTipos().subscribe(res => {
      if (res.codigoError != "OK") {
        Swal.fire({
          icon: 'error',
          title: 'No se pudo obtener los tipos de comprobante.',
          text: res.descripcionError,
          showConfirmButton: false,
        });
      } else {
        this.lstTipos = res.lstTipo_Comprobante;
      }
    });
  }

  cerrarDialog(): void {
    this.dialogRef.close();
  }

  onTipoChange(event: Event) {
    const tipoElement = event.target as HTMLSelectElement;
    this.tipoSeleccionado = tipoElement.value;
  }

  changeGroup(tipoC: any): void {
    if (tipoC.target.value == 0) {
      this.selectTipo = true;
    } else {
      this.selectTipo = false;

      // Obtener ID de tipo_comprobante

      const tipo: TipocomprobanteEntity = {
        id: '',
        codigo: '',
        nombre: tipoC.target.value,
        created_at: '',
        update_at: ''
      }
      this.httpServiceTipos.obtenerTipoN(tipo).subscribe(res => {
        if (res.codigoError != "OK") {
          Swal.fire({
            icon: 'error',
            title: 'No se pudo obtener el ID.',
            text: res.descripcionError,
            showConfirmButton: false,
          });
        } else {
          this.lstTipos2 = res.lstTipo_Comprobante;
        }
      })

      //this.warehousesForm.get("sociedad")?.setValue(sociedad.target.value);
    }
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
        tipo_id: '2',
        tipo_emision_cod: '',
        estado_fact_id: '1',
        tipo_comprb_id: this.lstTipos2[0].id,
        cod_doc: '',
        secuencial: ''
      }
      console.log(newMovimiento);

      this.httpService.agregarMovimiento(newMovimiento).subscribe(res => {
        console.log(res)
        if (res.codigoError == "OK") {
          this.httpService.obtenerMovimientoUno(newMovimiento).subscribe(res1 => {
            localStorage.setItem('movimiento_id', res1.lstMovimientos[0].id);
            localStorage.setItem('estab', res1.lstMovimientos[0].estab!);
          })
          // localStorage.setItem('tipo', this.pedidoForm.value.tipo!)
            this.router.navigate(['/navegation-cl', { outlets: { 'contentClient': ['pedidovent'] } }]);
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

