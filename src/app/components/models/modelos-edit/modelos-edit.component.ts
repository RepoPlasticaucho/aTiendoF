import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faShoppingBag, faTimes, faSave } from '@fortawesome/free-solid-svg-icons';
import { LineasEntity } from 'src/app/models/lineas';
import { ModelosEntity } from 'src/app/models/modelos';
import { LineasService } from 'src/app/services/lineas.service';
import { ModelosService } from 'src/app/services/modelos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modelos-edit',
  templateUrl: './modelos-edit.component.html',
  styleUrls: ['./modelos-edit.component.css']
})
export class ModelosEditComponent implements OnInit {
  //Iconos para la pagina de grupos
  faShoppingBag = faShoppingBag;
  faTimes = faTimes;
  faSave = faSave;
  //Creación de la variable para formulario
  modelForm = new FormGroup({
    linea: new FormControl('0', Validators.required),
    modelo: new FormControl('', [Validators.required]),
    etiquetas: new FormControl('', Validators.required),
    codigoSAP: new FormControl('', [Validators.required])
  });
  //Variables para listas desplegables
  lstLineas: LineasEntity[] = [];
  selectLineas: boolean = false;
  //Declaracion de variables
  private codigo: string = "";

  constructor(private readonly httpService: ModelosService,
    private readonly httpServiceLineas: LineasService,
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
    //Cargar los datos Modelo Modificar
    this.httpService.obtenermodelo$.subscribe(res => {
      if (res.id == "") {
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error.',
          text: 'No se ha obtenido información.',
          showConfirmButton: false,
        });
      } else {
        this.codigo = res.id ?? "";
        this.modelForm.get("linea")?.setValue(res.linea_id);
        this.modelForm.get("modelo")?.setValue(res.modelo);
        this.modelForm.get("etiquetas")?.setValue(res.etiquetas);
        this.modelForm.get("codigoSAP")?.setValue(res.cod_sap);
      }
    });
  }

  onSubmit(): void {
    if (!this.modelForm.valid) {
      this.modelForm.markAllAsTouched();
      if (this.modelForm.get("linea")?.value == "0") {
        this.selectLineas = true;
      }
    } else {
      if (this.modelForm.get("linea")?.value == "0") {
        this.selectLineas = true;
      }
      else {
        const modelEntity: ModelosEntity = {
          id: this.codigo,
          linea_id: this.modelForm.value!.linea ?? "",
          modelo: this.modelForm.value!.modelo ?? "",
          etiquetas: this.modelForm.value!.etiquetas ?? "",
          cod_sap: this.modelForm.value!.codigoSAP ?? "",
          almacen_id: ''
        };
        this.httpService.actualizarModelo(modelEntity).subscribe(res => {
          if (res.codigoError == "OK") {
            Swal.fire({
              icon: 'success',
              title: 'Actualizado Correctamente.',
              text: `Se ha actualizado la información`,
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

  visualizarLineas() {
    this.router.navigate(['/navegation-adm', { outlets: { 'contentAdmin': ['modelos'] } }]);
  }

}
