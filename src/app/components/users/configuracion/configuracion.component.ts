import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faCopy, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import { ImagenesEntity } from 'src/app/models/imagenes';
import { SociedadesEntity } from 'src/app/models/sociedades';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ImagenesService } from 'src/app/services/imagenes.service';
import { SociedadesService } from 'src/app/services/sociedades.service';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import { FormasPagoService } from 'src/app/services/formas-pago.service';
import { FormasPagoEntity } from 'src/app/models/formas-pago';
import { FormasPagoServiceSociedad } from 'src/app/services/formaspagosociedad.service';
import { FormasPagoSociedadEntity } from 'src/app/models/formas-pago-sociedad';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.css']
})
export class ConfiguracionComponent implements OnInit {
  faTimes = faTimes;
  faCopy = faCopy;
  faSave = faSave;
  emailAux: string = "";
  //Campo para ver si tiene razon social o no
  razonSocialInclude: boolean = false;

  rol: boolean = false;
  imageNameOriginal: string = '';

  imageUrl: string = "";
  imageUrlAux: any =
    'https://calidad.atiendo.ec/eojgprlg/ModeloProducto/producto.png';
  imageBase64: string = '';
  imageName: string = '';


  //Funcion para ver si es facturador
  comprobarRol() {
    if (this.router.url.includes("facturador")) {
      this.rol = true;
    }
  }

  //Funcion para ver si tiene
  comprobarRazonSocial() {
    if (this.corporationForm.get("razonSocial")?.value != "" && this.corporationForm.get("razonSocial")?.value != null) {
      this.razonSocialInclude = true;
    } else {
      this.razonSocialInclude = false;
    }
  }

  //Creación de la variable para formulario
  corporationForm = new FormGroup({
    nombreComercial2: new FormControl('', Validators.required),
    razonSocial: new FormControl('', Validators.required),
    urlCertificado: new FormControl(''),
    urlImagen: new FormControl(''),
  });

  emailForm = new FormGroup({
    email: new FormControl('', Validators.required),
    passmail: new FormControl('', Validators.required),
    passmailnew: new FormControl('', Validators.required),
  });

  encPass: string | undefined;
  clave: string | undefined;
  fun: any;
  //Variables para imágen
  fileToUpload: any;
  certificadoUrl: any = "https://calidad.atiendo.ec/eojgprlg/Certificados/certificate.pfx";
  certificadoBase64: string = "";
  certificadoName: string = "";
  lstFormasPago: FormasPagoEntity[] = [];
  lstFormasPagoSociedad: FormasPagoSociedadEntity[] = [];

  constructor(private readonly httpService: SociedadesService,
    private httpServiceImage: ImagenesService, private router: Router,
    private authService: AuthenticationService,
    private formasPagoService: FormasPagoService,
    private formasPagoSociedadService: FormasPagoServiceSociedad,
    private location: Location) { }

