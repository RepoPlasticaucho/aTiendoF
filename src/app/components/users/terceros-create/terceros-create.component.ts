import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faSave, faTimes, faUserFriends } from '@fortawesome/free-solid-svg-icons';
import { ProvinciasEntity } from 'src/app/models/provincias';
import { ProvinciasService } from 'src/app/services/provincias.service';
import { TipotercerosEntity } from 'src/app/models/tipotercero';
import { TipousuariosEntity } from 'src/app/models/tipousuario';
import { CiudadesService } from 'src/app/services/ciudades.service';
import { CiudadesEntity } from 'src/app/models/ciudades';
import { SociedadesEntity } from 'src/app/models/sociedades';
import { AlmacenesEntity } from 'src/app/models/almacenes';
import { TercerosEntity } from 'src/app/models/terceros';
import { TercerosService } from 'src/app/services/terceros.service';
import { TipotercerosService } from 'src/app/services/tipotercero.service';
import { TipousuariosService } from 'src/app/services/tipousuario.service';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { SociedadesService } from 'src/app/services/sociedades.service';
import { AlmacenesService } from 'src/app/services/almacenes.service';

@Component({
  selector: 'app-terceros-create',
  templateUrl: './terceros-create.component.html',
  styleUrls: ['./terceros-create.component.css'],
  providers: [DatePipe]
})
export class TercerosCreateComponent implements OnInit {

  //Iconos para la pagina de grupos
  faTimes = faTimes;
  faUserFriends = faUserFriends;
  faSave = faSave;

  // Control de dígitos que ingresan al número de id
  idFiscalMaxLength: number = 0;
  email: string = '';

  //Creación de la variable para formulario
  TercerosForm = new FormGroup({
    sociedad: new FormControl('0', Validators.required),
    almacen: new FormControl('0', Validators.required),
    tipo_tercero: new FormControl('0', Validators.required),
    tipo_usuario: new FormControl('0', Validators.required),
    ciudad: new FormControl('0', Validators.required),
    provincia: new FormControl('0', Validators.required),
    nombre: new FormControl('', Validators.required),
    fecha_nac: new FormControl('', Validators.required),
    apellido: new FormControl('', Validators.required),
    id_fiscal: new FormControl('', Validators.required),
    correo: new FormControl('', Validators.required),
    direccion: new FormControl('', Validators.required),
    telefono: new FormControl('', Validators.required),
  });




  //Variables para listas desplegables

  lstProvincias: ProvinciasEntity[] = [];
  selectProvincias2: boolean = false;
  //selectProvicias: boolean = false;
  //Variables para ejecucion del Form
  lstCiudades: CiudadesEntity[] = [];
  lstCiudades2: CiudadesEntity[] = [];
  selectCiudades: boolean = false;

  lstTipoTerceros: TipotercerosEntity[] = [];
  lstTipoTerceros2: TipotercerosEntity[] = [];
  selectTipoTercero: boolean = false;

  lstTipoUsuarios: TipousuariosEntity[] = [];
  lstTipoUsuarios2: TipousuariosEntity[] = [];
  selectTipoUsuario: boolean = false;

  lstSociedades: SociedadesEntity[] = [];
  lstSociedades2: SociedadesEntity[] = [];
  selectSociedades: boolean = false;

  lstAlmacenes: AlmacenesEntity[] = [];
  lstAlmacenes2: AlmacenesEntity[] = [];
  selectAlmacenes: boolean = false;

  fechaSeleccionada: Date | null = null;

  constructor(
    private readonly httpService: TercerosService,
    private readonly httpServiceProvincias: ProvinciasService,
    private readonly httpServiceCiudades: CiudadesService,
    private readonly httpServiceTipoTercero: TipotercerosService,
    private readonly httpServiceTipoUsuario: TipousuariosService,
    private readonly httpServiceSociedades: SociedadesService,
    private readonly httpServiceAlmacenes: AlmacenesService,
    private datePipe: DatePipe,
    private router: Router) {
  }


