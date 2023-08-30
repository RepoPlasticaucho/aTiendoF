import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faCopy, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import { ImagenesEntity } from 'src/app/models/imagenes';
import { SociedadesEntity } from 'src/app/models/sociedades';
import { ImagenesService } from 'src/app/services/imagenes.service';
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
    email: new FormControl('', Validators.required),
    passmail: new FormControl('', Validators.required),
    urlCertificado: new FormControl(''),
    passmailnew: new FormControl('', Validators.required),

  });

  encPass: string | undefined;
  clave : string | undefined ;
  fun: any;
  //Variables para imágen
  fileToUpload: any;
  certificadoUrl: any = "https://calidad.atiendo.ec/eojgprlg/Certificados/certificate.pfx";
  certificadoBase64: string = "";
  certificadoName: string = "";

  constructor( private readonly httpService: SociedadesService,
    private httpServiceImage: ImagenesService, private router: Router) { }

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
        const email = res.lstSociedades[0].email_certificado;
        const passemail = res.lstSociedades[0].pass_certificado;
        this.corporationForm.get("razonSocial")?.setValue(razonSocialValue !== undefined ? razonSocialValue : null);
        this.corporationForm.get("email")?.setValue(email !== undefined ? email : null);
        this.corporationForm.get("passmail")?.setValue(passemail !== undefined ? passemail : null);


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
    const email = this.corporationForm.value!.email ?? "";
    const passemailnew = this.corporationForm.value!.passmailnew ?? "";

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
        const imageEntity: ImagenesEntity = {
          imageBase64: this.certificadoBase64,
          nombreArchivo: this.certificadoName,
          codigoError: '',
          descripcionError: '',
          nombreArchivoEliminar: '',
        };
        this.httpServiceImage
          .agregarCertificado(imageEntity).subscribe(res1 => {
            if(res1.codigoError == 'OK'){
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
                url_certificado: this.certificadoName == '' ? this.certificadoUrl : this.certificadoName,
                clave_certificado: passactual, // cambiar por new
                pass_certificado : passemailnew,// activar validacion
                email_certificado : email
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
                        this.router.navigate(['/navegation-adm', { outlets: { 'contentAdmin': ['cofiguracion-user'] } }]);
                      break;
                      case "client":
                         this.router.navigate(['/navegation-cl', { outlets: { 'contentClient': ['cofiguracion-user'] } }]);
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
          })
  
        
      }
    } 
  }    
  
  onChangeFile(target: any): void {
    if (target.value != "") {
      this.fileToUpload = target.files[0];
      let reader = new FileReader();
      reader.onload = (event: any) => {
        this.certificadoUrl = event.target.result;
        this.certificadoBase64 = this.certificadoUrl.split(',')[1];
        this.certificadoName = this.fileToUpload.name;
      }
      reader.readAsDataURL(this.fileToUpload);
    }
  }
}
