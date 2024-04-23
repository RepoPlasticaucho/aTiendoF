import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faList, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import { CiudadesEntity } from 'src/app/models/ciudades';
import { PersonalEntity } from 'src/app/models/personal';
import { CiudadesService } from 'src/app/services/ciudades.service';
import { PersonalService } from 'src/app/services/personal.service';
import Swal from 'sweetalert2';
import * as CryptoJS from 'crypto-js';
import { AlmacenesService } from 'src/app/services/almacenes.service';
import { SociedadesEntity } from 'src/app/models/sociedades';
import { AlmacenesEntity } from 'src/app/models/almacenes';


@Component({
  selector: 'app-personal-create',
  templateUrl: './personal-create.component.html',
  styleUrls: ['./personal-create.component.css']
})
export class PersonalCreateComponent implements OnInit {

  //Iconos para la pagina de grupos
  faList = faList;
  faTimes = faTimes;
  faSave = faSave;
  //Variables para ejecucion del Form
  lstCiudades: CiudadesEntity[] = [];
  lstCiudades2: CiudadesEntity[] = [];
  selectCiudad: boolean = false;
  //Creación de la variable para formulario
  proveedoresForm = new FormGroup({
    nombre_personal: new FormControl('', [Validators.required]),
    telefono: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.email, Validators.required]),
    cedula: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required]),
    almacenes: new FormControl('', [Validators.required]),
  })

  

  constructor(private readonly httpService: PersonalService,
    private router: Router,
    private readonly httpServiceAlmacen: AlmacenesService,
    

  ) { }
    
  almacenes: AlmacenesEntity[] = [];
    
  ngOnInit(): void {
    //Crear el objeto de la sociedad

    const sociedadNew: SociedadesEntity = {
      idGrupo: '',
      idSociedad: localStorage.getItem('sociedadid')!,
      razon_social: '',
      nombre_comercial: '',
      id_fiscal: '',
      email: '',
      telefono: '',
      tipo_ambienteid: '',
      password: '',
      funcion: ''
    }


    this.httpServiceAlmacen.obtenerAlmacenesSociedad(sociedadNew).subscribe(res => {
      if (res.codigoError != "OK") {
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error.',
          text: res.descripcionError,
          showConfirmButton: false,
        });
      } else {
        //Guardar en una lista para luego listarla en un select
        this.almacenes=res.lstAlmacenes;
      }
    });

  }

  onSubmit() {

    if (!this.proveedoresForm.valid) {
      this.proveedoresForm.markAllAsTouched();
      console.log("Error");
    } else {
      //Verficar si las contraseñas coinciden
      if (this.proveedoresForm.value!.password != this.proveedoresForm.value!.confirmPassword) {
        Swal.fire({
          icon: 'error',
          title: 'Las contraseñas no coinciden.',
          text: 'Por favor verifique las contraseñas.',
          showConfirmButton: false,
        });
        return;
      }

      var salt = CryptoJS.enc.Base64.parse("SXZhbiBNZWR2ZWRldg==");
      var key564Bits10000Iterations = CryptoJS.PBKDF2("Venus21!", salt, { keySize: 256 / 32 + 128 / 32, iterations: 10000, hasher: CryptoJS.algo.SHA512 });
      var iv = CryptoJS.enc.Hex.parse("69135769514102d0eded589ff874cacd");
      var encrypted = CryptoJS.AES.encrypt( this.proveedoresForm.value!.password ?? "", key564Bits10000Iterations, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });

      var encPass = encrypted.toString();


      const personalDatos: PersonalEntity = {
        nombre_personal: this.proveedoresForm.value!.nombre_personal ?? "",
        telefono: this.proveedoresForm.value!.telefono ?? "",
        email: this.proveedoresForm.value!.email ?? "",
        password: encPass,
        idSociedad: JSON.parse(localStorage.getItem('sociedadid') || "[]"),
        sociedad_pertenece : JSON.parse(localStorage.getItem('sociedadid') || "[]"),
        funcion: 'personal',
        tipo_ambienteid: '1',
        idGrupo: '1',
        id_fiscal: this.proveedoresForm.value!.cedula ?? "",  
        almacen_personal_id: this.proveedoresForm.value!.almacenes ?? ""
      }

      this.httpService.agregarPersonal(personalDatos).subscribe(res => {
        if (res.codigoError == "OK") {
          Swal.fire({
            icon: 'success',
            title: 'Guardado Exitosamente.',
            text: `Se ha creado el personal ${this.proveedoresForm.value.nombre_personal}`,
            showConfirmButton: true,
            confirmButtonText: "Ok"
          }).finally(() => {
            this.router.navigate(['/navegation-cl', { outlets: { 'contentClient': ['personal'] } }]);
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

  changeGroup(e: any) {

    if (e.target.value == 0) {
      this.selectCiudad = true;
    } else {
      this.selectCiudad = false;
    }
    if (e.target.value == null || undefined) {

    } else {
      const ciudad: CiudadesEntity = {
        idCiudad: '',
        ciudad: e.target.value,
        provinciaid: '',
        provincia: '',
        codigo: '',
        created_at: '',
        update_at: ''
      }
      
    }   
  }

  visualizarProveedores() {
    this.router.navigate([
      '/navegation-cl',
      { outlets: { contentClient: ['personal'] } },
    ]);
  }

}
