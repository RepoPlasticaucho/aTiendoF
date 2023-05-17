import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faCopy, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import { SociedadesEntity } from 'src/app/models/sociedades';
import { SociedadesService } from 'src/app/services/sociedades.service';
import Swal from 'sweetalert2';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-usuario-pass',
  templateUrl: './usuario-pass.component.html',
  styleUrls: ['./usuario-pass.component.css']
})
export class UsuarioPassComponent implements OnInit {
  faTimes = faTimes;
  faCopy = faCopy;
  faSave = faSave;
  //Creación de la variable para formulario
  corporationForm = new FormGroup({
    nombreComercial1: new FormControl('', Validators.required),
    nombreComercial2: new FormControl('', Validators.required),
    razonSocial: new FormControl('', Validators.required),
   
  });
  encPass: string | undefined;
  fun: any;
  constructor( private readonly httpService: SociedadesService, private router: Router) { }

  ngOnInit(): void {

    const sociedad: SociedadesEntity = {
      idSociedad: JSON.parse(localStorage.getItem('sociedadid') || "[]"),
      idGrupo: '',
      nombre_comercial: '',
      id_fiscal: '',
      email: '',
      telefono: '',
      password: '',
      funcion: '',
      razon_social: ''
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
        this.corporationForm.get("razonSocial")?.setValue(localStorage.getItem('passwa') );
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
    const passconfirm = this.corporationForm.value!.nombreComercial1 ?? "";
    const passactual = this.corporationForm.value!.razonSocial ?? "";

    if (!this.corporationForm.valid) {
      this.corporationForm.markAllAsTouched();
    } else {
      
      if (passactual == passconfirm || passactual == passnuevo) {
        Swal.fire({
          icon: 'error',
          title: 'Contraseñas Identicas.',
          text: 'Ingrese contraseñas validas',
          showConfirmButton: false,
        });
      }else{

        if (passnuevo == passconfirm) {

          var salt = CryptoJS.enc.Base64.parse("SXZhbiBNZWR2ZWRldg==");
          var iv = CryptoJS.enc.Hex.parse("69135769514102d0eded589ff874cacd");
          var key564Bits10000Iterations = CryptoJS.PBKDF2("Venus21!", salt, {keySize: 256/32 + 128/32, iterations: 10000, hasher: CryptoJS.algo.SHA512});

          var encrypted = CryptoJS.AES.encrypt(passnuevo, key564Bits10000Iterations, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
          });

          this.encPass= encrypted.toString();

          const userEntity: SociedadesEntity = {
            idGrupo: '',
            nombre_comercial: '',
            id_fiscal: '',
            email: '',
            telefono: '',
            password: this.encPass,
            funcion: '',
            idSociedad: JSON.parse(localStorage.getItem('sociedadid')||"[]"),
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
