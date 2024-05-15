import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faCopy, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import { SociedadesEntity } from 'src/app/models/sociedades';
import { SociedadesService } from 'src/app/services/sociedades.service';
import Swal from 'sweetalert2';
import { AuthenticationService } from "src/app/services/authentication.service";
import { Location } from '@angular/common';
import { ImagenesEntity } from 'src/app/models/imagenes';
import { ImagenesService } from 'src/app/services/imagenes.service';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css'],
})
export class UsuarioComponent implements OnInit {
  faTimes = faTimes;
  faCopy = faCopy;
  faSave = faSave;
  imageNameOriginal: string = '';
  fileToUpload: any;
  certificadoUrl: any = "https://calidad.atiendo.ec/eojgprlg/Certificados/certificate.pfx";
  certificadoBase64: string = "";
  certificadoName: string = "";
  tienePermisos: boolean = false;
  imageUrl: string = "";
  imageUrlAux: any =
  'https://calidad.atiendo.ec/eojgprlg/ModeloProducto/producto.png';
imageBase64: string = '';
imageName: string = '';

  //Creación de la variable para formulario
  corporationForm = new FormGroup({
    idFiscal: new FormControl('', [
      Validators.required,
      Validators.minLength(10),
      
    ]),
    nombreComercial: new FormControl('', Validators.required),
    razonSocial: new FormControl('', Validators.required),
    correoElectronico: new FormControl('', [
      Validators.required,
      Validators.email,
    ]),
    telefono: new FormControl('', [
      Validators.required,
      Validators.minLength(9),
    ]),
    urlImagen: new FormControl(''),

  });
  encPass: string | undefined;
  codigo: any;
  fun: any;
  constructor(
    private readonly httpService: SociedadesService,
    private router: Router,
    private authService: AuthenticationService,
    private location: Location,
    private httpServiceImage: ImagenesService
  ) {
  }

