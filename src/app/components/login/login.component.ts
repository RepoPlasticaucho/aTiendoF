import { Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { faCopy, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { SociedadesEntity } from 'src/app/models/sociedades';
import { SociedadesService } from 'src/app/services/sociedades.service';
import { Session } from 'inspector';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  /** Based on the screen size, switch from standard to one column per row */

  faTimes = faTimes;
  faCopy = faCopy;
  faSave = faSave;
  token: string | undefined;

  mostrarIni: boolean = true;
  mostrarAct: boolean = false;
  mostrarCodigo: boolean = false;
  mostrarNuevaContrasena: boolean = false;

  mostrarRecuperar: boolean = false;

  codeForm = new FormGroup({
    codigo: new FormControl('', Validators.required),
  });

  recoverForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  newPasswordForm = new FormGroup({
    newPassword: new FormControl('', Validators.required),
    confirmPassword: new FormControl('', Validators.required),
  });

  cancelarNuevaContrasena() {
    this.mostrarNuevaContrasena = false;
    this.mostrarIni = true;
    this.newPasswordForm.reset();
  }

  onChagePassSubmit() {
    if (this.newPasswordForm.valid) {
      const passwnew = this.newPasswordForm.value.newPassword;
      const passconfirm = this.newPasswordForm.value.confirmPassword;

      if (passwnew == passconfirm) {
        // Aquí deberías cambiar la contraseña en tu backend
        var salt = CryptoJS.enc.Base64.parse("SXZhbiBNZWR2ZWRldg==");
        var iv = CryptoJS.enc.Hex.parse("69135769514102d0eded589ff874cacd");
        var key564Bits10000Iterations = CryptoJS.PBKDF2("Venus21!", salt, { keySize: 256 / 32 + 128 / 32, iterations: 10000, hasher: CryptoJS.algo.SHA512 });
        const pass = passwnew ?? ""
        var encrypted = CryptoJS.AES.encrypt(pass, key564Bits10000Iterations, {
          iv: iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7
        });

        this.passwre = pass;
        this.encPass = encrypted.toString();

        const userEntity: SociedadesEntity = {
          idGrupo: '',
          nombre_comercial: '',
          tipo_ambienteid: '',
          id_fiscal: '',
          email: '',
          telefono: '',
          password: this.token!,
          funcion: '',
          idSociedad: '',
          razon_social: '',
          sociedad_pertenece: '',
          almacen_personal_id: '',
          pass_certificado: this.encPass
        }

        this.httpService.actualizarPassw(userEntity).subscribe(res => {
          if (res){
            Swal.fire({
              icon: 'success',
              title: 'Contraseña actualizada correctamente.',
              showConfirmButton: true,
              confirmButtonText: "Ok"
            }).finally(() => {
              this.mostrarNuevaContrasena = false;
              this.mostrarIni = true;
              this.newPasswordForm.reset();
            });
          }

        });

      } else {

      }
    } else {
      this.newPasswordForm.markAllAsTouched();
    }
  }

  onNewPasswordSubmit() {
    if (this.newPasswordForm.valid) {
      const passwnew = this.newPasswordForm.value.newPassword;
      const passconfirm = this.newPasswordForm.value.confirmPassword;

      if (passwnew == passconfirm) {
        // Aquí deberías cambiar la contraseña en tu backend
        


      } else {

      }
    } else {
      this.newPasswordForm.markAllAsTouched();
    }
  }



  onCodeSubmit() {
    if (this.codeForm.valid) {
      const codigo = this.codeForm.value.codigo;
      // Aquí deberías verificar el código con tu backend
      

      //1. Construir sociedad
      const userEntity: SociedadesEntity = {
        idGrupo: '',
        nombre_comercial: '',
        tipo_ambienteid: '',
        id_fiscal: '',
        email: '',
        telefono: '',
        password: codigo!,
        funcion: '',
        idSociedad: '',
        razon_social: '',
        sociedad_pertenece: '',
        almacen_personal_id: ''
      }

      this.httpService.verificarCodigo(userEntity).subscribe(res => {
        console.log("FORM0001" + res);
        
        if(res!=null){
          //Mostar formulario de nueva contraseña
          this.mostrarCodigo = false;
          this.mostrarNuevaContrasena = true;
          this.token = codigo!;
          this.codeForm.reset();

        }else{
          Swal.fire({
            icon: 'error',
            title: 'Código Incorrecto.',
            text: 'El código ingresado no es válido.',
            showConfirmButton: true,
            confirmButtonText: "Ok"
          });
        }
        console.log("FORM2" + res);

      });



    } else {
      console.log("FORM")
      this.codeForm.markAllAsTouched();
    }
  }

  olvidoContrasena() {
    this.mostrarIni = false;
    this.mostrarRecuperar = true;
  }

  cancelarCodigo() {
    this.mostrarCodigo = false;
    this.mostrarIni = true;
    this.codeForm.reset();
  }
  cancelarRecuperacion() {
    this.mostrarRecuperar = false;
    this.mostrarIni = true;

    this.recoverForm.reset();
  }

  onRecoverSubmit() {
    if (this.recoverForm.valid) {
      const email = this.recoverForm.value.email;
      // Aquí podrías llamar a un servicio que maneje el envío de un correo electrónico de recuperación

      //Crear la sociedad

      const userEntity: SociedadesEntity = {
        idGrupo: '',
        nombre_comercial: '',
        tipo_ambienteid: '',
        id_fiscal: '',
        email: email!,
        telefono: '',
        password: '',
        funcion: '',
        idSociedad: '',
        razon_social: '',
        sociedad_pertenece: '',
        almacen_personal_id: ''
      }

    
      Swal.fire({
        title: 'Enviando correo...',
        html: 'Por favor espere un momento',
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading()
        },
      });
      
      this.httpService.recuperarContrasena(userEntity).subscribe(res => {
    //Mostrar pantalla de carga

        if (res.codigoError == "OK") {
          Swal.fire({
            icon: 'success',
            title: 'Correo enviado.',
            text: 'Se ha enviado un correo con las instrucciones para recuperar la contraseña.',
            showConfirmButton: true,
            confirmButtonText: "Ok"
          }).finally(() => {
            this.mostrarRecuperar = false;
            this.mostrarCodigo = true;
            this.recoverForm.reset();
            Swal.close();
          });
        } else {
          this.mostrarRecuperar = false;
          this.mostrarCodigo = true;
          this.recoverForm.reset();
          Swal.close();
        
        }
      });

    } else {
      this.recoverForm.markAllAsTouched();
    }
  }
  //Creación de la variable para formulario
  categoryForm = new FormGroup({
    categoria: new FormControl('', Validators.required),
    codigoSAP: new FormControl('', Validators.required),
    etiquetas: new FormControl('',),
  });
  corporationForm = new FormGroup({
    passwnew: new FormControl('', Validators.required),
    passconfirm: new FormControl('', Validators.required),
  });
  encPass2: string | undefined;
  fun: any;
  private db: any;
  encPass!: string;
  passwre!: string;
  constructor(private breakpointObserver: BreakpointObserver, private readonly httpService: SociedadesService, private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit(): void {


    if (!this.categoryForm.valid) {

      this.categoryForm.markAllAsTouched();
    } else {
      const userEntity: SociedadesEntity = {
        idGrupo: '',
        nombre_comercial: '',
        tipo_ambienteid: '',
        id_fiscal: '',
        email: this.categoryForm.value!.categoria ?? "",
        telefono: '',
        password: '',
        funcion: '',
        idSociedad: '',
        razon_social: '',
        sociedad_pertenece: '',
        almacen_personal_id: ''
      }


      this.httpService.obtenerUsuario(userEntity).subscribe(res => {

        //Si la sociedad es undefined se notifica y se retorna al login
        if (res.lstSociedades[0] == undefined) {
          Swal.fire({
            icon: 'error',
            title: 'Credenciales Incorrectas.'
          }).finally(() => {
            this.router.navigate(['/login-nav']);
          });
        }

        const idsociedad = res.lstSociedades[0].idSociedad;
        const idsociedad2 = res.lstSociedades[0].sociedad_pertenece;
        const idalmacenPertenece = res.lstSociedades[0].almacen_personal_id;
        const nombreComercial = res.lstSociedades[0].nombre_comercial;

        localStorage.setItem('sociedadid', idsociedad);
        localStorage.setItem('nombreComercial', nombreComercial);
        localStorage.setItem('id_fiscal', res.lstSociedades[0].id_fiscal);
        if (res.codigoError == "OK") {
          var salt = CryptoJS.enc.Base64.parse("SXZhbiBNZWR2ZWRldg==");
          var iv = CryptoJS.enc.Hex.parse("69135769514102d0eded589ff874cacd");
          var key564Bits10000Iterations = CryptoJS.PBKDF2("Venus21!", salt, { keySize: 256 / 32 + 128 / 32, iterations: 10000, hasher: CryptoJS.algo.SHA512 });
          const pass = this.categoryForm.value!.codigoSAP ?? ""
          var encrypted = CryptoJS.AES.encrypt(pass, key564Bits10000Iterations, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
          });

          this.passwre = pass;
          this.encPass = encrypted.toString();

          const sociedadEntity: SociedadesEntity = {
            idGrupo: '',
            nombre_comercial: '',
            id_fiscal: '',
            email: this.categoryForm.value!.categoria ?? "",
            funcion: '',
            tipo_ambienteid: '',
            telefono: '',
            password: this.encPass,
            idSociedad: '',
            razon_social: ''
          }
          switch (this.passwre) {
            case "venus22":
              this.httpService.obtenerSociedadL(sociedadEntity).subscribe(res => {
                if (res.codigoError == "OK") {
                  this.mostrarIni = false;
                  this.mostrarAct = true;
                } else{
                  Swal.fire({
                    icon: 'error',
                    title: 'Credenciales Incorrectas.'
                  }).finally(() => {
                    this.router.navigate(['/login-nav']);
                  });
                }
              });
              break;

            case "inicio22":
              this.httpService.obtenerSociedadL(sociedadEntity).subscribe(res => {
                if (res.codigoError == "OK") {
                  this.mostrarIni = false;
                  this.mostrarAct = true;
                } else {
                  Swal.fire({
                    icon: 'error',
                    title: 'Credenciales Incorrectas.'
                  }).finally(() => {
                    this.router.navigate(['/login-nav']);
                  });
                }
              });
              break;

            default:

    
              this.httpService.obtenerSociedadL(sociedadEntity).subscribe(res => {
                if (res.codigoError == "OK") {
                  const rol = res.lstSociedades[0].funcion;
                  const passwa = this.passwre;
                  localStorage.setItem('passwa', passwa);
                  switch (rol) {
                    case "admin":
                      Swal.fire({
                        icon: 'success',
                        title: 'Bienvenido Administrador!!!'
                      }).finally(() => {
                        this.router.navigate(['/navegation-adm']);
                      })
                      break;

                    case "client":
                      Swal.fire({
                        icon: 'success',
                        title: 'Bienvenido!!!'
                      }).finally(() => {
                        this.router.navigate(['/navegation-cl']);
                      })
                      break;

                      case "personal":
                        Swal.fire({
                          icon: 'success',
                          title: 'Bienvenido!!!'
                        }).finally(() => {


                          this.router.navigate(['/navegation-facturador']);
                          localStorage.setItem('sociedadid', idsociedad2!);
                          localStorage.setItem('almacenid', idalmacenPertenece!);
                          
                        })
                        break;

                  }
                } else {
                  Swal.fire({
                    icon: 'error',
                    title: 'Credenciales Incorrectas.'
                  }).finally(() => {
                    this.router.navigate(['/login-nav']);
                  });
                }
              

              });
              break;
          }
        } else {
          Swal.fire({
            icon: 'error',
            title: 'El usuario no existe.'
          }).finally(() => {
            this.router.navigate(['/login-nav']);
          });

        }
      })
    }
  }


  onSubmit2() {
    const passnuevo = this.corporationForm.value!.passwnew ?? "";
    const passconfirm = this.corporationForm.value!.passconfirm ?? "";

    if (!this.corporationForm.valid) {
      this.corporationForm.markAllAsTouched();
    } else {

      if ('venus22' == passconfirm || 'venus22' == passnuevo) {
        Swal.fire({
          icon: 'error',
          title: 'Contraseñas Identicas.',
          text: 'Ingrese contraseñas validas',
          showConfirmButton: false,
        });
      } else {

        if (passnuevo == passconfirm) {

          var salt = CryptoJS.enc.Base64.parse("SXZhbiBNZWR2ZWRldg==");
          var iv = CryptoJS.enc.Hex.parse("69135769514102d0eded589ff874cacd");
          var key564Bits10000Iterations = CryptoJS.PBKDF2("Venus21!", salt, { keySize: 256 / 32 + 128 / 32, iterations: 10000, hasher: CryptoJS.algo.SHA512 });

          var encrypted = CryptoJS.AES.encrypt(passnuevo, key564Bits10000Iterations, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
          });

          this.encPass2 = encrypted.toString();

          const userEntity: SociedadesEntity = {
            idGrupo: '',
            nombre_comercial: '',
            id_fiscal: '',
            tipo_ambienteid: '',
            email: '',
            telefono: '',
            password: this.encPass2,
            funcion: '',
            idSociedad: JSON.parse(localStorage.getItem('sociedadid') || "[]"),
            razon_social: ''
          }
          this.httpService.actualizarPass(userEntity).subscribe(res => {
            if (res.codigoError == "OK") {
              Swal.fire({
                icon: 'success',
                title: 'Actualizado Correctamente.',
                text: `Se ha actualizado la información`,
                showConfirmButton: true,
                confirmButtonText: "Ok"
              }).finally(() => {
                window.location.reload();
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
            title: 'No coinciden las contreseñas',
            text: 'Contraseña nueva y confirmacion no coinciden',
            showConfirmButton: false,
          });
        }

      }

    }
  }
}
