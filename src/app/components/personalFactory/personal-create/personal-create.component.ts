import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faList, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import { CiudadesEntity } from 'src/app/models/ciudades';
import { PersonalEntity } from 'src/app/models/personal';
import { CiudadesService } from 'src/app/services/ciudades.service';
import { PersonalService } from 'src/app/services/personal.service';
import Swal from 'sweetalert2';

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
    nombre: new FormControl('', [Validators.required]),
    telefono: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    cedula: new FormControl('', [Validators.required]),
  })

  constructor(private readonly httpService: PersonalService,
    private router: Router,
    private readonly httpServiceCiudades: CiudadesService) { }

  ngOnInit(): void {
    this.httpServiceCiudades.obtenerCiudadesAll().subscribe(res => {
      if (res.codigoError != "OK") {
        Swal.fire({
          icon: 'error',
          title: 'No se pudo obtener las ciudades.',
          text: res.descripcionError,
          showConfirmButton: false,
        });
      } else {
        this.lstCiudades = res.lstCiudades;
      }
    });
  }

  onSubmit() {
    if (!this.proveedoresForm.valid) {
      this.proveedoresForm.markAllAsTouched();
      console.log("Error");
    } else {
      const personalDatos: PersonalEntity = {
        nombre_personal: this.proveedoresForm.value!.nombre ?? "",
        telefono: this.proveedoresForm.value!.telefono ?? "",
        email: this.proveedoresForm.value!.email ?? "",
        password: this.proveedoresForm.value!.password ?? "",
        idSociedad: JSON.parse(localStorage.getItem('sociedadid') || "[]"),
        sociedad_pertenece : JSON.parse(localStorage.getItem('sociedadid') || "[]"),
        funcion: 'personal',
        tipo_ambienteid: '1',
        idGrupo: '1',
        id_fiscal: this.proveedoresForm.value!.cedula ?? "",
        
      }
      this.httpService.agregarPersonal(personalDatos).subscribe(res => {
        if (res.codigoError == "OK") {
          Swal.fire({
            icon: 'success',
            title: 'Guardado Exitosamente.',
            text: `Se ha creado el personal ${this.proveedoresForm.value.nombre}`,
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
      this.httpServiceCiudades.obtenerCiudadesN(ciudad).subscribe(res => {
        if (res.codigoError != "OK") {
          Swal.fire({
            icon: 'error',
            title: 'No se pudo obtener las ciudades.',
            text: res.descripcionError,
            showConfirmButton: false,
          });
        } else {
          this.lstCiudades2 = res.lstCiudades;
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

}
