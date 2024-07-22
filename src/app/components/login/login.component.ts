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

  mostrarIni: boolean = true;
  mostrarAct: boolean = false;
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
