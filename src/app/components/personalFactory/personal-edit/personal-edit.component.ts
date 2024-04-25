import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faList, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import { AlmacenesEntity } from 'src/app/models/almacenes';
import { CiudadesEntity } from 'src/app/models/ciudades';
import { PersonalEntity } from 'src/app/models/personal';
import { ProveedoresEntity } from 'src/app/models/proveedores';
import { SociedadesEntity } from 'src/app/models/sociedades';
import { AlmacenesService } from 'src/app/services/almacenes.service';
import { CiudadesService } from 'src/app/services/ciudades.service';
import { PersonalService } from 'src/app/services/personal.service';
import { ProveedoresService } from 'src/app/services/proveedores.service';
import { SociedadesService } from 'src/app/services/sociedades.service';
import Swal from 'sweetalert2';
import * as CryptoJS from 'crypto-js';


@Component({
  selector: 'app-personal-edit',
  templateUrl: './personal-edit.component.html',
  styleUrls: ['./personal-edit.component.css']
})
export class PersonalEditComponent implements OnInit {
  //Iconos para la pagina de grupos
  faList = faList;
  faTimes = faTimes;
  faSave = faSave;
  encPass: string | undefined;

  //Variables para ejecucion del Form
  lstCiudades: CiudadesEntity[] = [];
  lstCiudades2: CiudadesEntity[] = [];
  lstAlmacenes: AlmacenesEntity[] = [];
  selectCiudad: boolean = false;
  private codigo: string = '';
  idPersonal: string = '';
  idAlmacenActual: string = '';
  //Creación de la variable para formulario
  personalForm = new FormGroup({
    nombre: new FormControl(''),
    correo: new FormControl('', [Validators.required]),
    telefono: new FormControl('', [Validators.required]),
    almacenes: new FormControl('', [Validators.required]),
    almacen: new FormControl('', [Validators.required]),
    password: new FormControl('',),
    confirmarPassword: new FormControl('',),
  })

  constructor(private readonly httpService: ProveedoresService,
    private router: Router,
    private readonly httpPersonal: PersonalService,
    private readonly httpServiceAlmacen: AlmacenesService,
    private readonly httpServiceSociedades: PersonalService,
    private readonly httpServiceSociedad: SociedadesService

  ) { }

  almacenes: AlmacenesEntity[] = [];
  almacenSeleccionado: string = '';
  nombreAlmacenSeleccionado: string = '';
  idAlmacenPersonal: string = '';
  password: string = '';
  confirmarPassword: string = '';
  cambiarContrasena: boolean = false;


  toggleCambiarContrasena() {
    console.log("Cambiar contraseña");
    this.cambiarContrasena = !this.cambiarContrasena;
  }

