import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faClipboardList, faTimes, faSave } from '@fortawesome/free-solid-svg-icons';
import { CategoriasEntity } from 'src/app/models/categorias';
import { LineasEntity } from 'src/app/models/lineas';
import { CategoriasService } from 'src/app/services/categorias.service';
import { LineasService } from 'src/app/services/lineas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lineas-edit',
  templateUrl: './lineas-edit.component.html',
  styleUrls: ['./lineas-edit.component.css']
})
export class LineasEditComponent implements OnInit {
  //Iconos para la pagina de grupos
  faClipboardList = faClipboardList;
  faTimes = faTimes;
  faSave = faSave;
  //Creación de la variable para formulario
  lineForm = new FormGroup({
    categoria: new FormControl('0', Validators.required),
    linea: new FormControl('', [Validators.required]),
    etiquetas: new FormControl('', Validators.required),
    codigoSAP: new FormControl('', [Validators.required])
    // telefono: new FormControl('', [Validators.required, Validators.minLength(9)]),
  });
  //Variables para listas desplegables
  lstCategorias: CategoriasEntity[] = [];
  selectCategorias: boolean = false;
  //Declaracion de variables
  private codigo: string = "";
  constructor(private readonly httpService: LineasService,
    private readonly httpServiceCategorias: CategoriasService,
    private router: Router) { }

  ngOnInit(): void {
    //Obtener Categorias
    this.httpServiceCategorias.obtenerCategorias().subscribe(res => {
      if (res.codigoError != "OK") {
        Swal.fire({
          icon: 'error',
          title: 'No se pudo obtener Categorias.',
          text: res.descripcionError,
          showConfirmButton: false,
        });
      } else {
        this.lstCategorias = res.lstCategorias;
      }
    })
    //Cargar los datos Lineas Modificar
    this.httpService.obtenerlinea$.subscribe(res => {
      if (res.id == "") {
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error.',
          text: 'No se ha obtenido información.',
          showConfirmButton: false,
        });
      } else {
        this.codigo = res.id ?? "";
        this.lineForm.get("categoria")?.setValue(res.categoria_id!);
        this.lineForm.get("linea")?.setValue(res.linea);
        this.lineForm.get("etiquetas")?.setValue(res.etiquetas);
        this.lineForm.get("codigoSAP")?.setValue(res.cod_sap);
      }
    });
  }

  onSubmit(): void {
    if (!this.lineForm.valid) {
      this.lineForm.markAllAsTouched();
      if (this.lineForm.get("categoria")?.value == "0") {
        this.selectCategorias = true;
      }
    } else {
      if (this.lineForm.get("categoria")?.value == "0") {
        this.selectCategorias = true;
      }
      else {
        const lineaEntity: LineasEntity = {
          id: this.codigo,
          categoria_id: this.lineForm.value!.categoria ?? "",
          linea: this.lineForm.value!.linea ?? "",
          etiquetas: this.lineForm.value!.etiquetas ?? "",
          cod_sap: this.lineForm.value!.codigoSAP ?? "",
          almacen_id: ''
        };
        this.httpService.actualizarLinea(lineaEntity).subscribe(res => {
          if (res.codigoError == "OK") {
            Swal.fire({
              icon: 'success',
              title: 'Actualizado Correctamente.',
              text: `Se ha actualizado la información`,
              showConfirmButton: true,
              confirmButtonText: "Ok"
            }).finally(() => {
              this.router.navigate(['/navegation-adm', { outlets: { 'contentAdmin': ['lineas'] } }]);
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

  changeCategoria(categoria: any): void {
    if (categoria.target.value == 0) {
      this.selectCategorias = true;
    } else {
      this.selectCategorias = false;
      this.lineForm.get("categoria")?.setValue(categoria.target.value);
    }
  }

  visualizarLineas() {
    this.router.navigate(['/navegation-adm', { outlets: { 'contentAdmin': ['lineas'] } }]);
  }

}
