import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faList, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import { CiudadesEntity } from 'src/app/models/ciudades';
import { ProveedoresEntity } from 'src/app/models/proveedores';
import { ProvinciasEntity } from 'src/app/models/provincias';
import { ProvinciasService } from 'src/app/services/provincias.service';
import { CiudadesService } from 'src/app/services/ciudades.service';
import { ProveedoresService } from 'src/app/services/proveedores.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-nuevo-proveedor',
  templateUrl: './nuevo-proveedor.component.html',
  styleUrls: ['./nuevo-proveedor.component.css']
})
export class NuevoProveedorComponent implements OnInit {
//Iconos para la pagina de grupos
faList = faList;
faTimes = faTimes;
faSave = faSave;
//Variables para ejecucion del Form
lstCiudades: CiudadesEntity[] = [];
lstCiudades2: CiudadesEntity[] = [];
selectCiudad: boolean = false;

lstProvincias: ProvinciasEntity[] = [];
selectProvincias2: boolean = false;
//Creación de la variable para formulario
proveedoresForm = new FormGroup({
  nombre: new FormControl(''),
  id_fiscal: new FormControl('', [Validators.required]),
  correo: new FormControl('', [Validators.required]),
  telefono: new FormControl('', [Validators.required]),
  ciudad: new FormControl('0', [Validators.required]),
  direccion: new FormControl('', [Validators.required]),
  provincia: new FormControl('0', Validators.required)
})

constructor(private readonly httpService: ProveedoresService,
  private router: Router,
  private readonly httpServiceCiudades: CiudadesService,
  private readonly httpServiceProvincias: ProvinciasService) { }

ngOnInit(): void {

  this.httpServiceProvincias.obtenerProvincias().subscribe(res => {
    if (res.codigoError != "OK") {
      Swal.fire({
        icon: 'error',
        title: 'No se pudo encontrar ciudades.',
        text: 'No existen datos',
        showConfirmButton: false,
      });
    } else {
      this.lstProvincias = res.lstProvincias;
    }
  });

}

onSubmit() {
  console.log(this.proveedoresForm.valid);
  console.log(this.proveedoresForm.get('ciudad')?.value == '0')
  if (!this.proveedoresForm.valid) {
    this.proveedoresForm.markAllAsTouched();
    Swal.fire({
      icon: 'error',
      title: 'Ha ocurrido un error.',
      text: 'Debe llenar todos los campos',
      showConfirmButton: false,
    });
  } else {
    if(this.proveedoresForm.get('ciudad')?.value != '0'){
      const proveedorDatos: ProveedoresEntity = {
        id: '',
        ciudadid: this.lstCiudades2[0].idCiudad ?? 0,
        id_fiscal: this.proveedoresForm.value!.id_fiscal ?? "",
        correo: this.proveedoresForm.value!.correo ?? "",
        direccionprov: this.proveedoresForm.value!.direccion ?? "",
        nombre: this.proveedoresForm.value!.nombre ?? "",
        telefono: this.proveedoresForm.value!.telefono ?? "",
        sociedad_id : JSON.parse(localStorage.getItem('sociedadid') || "[]")
      }
      this.httpService.agregarProveedores(proveedorDatos).subscribe(res => {
        if (res.codigoError == "OK") {
          Swal.fire({
            icon: 'success',
            title: 'Guardado Exitosamente.',
            text: `Se ha creado el proveedor ${this.proveedoresForm.value.nombre}`,
            showConfirmButton: true,
            confirmButtonText: "Ok"
          }).finally(() => {
            this.router.navigate(['/navegation-cl', { outlets: { 'contentClient': ['menucompr'] } }]);
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
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Ha ocurrido un error.',
        text: 'Debe llenar todos los campos',
        showConfirmButton: false,
      });
    }
  }
}

onSelect(e: any) {

  if (e.target.value == 0) {
    this.selectProvincias2 = true;
  } else {
    this.selectProvincias2 = false;
  }
  if (e.target.value == null || undefined) {
    this.lstCiudades = [];
  } else {
    const provincian: ProvinciasEntity = {
      id: '',
      provincia: e.target.value,
      codigo: '',
      created_at: '',
      update_at: ''
    }
    //console.log(provincian);
    this.httpServiceCiudades.obtenerCiudades(provincian).subscribe(res => {
      if (res.codigoError != "OK") {
        Swal.fire({
          icon: 'error',
          title: 'No se pudo obtener la Sociedad.',
          text: res.descripcionError,
          showConfirmButton: false,
        });
        this.lstCiudades = [];

      } else {
        this.lstCiudades = res.lstCiudades;

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
    console.log('CIUDAD ERROR')
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
    { outlets: { contentClient: ['menucompr'] } },
  ]);
}

}