  ngOnInit(): void {
    this.httpServiceTipoTercero.obtenerTipoterceros().subscribe(res => {
      if (res.codigoError != "OK") {
        Swal.fire({
          icon: 'error',
          title: 'No se pudo obtener la Sociedad.',
          text: res.descripcionError,
          showConfirmButton: false,
        });
      } else {
        this.lstTipoTerceros = res.lstTipo_Tercero;
      }
    });

    this.httpServiceProvincias.obtenerProvincias().subscribe(res => {
      if (res.codigoError != "OK") {
        Swal.fire({
          icon: 'error',
          title: 'No se pudo obtener la Sociedad.',
          text: res.descripcionError,
          showConfirmButton: false,
        });
      } else {
        this.lstProvincias = res.lstProvincias;
      }
    });

    this.httpServiceTipoUsuario.obtenerTipousuarios().subscribe(res => {
      if (res.codigoError != "OK") {
        Swal.fire({
          icon: 'error',
          title: 'No se pudo obtener la Sociedad.',
          text: res.descripcionError,
          showConfirmButton: false,
        });
      } else {
        this.lstTipoUsuarios = res.lstTipo_Usuario;
      }
    })

    this.httpServiceSociedades.obtenerSociedades().subscribe(res => {
      if (res.codigoError != "OK") {
        Swal.fire({
          icon: 'error',
          title: 'No se pudo obtener la Sociedad.',
          text: res.descripcionError,
          showConfirmButton: false,
        });
      } else {
        this.lstSociedades = res.lstSociedades;
      }
    })

  }

  fechaFormateada: any = '';

