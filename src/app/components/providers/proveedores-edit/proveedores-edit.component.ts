import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faList, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import { CiudadesEntity } from 'src/app/models/ciudades';
import { ProveedoresEntity } from 'src/app/models/proveedores';
import { CiudadesService } from 'src/app/services/ciudades.service';
import { ProveedoresService } from 'src/app/services/proveedores.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-proveedores-edit',
  templateUrl: './proveedores-edit.component.html',
  styleUrls: ['./proveedores-edit.component.css']
})
export class ProveedoresEditComponent implements OnInit {
  //Iconos para la pagina de grupos
  faList = faList;
  faTimes = faTimes;
  faSave = faSave;
  //Variables para ejecucion del Form
  lstCiudades: CiudadesEntity[] = [];
  lstCiudades2: CiudadesEntity[] = [];
  selectCiudad: boolean = false;
  private codigo: string = '';
  //Creación de la variable para formulario
  proveedoresForm = new FormGroup({
    nombre: new FormControl(''),
    id_fiscal: new FormControl('', [Validators.required]),
    correo: new FormControl('', [Validators.required]),
    telefono: new FormControl('', [Validators.required]),
    ciudad: new FormControl('0', [Validators.required]),
    direccion: new FormControl('', [Validators.required]),
  })

  constructor(private readonly httpService: ProveedoresService,
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

    this.httpService.obtenerproveedor$.subscribe((res) => {
      if (res.id == '') {
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error.',
          text: 'No se ha obtenido información.',
          showConfirmButton: false,
        });
      } else {
        this.codigo = res.id ?? '';
        this.proveedoresForm.get('nombre')?.setValue(res.nombre);
        this.proveedoresForm.get('id_fiscal')?.setValue(res.id_fiscal);
        this.proveedoresForm.get('correo')?.setValue(res.correo);
        this.proveedoresForm.get('telefono')?.setValue(res.telefono);
        this.proveedoresForm.get('ciudad')?.setValue(res.ciudad!);
        this.proveedoresForm.get('direccion')?.setValue(res.direccionprov);
      }
    });

    // Extracción de la ciudad
    const ciudadnew: CiudadesEntity = {
      idCiudad: '',
      ciudad: this.proveedoresForm.value!.ciudad ?? '',
      provinciaid: '',
      provincia: '',
      codigo: '',
      created_at: '',
      update_at: '',
    };
    this.httpServiceCiudades.obtenerCiudadesN(ciudadnew).subscribe((res) => {
      if (res.codigoError != 'OK') {
        Swal.fire({
          icon: 'error',
          title: 'No se pudo obtener la Sociedad.',
          text: res.descripcionError,
          showConfirmButton: false,
        });
      } else {
        this.lstCiudades2 = res.lstCiudades;
      }
    });
  }

  onSubmit() {
    if (!this.proveedoresForm.valid) {
      this.proveedoresForm.markAllAsTouched();
      console.log("Error");
    } else {
      const proveedorDatos: ProveedoresEntity = {
        id: this.codigo,
        ciudadid: this.lstCiudades2[0].idCiudad ?? 0,
        id_fiscal: this.proveedoresForm.value!.id_fiscal ?? "",
        correo: this.proveedoresForm.value!.correo ?? "",
        direccionprov: this.proveedoresForm.value!.direccion ?? "",
        nombre: this.proveedoresForm.value!.nombre ?? "",
        telefono: this.proveedoresForm.value!.telefono ?? "",
      }
      this.httpService.actualizarProveedores(proveedorDatos).subscribe(res => {
        if (res.codigoError == "OK") {
          Swal.fire({
            icon: 'success',
            title: 'Guardado Exitosamente.',
            text: `Se ha actualizado el proveedor ${this.proveedoresForm.value.nombre}`,
            showConfirmButton: true,
            confirmButtonText: "Ok"
          }).finally(() => {
            this.router.navigate(['/navegation-adm', { outlets: { 'contentAdmin': ['proveedores'] } }]);
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
      '/navegation-adm',
      { outlets: { contentAdmin: ['proveedores'] } },
    ]);
  }

}

