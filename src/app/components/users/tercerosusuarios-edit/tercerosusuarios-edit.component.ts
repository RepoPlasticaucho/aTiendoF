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
import { TercerosEntity } from 'src/app/models/terceros';
import { TercerosService } from 'src/app/services/terceros.service';
import { TipotercerosService } from 'src/app/services/tipotercero.service';
import { TipousuariosService } from 'src/app/services/tipousuario.service';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tercerosusuarios-edit',
  templateUrl: './tercerosusuarios-edit.component.html',
  styleUrls: ['./tercerosusuarios-edit.component.css'],
  providers: [DatePipe]
})
export class TercerosusuariosEditComponent implements OnInit {

   //Iconos para la pagina de grupos
  faTimes = faTimes;
  faUserFriends = faUserFriends;
  faSave = faSave;

  // Control de dígitos que ingresan al número de id
  idFiscalMaxLength: number = 25;


  //Declaracion de variables
  private codigo: string = "";
  private nombreCompleto: string = "";

  //Creación de la variable para formulario
  TercerosForm = new FormGroup({
    tipo_tercero: new FormControl('',Validators.required),
    tipo_usuario: new FormControl('',Validators.required),
    ciudad: new FormControl('', ),
    provincia: new FormControl('', Validators.required),
    nombre: new FormControl('', Validators.required),
    apellido: new FormControl('', Validators.required),
    fecha_nac: new FormControl('', Validators.required),
    id_fiscal: new FormControl('', Validators.required),
    correo: new FormControl('', Validators.required),
    direccion: new FormControl('', Validators.required),
    telefono: new FormControl('', Validators.required),
  });

  


  //Variables para listas desplegables

  lstProvincias: ProvinciasEntity[] = [];
  selectProvincias: ProvinciasEntity = {
    id: '0',
    provincia: '',
    codigo: '',
    created_at: '',
    update_at: ''
  };

  selectProvincias2: boolean = false;
  
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

  fechaSeleccionada: Date | null = null;

  constructor(
    private readonly httpService: TercerosService,
    private readonly httpServiceProvincias: ProvinciasService,
    private readonly httpServiceCiudades: CiudadesService,
    private readonly httpServiceTipoTercero: TipotercerosService,
    private readonly httpServiceTipoUsuario: TipousuariosService,
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

    this.httpService.obtenertercero$.subscribe(res => {
      if (res.id == "") {
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error.',
          text: 'No se ha obtenido información.',
          showConfirmButton: false,
        });
      } else {
        this.codigo = res.id ?? "";
        this.TercerosForm.get("tipo_usuario")?.setValue(res.tipousuario);
        this.TercerosForm.get("tipo_tercero")?.setValue(res.nombretercero);
        this.TercerosForm.get("id_fiscal")?.setValue(res.id_fiscal);

        this.nombreCompleto = res.nombre;
        const nombreApellido = this.nombreCompleto.split(' ');
        this.TercerosForm.get("nombre")?.setValue(nombreApellido[0] + ' ' + nombreApellido[1]);
        this.TercerosForm.get("apellido")?.setValue(nombreApellido[2] + ' ' + nombreApellido[3]);

        this.TercerosForm.get("correo")?.setValue(res.correo);
        this.TercerosForm.get("telefono")?.setValue(res.telefono);
        this.TercerosForm.get("provincia")?.setValue(res.provincia);
        this.TercerosForm.get("ciudad")?.setValue(res.ciudad);
        this.TercerosForm.get("direccion")?.setValue(res.direccion);
        this.fechaSeleccionada = new Date(res.fecha_nac);
        this.TercerosForm.get("fecha_nac")?.setValue(this.fechaSeleccionada.toISOString());
      }
    });

    
    // Extracción de tipousuario_id precargado
    const tipo_usuarionew: TipousuariosEntity = {
      idTipo_Usuario: '',
      usuario: this.TercerosForm.value!.tipo_usuario ?? ""
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

    // Extracción de tipotercero_id precargado

    const tipo_terceronew: TipotercerosEntity = {
      idTipo_tercero: '',
      descripcion: this.TercerosForm.value!.tipo_tercero ?? "",
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

    // Extracción de la provincia

    const provincian: ProvinciasEntity = {
      id: '',
      provincia: this.TercerosForm.value!.provincia ?? "",
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

    // Extracción de la ciudad
    const ciudadnew: CiudadesEntity = {
      idCiudad: '',
      ciudad: this.TercerosForm.value!.ciudad ?? '',
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
  fechaFormateada: any = '';

  onSubmit() {
    this.fechaFormateada = this.datePipe.transform(this.fechaSeleccionada, 'yyyy-MM-dd');

    if (!this.TercerosForm.valid) {
      this.TercerosForm.markAllAsTouched();
      console.log("Error");
    } else {
      const tercerodatos: TercerosEntity = {
      id: this.codigo,
      almacen_id: JSON.parse(localStorage.getItem('almacenid') || "[]"),
      sociedad_id: JSON.parse(localStorage.getItem('sociedadid') || "[]"),
      tipotercero_id: this.lstTipoTerceros2[0].idTipo_tercero ?? 0,
      tipousuario_id: this.lstTipoUsuarios2[0].idTipo_Usuario ?? 0,
      nombresociedad: '',
      nombrealmacen: '',
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

    this.httpService.actualizarTerceros(tercerodatos).subscribe(res => {
      if (res.codigoError == "OK") {
        Swal.fire({
          icon: 'success',
          title: 'Actualizado Exitosamente.',
          text: `Se ha actualizado la información`,
          showConfirmButton: true,
          confirmButtonText: "Ok"
        }).finally(() => {
          this.router.navigate(['/navegation-cl', { outlets: { 'contentClient': ['tercerosusuarios'] } }]);
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
    this.router.navigate(['/navegation-cl', { outlets: { 'contentClient': ['tercerosusuarios'] } }]);
  }

}