  ngOnInit(): void {

    //Obtener las formas de pago
    console.log("entro al metodo")
    this.formasPagoService.obtenerFormasPago().subscribe(res => {

      try {
        this.lstFormasPago = res.lstFormasPago;

        const sociedadid: SociedadesEntity = {
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
    
        this.formasPagoSociedadService.obtenerFormasPago(sociedadid).subscribe(res => {
          try {
            this.lstFormasPagoSociedad = res.lstFormasPagoSociedad;
            console.log("Formas de pago sociedadddddd: ", this.lstFormasPagoSociedad)
    
            //Despues de obtener las formas de pago tanto de la sociedad como las generales, se debe comparar y marcar las que ya tiene asignadas
            this.lstFormasPago.forEach(element => {
              this.lstFormasPagoSociedad.forEach(element2 => {
                if (parseInt(element.codigo) == parseInt(element2.forma_pago_id)) {
                  element.checked = true;
                }
              });
            });
    
          } catch (error) {
            console.log("Error en la asignación de la forma de pago")
          }
        })
        console.log("Formas de pago: ", this.lstFormasPago)
      }
      catch (error) {
        console.log("Error en la asignación de la forma de pago")
      }
      console.log("Formas de pago: ", this.lstFormasPago)
    })

   




    this.comprobarRol();

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
          title: 'Ha ocurrido un error1.',
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
        this.emailForm.get("email")?.setValue(email !== undefined ? email : null);
        this.emailForm.get("passmail")?.setValue(passemail !== undefined ? passemail : null);
        this.imageUrl = res.lstSociedades[0].url_logo?.toString() ?? "";

      }
      // console.log(res);
      this.fun = res.lstSociedades[0].funcion;
      this.comprobarRazonSocial();

    })


  }

  onPass(): void {
    switch (this.fun) {
      case "admin":
        this.router.navigate(['/navegation-adm', { outlets: { 'contentAdmin': ['usuario'] } }]);
        break;

      case "client":
        this.router.navigate(['/navegation-cl', { outlets: { 'contentClient': ['usuario'] } }]);
        break;
    }
  }

  actualizarCert() {

    console.log("entro al metodo")
    const passnuevo = this.corporationForm.value!.nombreComercial2 ?? "";
    const passactual = this.corporationForm.value!.razonSocial ?? "";
    const emailCert = this.emailForm.value!.email ?? "";
    const urlCertificado = this.corporationForm.value!.urlCertificado ?? "";


    console.log(passnuevo + " - " + passactual + " - " + emailCert)


    if (!this.corporationForm.valid && this.razonSocialInclude) {
      console.log("entro al if principal")
      this.corporationForm.markAllAsTouched();
    } else {

      if (!this.razonSocialInclude) {
        console.log("entro al if principal2")
        //Agregar el certificado y la clave
        console.log("asdsd")

      }

      if (passactual == passnuevo) {
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
        console.log("entro al else")

        this.certificadoBase64 = this.imageBase64;
        this.certificadoName = this.imageName;
        console.log("NOMBRE ", this.certificadoName)
        console.log("CERTIFICADO ", this.certificadoBase64)

        const imageEntity: ImagenesEntity = {
          imageBase64: this.certificadoBase64,
          nombreArchivo: this.certificadoName,
          codigoError: '',
          descripcionError: '',
          nombreArchivoEliminar: '',
        };

        console.log("CERTIFICADO ", imageEntity)

        console.log("ESTE ES EL EMAIL AUX ", localStorage.getItem('sociedadid'))

        //Sociedad con el id

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

        //Obtener el email de la sociedad
        this.httpService.obtenerEmailPorIdSociedad(sociedad).subscribe(res => {
          if (res != null || res != undefined || res != "") {
            this.emailAux = res;
            console.log("ESTE ES EL CERTIFICADONAME ", this.certificadoName)
            this.httpServiceImage
              .agregarCertificado(imageEntity).subscribe(res1 => {
                if (res1.codigoError == 'OK') {
                  const userEntity: SociedadesEntity = {
                    idGrupo: '',
                    nombre_comercial: '',
                    tipo_ambienteid: '',
                    id_fiscal: '',
                    email: this.emailAux || "",
                    telefono: '',
                    password: '',
                    funcion: '',
                    idSociedad: JSON.parse(localStorage.getItem('sociedadid') || "[]"),
                    razon_social: '',
                    url_certificado: this.certificadoName == '' ? "" : this.certificadoName,
                    clave_certificado: passnuevo, // cambiar por new
                    pass_certificado: '',// activar validacion
                    email_certificado: emailCert
                  }

                  console.log("entro al OK")
                  console.log("Estees el userEntity ", userEntity)
                  this.httpService.actualizarCertificado(userEntity).subscribe(res => {
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
                        title: 'Ha ocurrido un error2.',
                        text: res.descripcionError,
                        showConfirmButton: false,
                      });
                    }
                  });
                }
              })


          }
        }
        )
        console.log("ESTE ES EL EMAIL AUX ", this.emailAux)


      }
    }
  }

  actualizarEmail() {
    const email = this.emailForm.value!.email ?? "";
    const passemailnew = this.emailForm.value!.passmailnew ?? "";

    if (!this.emailForm.valid) {
      this.emailForm.markAllAsTouched();
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
        clave_certificado: '', // cambiar por new
        pass_certificado: passemailnew,// activar validacion
        email_certificado: email
      }
      this.httpService.actualizarClaveCorreo(userEntity).subscribe(res => {
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
            title: 'Ha ocurrido un error3.',
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

  onPass1(): void {
    this.router.navigate(['/navegation-cl', { outlets: { 'contentClient': ['cofiguracion-user'] } }]);

  }

  logout() {
    this.authService.logout();
    this.location.replaceState('/');
    window.location.reload();
  }

  showPassword: { [key: string]: boolean } = {};

  togglePassword(field: string) {
    this.showPassword[field] = !this.showPassword[field];
  }

  actualizarImagen() {

    console.log("entro al metodo")

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
        url_logo: this.imageName == '' ? this.imageUrl : this.imageName
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





  }
  eliminarImagen() {
    this.imageUrl = this.imageUrlAux;
    this.imageName = this.imageUrl;
  }


  changeCheckbox(event: any, formaPago: FormasPagoEntity) {

    if(event.target.checked == false){

    console.log("Entro al metodo de eliminar forma de pago")
    //si no esta marcado se elimina
    const idSociedad = JSON.parse(localStorage.getItem('sociedadid') || "[]");
    const idSociedadString = idSociedad.toString();
    this.formasPagoSociedadService.eliminarFormaSociedad(formaPago.codigo, idSociedadString).subscribe(res => {
      console.log("Eliminado correctamente")
    });
    }else{
      console.log("Entro al metodo de GUARDAR forma de pago")

     //si esta marcado se inserta
    const idSociedad = JSON.parse(localStorage.getItem('sociedadid') || "[]");
    const idSociedadString = idSociedad.toString();
    this.formasPagoSociedadService.insertarFormaSociedad(formaPago.codigo, idSociedadString).subscribe(res => {
    });
    }




  }



}