  ngOnInit(): void {
    const sociedad: SociedadesEntity = {
      idSociedad: JSON.parse(localStorage.getItem('sociedadid') || '[]'),
      idGrupo: '',
      nombre_comercial: '',
      tipo_ambienteid: '',
      id_fiscal: '',
      email: '',
      telefono: '',
      password: '',
      funcion: '',
      razon_social: '',
    };
    // console.log(sociedad);

    this.httpService.obtenerUser(sociedad).subscribe((res) => {
      if (res.codigoError != 'OK') {
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error.',
          text: res.descripcionError,
          showConfirmButton: false,
          // timer: 3000
        });
      } else {
        this.codigo = JSON.parse(localStorage.getItem('sociedadid') || '[]');
        this.corporationForm
          .get('idFiscal')
          ?.setValue(res.lstSociedades[0].id_fiscal);
        this.corporationForm
          .get('nombreComercial')
          ?.setValue(res.lstSociedades[0].nombre_comercial);
        this.corporationForm
          .get('razonSocial')
          ?.setValue(res.lstSociedades[0].razon_social);
        this.corporationForm
          .get('correoElectronico')
          ?.setValue(res.lstSociedades[0].email);
        this.corporationForm
          .get('telefono')
          ?.setValue(res.lstSociedades[0].telefono);
        this.imageUrl = res.lstSociedades[0].url_logo!;
      }

      this.fun = res.lstSociedades[0].funcion;
    });
  }

  onPass(): void {
    switch (this.fun) {
      case 'admin':
        this.router.navigate([
          '/navegation-adm',
          { outlets: { contentAdmin: ['usuario-pass'] } },
        ]);
        break;

      case 'client':
        this.router.navigate([
          '/navegation-cl',
          { outlets: { contentClient: ['usuario-pass'] } },
        ]);
        break;
    }
  }
  onSubmit(): void {
    if (!this.corporationForm.valid) {
      this.corporationForm.markAllAsTouched();
    } else {
      const sociedadEntity: SociedadesEntity = {
        idSociedad: JSON.parse(localStorage.getItem('sociedadid') || '[]'),
        idGrupo: '',
        id_fiscal: this.corporationForm.value!.idFiscal ?? '',
        nombre_comercial: this.corporationForm.value!.nombreComercial ?? '',
        email: this.corporationForm.value!.correoElectronico ?? '',
        tipo_ambienteid: '',
        telefono: this.corporationForm.value!.telefono ?? '',
        password: '',
        funcion: '',
        razon_social: this.corporationForm.value!.razonSocial ?? '',
      };
      //console.log(sociedadEntity);
      this.httpService.actualSociedad(sociedadEntity).subscribe((res) => {
        if (res.codigoError == 'OK') {
          Swal.fire({
            icon: 'success',
            title: 'Actualizado Correctamente.',
            text: `Se ha actualizado la información`,
            showConfirmButton: true,
            confirmButtonText: 'Ok',
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

  keyPressNumbers(event: any) {
    var charCode = event.which ? event.which : event.keyCode;
    // Only Numbers 0-9
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }

  logout() {
    this.authService.logout();
    this.location.replaceState('/');
    window.location.reload();
  }

  onPass1(): void{
    switch (this.fun) {
      case "admin":
          this.router.navigate(['/navegation-adm', { outlets: { 'contentAdmin': ['usuario'] } }]);
      break;

      case "client":
           this.router.navigate(['/navegation-cl', { outlets: { 'contentClient': ['usuario'] } }]);
      break;
    }
  }
  onConfiguracion(): void{
    switch (this.fun) {
      case "admin":
          this.router.navigate(['/navegation-adm', { outlets: { 'contentAdmin': ['usuario'] } }]);
      break;

      case "client":
           this.router.navigate(['/navegation-cl', { outlets: { 'contentClient': ['cofiguracion-user'] } }]);
      break;
    }
  }

  
actualizarImagen(){

  //Si la ruta no contiene admin o client, redirige a la pagina de inicio
  if (this.fun != "admin" && this.fun != "client") {
    this.router.navigate(['/']);
  }

  if (this.imageName != '') {

    console.log("entro al metodo2")

    const imageEntity: ImagenesEntity = {
      imageBase64: this.imageBase64,
      nombreArchivo: this.imageName,
      codigoError: '',
      descripcionError: '',
      nombreArchivoEliminar: this.imageNameOriginal,
    };

    const sociedadEntity: SociedadesEntity = {
      idSociedad: JSON.parse(localStorage.getItem('sociedadid') || "[]"),
      idGrupo: '',
      nombre_comercial: '',
      id_fiscal: '',
      email: '',
      tipo_ambienteid: '',
      telefono: '',
      password: '',
      funcion: '',
      razon_social: '',
      url_certificado: '',
      clave_certificado: '',
      url_logo:this.imageName == '' ? this.imageUrl : this.imageName
    };

    this.httpServiceImage
    .agregarImagenLS(imageEntity)
    .subscribe((res) => {
      if (res.codigoError == "OK") {
        console.log("Se agrego la imagen")
        sociedadEntity.url_logo = imageEntity.nombreArchivo;
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error.',
          text: res.descripcionError,
          showConfirmButton: false,
        });
      }
    });

    this.httpService.actualizarSociedadImagen(sociedadEntity).subscribe((res) => {
      if (res.codigoError == "OK") {
        Swal.fire({
          icon: 'success',
          title: 'Actualizado Correctamente.',
          text: `Se ha actualizado la información`,
          showConfirmButton: true,
          confirmButtonText: "Ok"
        }).finally(() => {
          switch (this.fun) {
            case "admin":
              this.router.navigate(['/navegation-adm', { outlets: { 'contentAdmin': ['usuario'] } }]);
              break;
            case "client":
              this.router.navigate(['/navegation-cl', { outlets: { 'contentClient': ['usuario'] } }]);
              break;
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
    
  }
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


//Comprobar si es admin o client
comprobarAdminClient() {
  if (this.fun == "admin" || this.fun == "client") {
    this.tienePermisos = true;
  }
}
}
