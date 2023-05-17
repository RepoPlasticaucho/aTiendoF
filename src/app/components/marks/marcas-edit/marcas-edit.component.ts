import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faBookmark, faTimes, faSave } from '@fortawesome/free-solid-svg-icons';
import { ImagenesEntity } from 'src/app/models/imagenes';
import { MarcasEntity } from 'src/app/models/marcas';
import { ImagenesService } from 'src/app/services/imagenes.service';
import { MarcasService } from 'src/app/services/marcas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-marcas-edit',
  templateUrl: './marcas-edit.component.html',
  styleUrls: ['./marcas-edit.component.css']
})
export class MarcasEditComponent implements OnInit {

  //Iconos para la pagina de grupos
  faBookmark = faBookmark;
  faTimes = faTimes;
  faSave = faSave;
  //Creación de la variable para formulario
  markForm = new FormGroup({
    marca: new FormControl('', Validators.required),
    etiquetas: new FormControl(''),
    urlImagen: new FormControl(''),
  });
  //Variables para imágen
  fileToUpload: any;
  imageUrl: any = "https://calidad.atiendo.ec/eojgprlg/Marcas/producto.png";
  imageUrlAux: any = "https://calidad.atiendo.ec/eojgprlg/Marcas/producto.png";
  imageBase64: string = "";
  imageName: string = "";
  imageNameOriginal: string = "";
  codigoError: string = "";
  descripcionError: string = "";
  //Declaracion de variables
  private codigo: string = "";

  constructor(private httpService: MarcasService, private httpServiceImage: ImagenesService, private router: Router) { }

  ngOnInit(): void {
    this.httpService.obtenermarca$.subscribe(res => {
      if (res.id == "") {
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error.',
          text: 'No se ha obtenido información.',
          showConfirmButton: false,
        });
      } else {
        this.codigo = res.id;
        this.markForm.get("marca")?.setValue(res.marca);
        this.markForm.get("etiquetas")?.setValue(res.etiquetas);
        this.imageUrl = res.url_image;
        this.imageNameOriginal = res.url_image.split('/')[5];
      }
    });
  }

  onSubmit(): void {
    console.log(this.markForm.valid);
    if (!this.markForm.valid) {
      this.markForm.markAllAsTouched();
    } else {
      if (this.imageName != "") {
        const imageEntity: ImagenesEntity = {
          imageBase64: this.imageBase64,
          nombreArchivo: this.imageName,
          codigoError: "",
          descripcionError: "",
          nombreArchivoEliminar: this.imageNameOriginal
        };
        this.httpServiceImage.agregarImagen(imageEntity).subscribe(res => {
          if (res.codigoError == "OK") {
            const markEntity: MarcasEntity = {
              id: this.codigo,
              marca: this.markForm.value!.marca ?? "",
              etiquetas: this.markForm.value!.etiquetas ?? "",
              url_image: this.imageName == "" ? this.imageUrl : this.imageName
            }
            this.httpService.actualizarMarca(markEntity).subscribe(res => {
              if (res.codigoError == "OK") {
                Swal.fire({
                  icon: 'success',
                  title: 'Actualizado Exitosamente.',
                  text: `Se ha modificado la marca ${this.markForm.value.marca}`,
                  showConfirmButton: true,
                  confirmButtonText: "Ok"
                }).finally(() => {
                  this.router.navigate(['/navegation-adm', { outlets: { 'contentAdmin': ['marcas'] } }]);
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
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Ha ocurrido un error.',
              text: res.descripcionError,
              showConfirmButton: false,
            });
          }
        });
      } else {
        const markEntity: MarcasEntity = {
          id: this.codigo,
          marca: this.markForm.value!.marca ?? "",
          etiquetas: this.markForm.value!.etiquetas ?? "",
          url_image: this.imageName == "" ? this.imageUrl : this.imageName
        }
        this.httpService.agregarMarca(markEntity).subscribe(res => {
          if (res.codigoError == "OK") {
            Swal.fire({
              icon: 'success',
              title: 'Guardado Exitosamente.',
              text: `Se ha creado la marca ${this.markForm.value.marca}`,
              showConfirmButton: true,
              confirmButtonText: "Ok"
            }).finally(() => {
              this.router.navigate(['/navegation-adm', { outlets: { 'contentAdmin': ['marcas'] } }]);
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
  }

  visualizarMarcas(): void {
    this.router.navigate(['/navegation-adm', { outlets: { 'contentAdmin': ['marcas'] } }]);
  }

  onChangeFile(target: any): void {
    if (target.value != "") {
      this.fileToUpload = target.files[0];
      let reader = new FileReader();
      reader.onload = (event: any) => {
        this.imageUrl = event.target.result;
        this.imageBase64 = this.imageUrl.split(',')[1];
        this.imageName = this.fileToUpload.name;
      }
      reader.readAsDataURL(this.fileToUpload);
    }
  }

  eliminarImagen() {
    this.imageUrl = this.imageUrlAux;
    this.imageName = this.imageUrl;
  }

}
