import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faSave, faShoppingBag, faTimes } from '@fortawesome/free-solid-svg-icons';
import { LineasEntity } from 'src/app/models/lineas';
import { MarcasEntity } from 'src/app/models/marcas';
import { ModelosEntity } from 'src/app/models/modelos';
import { LineasService } from 'src/app/services/lineas.service';
import { MarcasService } from 'src/app/services/marcas.service';
import { ModelosService } from 'src/app/services/modelos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modelos-create',
  templateUrl: './modelos-create.component.html',
  styleUrls: ['./modelos-create.component.css']
})
export class ModelosCreateComponent implements OnInit {
  //Iconos para la pagina de grupos
  faShoppingBag = faShoppingBag;
  faTimes = faTimes;
  faSave = faSave;
  //Creación de la variable para formulario
  modelForm = new FormGroup({
    linea: new FormControl('0', Validators.required),
    marca: new FormControl('0', Validators.required),
    modelo: new FormControl('', [Validators.required]),
    etiquetas: new FormControl('', Validators.required),
    codigoSAP: new FormControl('', [Validators.required])
  });
  //Variables para listas desplegables
  lstLineas: LineasEntity[] = [];
  selectLineas: boolean = false;
  lstMarcas: MarcasEntity[] = [];
  selectMarcas: boolean = false;
  
  constructor(private readonly httpService: ModelosService,
    private readonly httpServiceLineas: LineasService,
    private readonly httpServiceMarcas: MarcasService,
    private router: Router) { }

  ngOnInit(): void {
    //Obtener Líneas
    this.httpServiceLineas.obtenerLineas().subscribe(res => {
      if (res.codigoError != "OK") {
        Swal.fire({
          icon: 'error',
          title: 'No se pudo obtener Líneas.',
          text: res.descripcionError,
          showConfirmButton: false,
        });
      } else {
        this.lstLineas = res.lstLineas;
      }
    })

    //Obtenemos Marcas
    this.httpServiceMarcas.obtenerMarcas().subscribe((res) => {
      if (res.codigoError != 'OK') {
        Swal.fire({
          icon: 'error',
          title: 'No se pudo obtener Marcas.',
          text: res.descripcionError,
          showConfirmButton: false,
        });
      } else {
        this.lstMarcas = res.lstMarcas;
      }
    });
  }
  

  onSubmit(): void {
    console.log(!this.modelForm.valid);
    if (!this.modelForm.valid) {
      this.modelForm.markAllAsTouched();
      if (this.modelForm.get("linea")?.value == "0") {
        this.selectLineas = true;
      }
      if (this.modelForm.get("marca")?.value == "0") {
        this.selectMarcas = true;
      }
    } else {
      if (this.modelForm.get("linea")?.value == "0") {
        this.selectLineas = true;
      } else if (this.modelForm.get("marca")?.value == "0") {
        this.selectMarcas = true;
      }
      else {
        const modelEntity: ModelosEntity = {
          linea_id: this.modelForm.value!.linea ?? "",
          marca_id: this.modelForm.value!.marca ?? "",
          modelo: this.modelForm.value!.modelo ?? "",
          etiquetas: this.modelForm.value!.etiquetas ?? "",
          cod_sap: this.modelForm.value!.codigoSAP ?? "",
          almacen_id: ''
        };
        this.httpService.agregarModelo(modelEntity).subscribe(res => {
          if (res.codigoError == "OK") {
            Swal.fire({
              icon: 'success',
              title: 'Guardado Exitosamente.',
              text: `Se ha creado el modelo ${this.modelForm.value.modelo}`,
              showConfirmButton: true,
              confirmButtonText: "Ok"
            }).finally(() => {
              this.router.navigate(['/navegation-adm', { outlets: { 'contentAdmin': ['modelos'] } }]);
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
    }
  }

  changeLine(linea: any): void {
    if (linea.target.value == 0) {
      this.selectLineas = true;
    } else {
      this.selectLineas = false;
      this.modelForm.get("linea")?.setValue(linea.target.value);
    }
  }

  changeMark(marca: any): void {
    if (marca.target.value == 0) {
      this.selectMarcas = true;
    } else {
      this.selectMarcas = false;
      this.modelForm.get("marca")?.setValue(marca.target.value);
    }
  }

  visualizarLineas() {
    this.router.navigate(['/navegation-adm', { outlets: { 'contentAdmin': ['modelos'] } }]);
  }

}
