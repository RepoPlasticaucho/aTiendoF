import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faList, faSave, faTimes, faSearch } from '@fortawesome/free-solid-svg-icons';
import { CiudadesEntity } from 'src/app/models/ciudades';
import { ProveedoresEntity } from 'src/app/models/proveedores';
import { CiudadesService } from 'src/app/services/ciudades.service';
import { ProveedoresService } from 'src/app/services/proveedores.service';
import Swal from 'sweetalert2';
import { ProvinciasEntity } from 'src/app/models/provincias';
import { ProvinciasService } from 'src/app/services/provincias.service';

@Component({
  selector: 'app-proveedores-create',
  templateUrl: './proveedores-create.component.html',
  styleUrls: ['./proveedores-create.component.css']
})
export class ProveedoresCreateComponent implements OnInit {
//Iconos para la pagina de grupos
faList = faList;
faTimes = faTimes;
faSave = faSave;
faSearch = faSearch;
//Variables para ejecucion del Form
lstCiudades: CiudadesEntity[] = [];
lstCiudades2: CiudadesEntity[] = [];
selectCiudad: boolean = false;

lstProvincias: ProvinciasEntity[] = [];
selectProvincias2: boolean = false;
errorAutorizacion: boolean = false;
auxCi = '';
//Creación de la variable para formulario
proveedoresForm = new FormGroup({
  nombre: new FormControl('', [Validators.required]),
  id_fiscal: new FormControl('', [Validators.required]),
  correo: new FormControl('', [Validators.email, Validators.required]),
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
        ciudadid:  this.lstCiudades[0].idCiudad ?? '0',
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
    { outlets: { contentClient: ['proveedores'] } },
  ]);
}
keyPressNumbers(event: any) {
  var charCode = (event.which) ? event.which : event.keyCode;
  // Only Numbers 0-9
  if ((charCode < 48 || charCode > 57)) {
    event.preventDefault();
    
    return false;
  } else {
    return true;
  }

  //Si ya esta mas de 13 digitos ignorar

}



keyPressValidator13(event: any){
  //Validar que sea numero
  var charCode = (event.which) ? event.which : event.keyCode;
  // Only Numbers 0-9
  if ((charCode < 48 || charCode > 57)) {
    event.preventDefault();
    return false;
  } else {
      //Validar que autorizacion tenga 10 o 49 digitos
    if (event.target.value.length !== 13) {
      this.errorAutorizacion = true
    }
    if (event.target.value.length == 13) {
      this.errorAutorizacion = false
    }
    return true;
  }
}

obtenerProveedores() {
  // Metodo para obtener los proveedores mediante el RUC
  const proveedorDatos: ProveedoresEntity = {
    id: '',
    ciudadid: "0",
    id_fiscal: this.proveedoresForm.value!.id_fiscal ?? "",
    correo: '',
    direccionprov: '',
    nombre: '',
    telefono: '',
    sociedad_id: JSON.parse(localStorage.getItem('sociedadid') || "[]")
  };

  this.httpService.obtenerProveedoresRUC(proveedorDatos).subscribe(res => {
    if (res.codigoError !== "OK") {
      Swal.fire({
        icon: 'error',
        title: 'No se pudo obtener el proveedor.',
        text: res.descripcionError,
        showConfirmButton: false,
      });
    } else {
      if (res.lstProveedores.length > 0) {
        const proveedor = res.lstProveedores[0];
        this.auxCi = proveedor.ciudad!;

        // Primero, carga las ciudades de la provincia del proveedor
        this.onSelect2(proveedor.nombre_sociedad!); // Llama a onSelect con la provincia

        // Espera un momento para que las ciudades se carguen antes de actualizar el formulario
        setTimeout(() => {
          this.proveedoresForm.patchValue({
            nombre: proveedor.nombre,
            correo: proveedor.correo,
            telefono: proveedor.telefono,
            direccion: proveedor.direccionprov,
            id_fiscal: proveedor.id_fiscal,
            provincia: proveedor.nombre_sociedad,
            ciudad: this.auxCi // Selecciona la ciudad
          });
        }, 1000); // Ajusta el tiempo de espera según sea necesario
      } else {
        Swal.fire({
          icon: 'error',
          title: 'No se pudo obtener el proveedor.',
          text: 'No se encontraron datos',
          showConfirmButton: false,
        });
      }
    }
  });
}

onSelect2(provincia: string) {
  if (!provincia || provincia === '0') {
    this.selectProvincias2 = true;
    this.lstCiudades = [];
  } else {
    this.selectProvincias2 = false;
    const provinciaEntity: ProvinciasEntity = {
      id: '',
      provincia: provincia,
      codigo: '',
      created_at: '',
      update_at: ''
    };

    // Llama al servicio para obtener las ciudades de la provincia seleccionada
    this.httpServiceCiudades.obtenerCiudades(provinciaEntity).subscribe(res => {
      if (res.codigoError !== "OK") {
        Swal.fire({
          icon: 'error',
          title: 'No se pudieron obtener las ciudades.',
          text: res.descripcionError,
          showConfirmButton: false,
        });
        this.lstCiudades = [];
      } else {
        this.lstCiudades = res.lstCiudades;
      }
    });
  }
}

//Ignorar si se escribio mas de 13 digitos

}
