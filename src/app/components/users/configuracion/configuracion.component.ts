import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faCopy, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import { SociedadesEntity } from 'src/app/models/sociedades';
import { SociedadesService } from 'src/app/services/sociedades.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.css']
})
export class ConfiguracionComponent implements OnInit {
  faTimes = faTimes;
  faCopy = faCopy;
  faSave = faSave;
  //Creación de la variable para formulario
  corporationForm = new FormGroup({
    nombreComercial2: new FormControl('', Validators.required),
    razonSocial: new FormControl('', Validators.required),
    urlImagen: new FormControl(''),

  });

  encPass: string | undefined;
  clave : string | undefined ;
  fun: any;
  //Variables para imágen
  fileToUpload: any;
  imageUrl: any = "https://calidad.atiendo.ec/eojgprlg/Marcas/producto.png";
  imageBase64: string = "";
  imageName: string = "";

  constructor( private readonly httpService: SociedadesService, private router: Router) { }

  ngOnInit(): void {

    const sociedad: SociedadesEntity = {
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
      clave_certificado: ''
    }
    console.log(sociedad);

    this.httpService.obtenerUser(sociedad).subscribe(res => {
      if (res.codigoError != "OK") {
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error.',
          text: res.descripcionError,
          showConfirmButton: false,
          // timer: 3000
        });
      } else {
        console.log(res.lstSociedades)
        const razonSocialValue = res.lstSociedades[0].clave_certificado;
        this.corporationForm.get("razonSocial")?.setValue(razonSocialValue !== undefined ? razonSocialValue : null);
      }
     // console.log(res);
     this.fun = res.lstSociedades[0].funcion;
    })
  }

  onPass(): void{
    switch (this.fun) {
      case "admin":
          this.router.navigate(['/navegation-adm', { outlets: { 'contentAdmin': ['usuario'] } }]);
      break;

      case "client":
           this.router.navigate(['/navegation-cl', { outlets: { 'contentClient': ['usuario'] } }]);
      break;
    }
  }

  onSubmit(){
    const passnuevo = this.corporationForm.value!.nombreComercial2 ?? "";
    const passactual = this.corporationForm.value!.razonSocial ?? "";

    if (!this.corporationForm.valid) {
      this.corporationForm.markAllAsTouched();
    } else {

      if (passactual == passnuevo) {
        Swal.fire({
          icon: 'success',
          title: 'Actualizado Correctamente.',
          text: `Se ha actualizado la información`,
          showConfirmButton: true,
          confirmButtonText: "Ok"
        }).finally(() => {
          localStorage.setItem('passwa',passnuevo);
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
        const userEntity: SociedadesEntity = {
          idGrupo: '',
          nombre_comercial: '',
          tipo_ambienteid: '',
          id_fiscal: '',
          email: '',
          telefono: '',
          password: '',
          funcion: '',
          idSociedad: JSON.parse(localStorage.getItem('sociedadid') || "[]"),
          razon_social: '',
          url_certificado: '',
          clave_certificado: passnuevo
        }
  
        this.httpService.actualizarCertificado(userEntity).subscribe(res => {
          if (res.codigoError == "OK") {
            Swal.fire({
              icon: 'success',
              title: 'Actualizado Correctamente.',
              text: `Se ha actualizado la información`,
              showConfirmButton: true,
              confirmButtonText: "Ok"
            }).finally(() => {
              localStorage.setItem('passwa',passnuevo);
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