  onSubmit() {
    this.fechaFormateada = this.datePipe.transform(this.fechaSeleccionada, 'yyyy-MM-dd');

    if (!this.TercerosForm.valid) {
      this.TercerosForm.markAllAsTouched();
      console.log("Error");
    } else {
      const tercerodatos: TercerosEntity = {
        id: '',
        almacen_id: this.lstAlmacenes2[0].idAlmacen ?? 0,
        sociedad_id: this.lstSociedades2[0].idSociedad ?? 0,
        tipotercero_id: this.lstTipoTerceros2[0].idTipo_tercero ?? 0,
        tipousuario_id: this.lstTipoUsuarios2[0].idTipo_Usuario ?? 0,
        nombresociedad: this.TercerosForm.value!.sociedad ?? "",
        nombrealmacen: this.TercerosForm.value!.almacen ?? "",
        nombretercero: this.TercerosForm.value!.tipo_tercero ?? "",
        tipousuario: this.TercerosForm.value!.tipo_usuario ?? "",
        nombre: (this.TercerosForm.value!.nombre ?? "").concat(" " + this.TercerosForm.value!.apellido ?? ""),
        id_fiscal: this.TercerosForm.value!.id_fiscal ?? "",
        direccion: this.TercerosForm.value!.direccion ?? "",
        telefono: this.TercerosForm.value!.telefono ?? "",
        correo: this.TercerosForm.value!.correo ?? "",
        fecha_nac: this.fechaFormateada ?? "",
        ciudad: this.TercerosForm.value!.ciudad ?? '',
        provincia: this.TercerosForm.value!.provincia ?? "",
        ciudadid: this.lstCiudades2[0].idCiudad ?? 0
      }
      console.log(tercerodatos);

      this.httpService.agregarTerceros(tercerodatos).subscribe(res => {
        if (res.codigoError == "OK") {
          Swal.fire({
            icon: 'success',
            title: 'Guardado Exitosamente.',
            text: `Se ha creado el usuario ${this.TercerosForm.value.nombre?.concat(" " + this.TercerosForm.value.apellido)}`,
            showConfirmButton: true,
            confirmButtonText: "Ok"
          }).finally(() => {
            this.router.navigate(['/navegation-adm', { outlets: { 'contentAdmin': ['terceros'] } }]);
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

  // Combo dependendiente de evento 
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

  //Validaciones de comboxs 
  changeGroup1(ciudad: any): void {
    if (ciudad.target.value == 0) {
      this.selectCiudades = true;
    } else {
      this.selectCiudades = false;

      // Obtener la ciudad seleccionada
      const ciudadnew: CiudadesEntity = {
        idCiudad: '',
        ciudad: ciudad.target.value,
        provinciaid: '',
        provincia: '',
        codigo: '',
        created_at: '',
        update_at: ''
      }
      this.httpServiceCiudades.obtenerCiudadesN(ciudadnew).subscribe(res => {
        if (res.codigoError != "OK") {
          Swal.fire({
            icon: 'error',
            title: 'No se pudo obtener la Sociedad.',
            text: res.descripcionError,
            showConfirmButton: false,
          });
        } else {
          this.lstCiudades2 = res.lstCiudades
        }
      })
    }
  }

  changeGroup2(tipo_tercero: any): void {
    if (tipo_tercero.target.value == 0) {
      this.selectTipoTercero = true;
      this.idFiscalMaxLength = 0;
    } else {
      this.selectTipoTercero = false;

      // Control de ingreso 
      const selectedValue = tipo_tercero.target.value;
      if (selectedValue == 'RUC') {
        this.idFiscalMaxLength = 13;
      } else if (selectedValue === 'CEDULA') {
        this.idFiscalMaxLength = 10;
      } else if (selectedValue === 'PASAPORTE') {
        this.idFiscalMaxLength = 12;
      } else if (selectedValue === 'VENTA A CONSUMIDOR FINAL') {
        this.idFiscalMaxLength = 10;
      } else if (selectedValue === 'IDENTIFICACION DELEXTERIOR') {
        this.idFiscalMaxLength = 16;
      }
      //
      // Limpia el valor del input
      this.TercerosForm.get('id_fiscal')?.setValue('');
      // Obtener ID de tipo_tercero
      const tipo_terceronew: TipotercerosEntity = {
        idTipo_tercero: '',
        descripcion: tipo_tercero.target.value,
        codigo: '',
        created_at: '',
        update_at: ''
      }
      this.httpServiceTipoTercero.obtenerTipoTercerosN(tipo_terceronew).subscribe(res => {
        if (res.codigoError != "OK") {
          Swal.fire({
            icon: 'error',
            title: 'No se pudo obtener la Sociedad.',
            text: res.descripcionError,
            showConfirmButton: false,
          });
        } else {
          this.lstTipoTerceros2 = res.lstTipo_Tercero;
        }
      })
    }

    //this.warehousesForm.get("sociedad")?.setValue(sociedad.target.value);
  }

  changeGroup3(tipousuario: any): void {
    if (tipousuario.target.value == 0) {
      this.selectTipoUsuario = true;
    } else {
      this.selectTipoUsuario = false;

      // Obtener ID de tipo_usuario

      const tipo_usuarionew: TipousuariosEntity = {
        idTipo_Usuario: '',
        usuario: tipousuario.target.value
      }
      this.httpServiceTipoUsuario.obtenerTipoUsuariosN(tipo_usuarionew).subscribe(res => {
        if (res.codigoError != "OK") {
          Swal.fire({
            icon: 'error',
            title: 'No se pudo obtener la Sociedad.',
            text: res.descripcionError,
            showConfirmButton: false,
          });
        } else {
          this.lstTipoUsuarios2 = res.lstTipo_Usuario;
        }
      })

      //this.warehousesForm.get("sociedad")?.setValue(sociedad.target.value);
    }
  }



  // Combo dependendiente de evento 
  onSelect1(e: any) {

    if (e.target.value == 0) {
      this.selectSociedades = true;
    } else {
      this.selectSociedades = false;
    }
    if (e.target.value == null || undefined) {
      this.lstAlmacenes = [];
    } else {
      const sociedad: SociedadesEntity = {
        idGrupo: '',
        nombre_comercial: e.target.value,
        idSociedad: '',
        nombreGrupo: '',
        razon_social: '',
        id_fiscal: '',
        email: '',
        telefono: '',
        password: '',
        funcion: ''
      }

      this.httpServiceSociedades.obtenerSociedadesN(sociedad).subscribe(res => {
        if (res.codigoError != "OK") {
          Swal.fire({
            icon: 'error',
            title: 'No se pudo obtener la Sociedad.',
            text: res.descripcionError,
            showConfirmButton: false,
          });
        } else {
          this.lstSociedades2 = res.lstSociedades;
        }
      })
      
      this.httpServiceAlmacenes.obtenerAlmacenesS(sociedad).subscribe(res => {
        if (res.codigoError != "OK") {
          Swal.fire({
            icon: 'error',
            title: 'No se pudo obtener la Sociedad.',
            text: res.descripcionError,
            showConfirmButton: false,
          });
          this.lstAlmacenes = [];

        } else {
          this.lstAlmacenes = res.lstAlmacenes;
        }
      })
       
    }
    
  }
 

  changeGroup5(almacen: any): void {
    if (almacen.target.value == 0) {
      this.selectAlmacenes = true;
    } else {
      this.selectAlmacenes = false;

      // Obtener ID de almacenes

      const almacenNew: AlmacenesEntity = {
        idAlmacen: '',
        sociedad_id: '',
        nombresociedad: '',
        direccion: almacen.target.value,
        telefono: '',
        codigo: '',
        pto_emision: ''
      }
      this.httpServiceAlmacenes.obtenerAlmacenN(almacenNew).subscribe(res => {
        if (res.codigoError != "OK") {
          Swal.fire({
            icon: 'error',
            title: 'No se pudo obtener la Sociedad.',
            text: res.descripcionError,
            showConfirmButton: false,
          });
        } else {
          this.lstAlmacenes2 = res.lstAlmacenes;
        }
      })
    }
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
  }

  keyPressLetters(event: any) {
    const charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode < 65 || charCode > 90) && (charCode < 97 || charCode > 122) && (charCode !== 32)) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }


  visualizarTerceros() {
    this.router.navigate(['/navegation-adm', { outlets: { 'contentAdmin': ['terceros'] } }]);
  }


}