import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faBookmark, faTimes, faSave } from '@fortawesome/free-solid-svg-icons';
import { ImagenesEntity } from 'src/app/models/imagenes';
import { MarcasEntity } from 'src/app/models/marcas';
import { ProveedoresEntity } from 'src/app/models/proveedores';
import { ImagenesService } from 'src/app/services/imagenes.service';
import { MarcasService } from 'src/app/services/marcas.service';
import { ProveedoresService } from 'src/app/services/proveedores.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-marcas-create',
  templateUrl: './marcas-create.component.html',
  styleUrls: ['./marcas-create.component.css']
})
export class MarcasCreateComponent implements OnInit {

  //Iconos para la pagina de grupos
  faBookmark = faBookmark;
  faTimes = faTimes;
  faSave = faSave;
  //Creación de la variable para formulario
  markForm = new FormGroup({
    proveedor: new FormControl('0', Validators.required),
    marca: new FormControl('', Validators.required),
    etiquetas: new FormControl(''),
    urlImagen: new FormControl(''),
  });
  //Variables para imágen
  fileToUpload: any;
  imageUrl: any = "https://calidad.atiendo.ec/eojgprlg/Marcas/producto.png";
  imageBase64: string = "";
  imageName: string = "";
  codigoError: string = "";
  descripcionError: string = "";
  selectProveedor: boolean = false;
  lstProveedores: ProveedoresEntity[] = [];
  codigo: any;

  constructor(private httpService: MarcasService, private httpServiceImage: ImagenesService,
    private router: Router, private httpServiceProv: ProveedoresService) { }

  ngOnInit(): void {
    //Obtenemos Proveedores
    this.httpServiceProv.obtenerProveedores().subscribe(res => {
      if (res.codigoError != "OK") {
        Swal.fire({
          icon: 'error',
          title: 'No se pudo obtener proveedores.',
          text: res.descripcionError,
          showConfirmButton: false,
        });
      } else {
        this.lstProveedores = res.lstProveedores;
      }
    });
  }

  changeGroup(tipoC: any): void {
    if (tipoC.target.value == 0) {
      this.selectProveedor = true;
    } else {
      this.selectProveedor = false;
    }
    const proveedores: ProveedoresEntity = {
      id: '',
      id_fiscal: '',
      ciudadid: '',
      correo: '',
      direccionprov: '',
      nombre: tipoC.target.value,
      telefono: ''
    }

    this.httpServiceProv.obtenerProveedoresN(proveedores).subscribe(res => {
      if (res.codigoError != "OK") {
        Swal.fire({
          icon: 'error',
          title: 'No se pudo obtener la Sociedad.',
          text: res.descripcionError,
          showConfirmButton: false,
        });
      } else {
        this.codigo = res.lstProveedores[0].id;
      }
    })
  }

  onSubmit(): void {
    console.log(this.markForm.valid);
    if (!this.markForm.valid) {
      this.markForm.markAllAsTouched();
    } else {
      console.log(this.imageName);
      if (this.imageName != "") {
        const imageEntity: ImagenesEntity = {
          imageBase64: this.imageBase64,
          nombreArchivo: this.imageName,
          codigoError: "",
          descripcionError: "",
          nombreArchivoEliminar: ""
        };
        this.httpServiceImage.agregarImagen(imageEntity).subscribe(res => {
          if (res.codigoError == "OK") {
            const markEntity: MarcasEntity = {
              id: "",
              marca: this.markForm.value!.marca ?? "",
              proveedor: this.markForm.value!.proveedor ?? "",
              proveedor_id: this.codigo,
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
          id: "",
          marca: this.markForm.value!.marca ?? "",
          proveedor: this.markForm.value!.proveedor ?? "",
          proveedor_id: this.codigo,
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
}