  ngOnInit(): void {

    this.httpPersonal.obtenerpersonal$.subscribe((res) => {
      if (res.idSociedad == '') {
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error.',
          text: 'No se ha obtenido información.',
          showConfirmButton: false,
        });
      } else {
        console.log("Res:", res);
        this.idAlmacenPersonal = res.almacen_personal_id ?? '';

        this.codigo = res.idSociedad ?? '';
        this.personalForm.get('nombre')?.setValue(res.nombre_personal);
        this.personalForm.get('correo')?.setValue(res.email);
        this.personalForm.get('telefono')?.setValue(res.telefono);
        this.almacenSeleccionado = res.almacen_personal_id ?? '';
        this.personalForm.get('almacenes')?.setValue(this.almacenSeleccionado);
        this.personalForm.get('almacen')?.setValue(res.almacen_personal_id!);
        this.nombreAlmacenSeleccionado = this.almacenes.find(x => x.idAlmacen == this.almacenSeleccionado)?.nombre_almacen ?? '';
        this.idPersonal = res.idSociedad ?? '';
        

        //Obtener el almacen en el que esta el personal
        this.httpServiceSociedad.obtenerAlmacenPertenece(this.idPersonal).subscribe(res => {
          this.idAlmacenActual = res
      })    
    };
    });


    
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
    //Imprimir el nuevo valor del formulario
  
    if(this.cambiarContrasena){
      //Si las contraseñas no coinciden
      if(this.personalForm.value.password != this.personalForm.value.confirmarPassword){
        Swal.fire({
          icon: 'error',
          title: 'Las contraseñas no coinciden.',
          text: 'Las contraseñas no coinciden, por favor verifique.',
          showConfirmButton: false,
        });
        return;
      }

      //Verificar que la contraseña tenga al menos 8 caracteres
      if(this.personalForm.value.password!.length < 8){
        Swal.fire({
          icon: 'error',
          title: 'La contraseña debe tener al menos 8 caracteres.',
          text: 'Por favor ingrese una contraseña con al menos 8 caracteres.',
          showConfirmButton: false,
        });
        return;
      }
    }
    

    if (!this.personalForm.valid) {
      this.personalForm.markAllAsTouched();
      console.log("Error");
    } else {
      console.log("Alamacen: ", this.personalForm.value.almacenes);
      console.log("Almacenes: ", this.personalForm.value.almacen);


      if(this.personalForm.value.almacenes == this.personalForm.value.almacen){
        this.personalForm.value.almacenes = this.idAlmacenActual;
        console.log("Entro aca");

        console.log("Almacen personal: ", this.idAlmacenActual);
      }

      const proveedorDatos: PersonalEntity = {
        nombre_personal: this.personalForm.value!.nombre ?? "",
        telefono: this.personalForm.value!.telefono ?? "",
        email: this.personalForm.value!.correo ?? "",
        password: "",
        idSociedad: this.idPersonal,
        sociedad_pertenece : "",
        funcion: '',
        tipo_ambienteid: '',
        idGrupo: '',
        almacen_personal_id: this.personalForm.value!.almacenes ?? ""
      }


      this.httpServiceSociedades.actualizarPersonal(proveedorDatos).subscribe(res => {
        if (res.codigoError == "OK") {
          Swal.fire({
            icon: 'success',
            title: 'Guardado Exitosamente.',
            text: `Se ha actualizado el proveedor ${this.personalForm.value.nombre}`,
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

      //Actualizar la contraseña
      if (this.cambiarContrasena) {
        this.actualizar();
      }
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
            title: 'No se pudo obtener las ciudades.',
            text: res.descripcionError,
            showConfirmButton: false,
          });
        } else {
          this.almacenes = res.lstAlmacenes;

        }
      })

    }
  }

  visualizarProveedores() {
    this.router.navigate([
      '/navegation-cl',
      { outlets: { contentClient: ['personal'] } },
    ]);
  }



  
  actualizar(){
    const passnuevo = this.personalForm.value!.password ?? "";
    const passconfirm = this.personalForm.value!.confirmarPassword ?? "";

    if (!this.personalForm.valid) {
      this.personalForm.markAllAsTouched();
      console.log("Error");
    } else {
      
      if ( passconfirm !== passnuevo) {
        
        Swal.fire({
          icon: 'error',
          title: 'Las contraseñas no coinciden.',
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
            tipo_ambienteid: '',
            id_fiscal: '',
            email: '',
            telefono: '',
            password: this.encPass,
            funcion: '',
            idSociedad: this.idPersonal,
            razon_social: ''
          }

          this.httpServiceSociedad.actualizarPass(userEntity).subscribe(res => {
            if (res.codigoError == "OK") {
              Swal.fire({
                icon: 'success',
                title: 'Actualizado Correctamente.',
                text: `Se ha actualizado la información`,
                showConfirmButton: true,
                confirmButtonText: "Ok"
              }).finally(() => {
                localStorage.setItem('passwa',passnuevo);
                this.router.navigate(['/navegation-cl', { outlets: { 'contentClient': ['personal'] } }]);
              }
            );
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

