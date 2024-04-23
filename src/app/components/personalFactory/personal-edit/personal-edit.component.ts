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
  //Variables para ejecucion del Form
  lstCiudades: CiudadesEntity[] = [];
  lstCiudades2: CiudadesEntity[] = [];
  lstAlmacenes: AlmacenesEntity[] = [];
  selectCiudad: boolean = false;
  private codigo: string = '';
  idPersonal: string = '';
  //Creación de la variable para formulario
  proveedoresForm = new FormGroup({
    nombre: new FormControl(''),
    correo: new FormControl('', [Validators.required]),
    telefono: new FormControl('', [Validators.required]),
    almacenes: new FormControl('', [Validators.required]),
    almacen: new FormControl('', [Validators.required]),
  })

  constructor(private readonly httpService: ProveedoresService,
    private router: Router,
    private readonly httpPersonal: PersonalService,
    private readonly httpServiceAlmacen: AlmacenesService,
    private readonly httpServiceSociedades: PersonalService

  ) { }

  almacenes: AlmacenesEntity[] = [];
  almacenSeleccionado: string = '';
  nombreAlmacenSeleccionado: string = '';

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
        this.codigo = res.idSociedad ?? '';
        this.proveedoresForm.get('nombre')?.setValue(res.nombre_personal);
        this.proveedoresForm.get('correo')?.setValue(res.email);
        this.proveedoresForm.get('telefono')?.setValue(res.telefono);
        this.almacenSeleccionado = res.almacen_personal_id ?? '';
        this.proveedoresForm.get('almacenes')?.setValue(this.almacenSeleccionado);
        this.proveedoresForm.get('almacen')?.setValue(res.almacen_personal_id!);
        this.nombreAlmacenSeleccionado = this.almacenes.find(x => x.idAlmacen == this.almacenSeleccionado)?.nombre_almacen ?? '';
        this.idPersonal = res.idSociedad ?? '';
      }
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
    if (!this.proveedoresForm.valid) {
      this.proveedoresForm.markAllAsTouched();
      console.log("Error");
    } else {
      const proveedorDatos: PersonalEntity = {
        nombre_personal: this.proveedoresForm.value!.nombre ?? "",
        telefono: this.proveedoresForm.value!.telefono ?? "",
        email: this.proveedoresForm.value!.correo ?? "",
        password: "",
        idSociedad: this.idPersonal,
        sociedad_pertenece : "",
        funcion: '',
        tipo_ambienteid: '',
        idGrupo: '',
        almacen_personal_id: this.proveedoresForm.value!.almacenes ?? ""
      }

      this.httpServiceSociedades.actualizarPersonal(proveedorDatos).subscribe(res => {
        if (res.codigoError == "OK") {
          Swal.fire({
            icon: 'success',
            title: 'Guardado Exitosamente.',
            text: `Se ha actualizado el proveedor ${this.proveedoresForm.value.nombre}`,
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

}

