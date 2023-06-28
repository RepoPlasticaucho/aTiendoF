import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faSave, faTimes, faUserFriends, faSearch } from '@fortawesome/free-solid-svg-icons';
import { ProvinciasService } from 'src/app/services/provincias.service';
import { TipotercerosEntity } from 'src/app/models/tipotercero';
import { TipousuariosEntity } from 'src/app/models/tipousuario';
import { CiudadesService } from 'src/app/services/ciudades.service';
import { CiudadesEntity } from 'src/app/models/ciudades';
import { SociedadesEntity } from 'src/app/models/sociedades';
import { TercerosEntity } from 'src/app/models/terceros';
import { TercerosService } from 'src/app/services/terceros.service';
import { TipotercerosService } from 'src/app/services/tipotercero.service';
import { TipousuariosService } from 'src/app/services/tipousuario.service';
import Swal from 'sweetalert2';
import { MatDialogRef } from '@angular/material/dialog';
import { MenuventComponent } from '../menuvent/menuvent.component';
import { MovimientosEntity } from 'src/app/models/movimientos';
import { MovimientosService } from 'src/app/services/movimientos.service';


@Component({
  selector: 'app-ver-cliente',
  templateUrl: './ver-cliente.component.html',
  styleUrls: ['./ver-cliente.component.css']
})
export class VerClienteComponent implements OnInit {

  //Iconos para la pagina de grupos
  faTimes = faTimes;
  faUserFriends = faUserFriends;
  faSave = faSave;
  faSearch = faSearch;

  // Control de dígitos que ingresan al número de id
  idFiscalMaxLength: number = 0;
  email: string = '';

  //Creación de la variable para formulario
  TercerosForm = new FormGroup({
    tipo_tercero: new FormControl('0', Validators.required),
    ciudad_id: new FormControl('0', Validators.required),
    nombre: new FormControl('', Validators.required),
    apellido: new FormControl('', Validators.required),
    id_fiscal: new FormControl('', Validators.required),
    correo: new FormControl('', Validators.required),
    direccion: new FormControl('', Validators.required),
    telefono: new FormControl('', Validators.required),
  });




  //Variables para ejecucion del Form
  lstCiudades: CiudadesEntity[] = [];
  lstCiudades2: CiudadesEntity[] = [];
  selectCiudades: boolean = false;
  keywordCiudad = 'ciudad';

  lstTipoTerceros: TipotercerosEntity[] = [];
  lstTipoTerceros2: TipotercerosEntity[] = [];
  selectTipoTercero: boolean = false;

  lstTipoUsuarios: TipousuariosEntity[] = [];
  lstTipoUsuarios2: TipousuariosEntity[] = [];
  selectTipoUsuario: boolean = false;

  lstSociedades: SociedadesEntity[] = [];
  lstSociedades2: SociedadesEntity[] = [];
  selectSociedades: boolean = false;


  fechaSeleccionada: Date | null = null;

  constructor(
    private readonly httpService: TercerosService,
    private readonly httpServiceCiudades: CiudadesService,
    private readonly httpServiceTipoTercero: TipotercerosService,
    private readonly httpServiceTipoUsuario: TipousuariosService,
    private dialogRef: MatDialogRef<MenuventComponent>,
    private readonly httpServiceMov: MovimientosService,
    private router: Router) {
  }

  cerrarDialog(): void {
    this.dialogRef.close();
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
    })

  }

  selectEventCiudad(ciudad: CiudadesEntity) {
    this.selectCiudades = false;
    this.TercerosForm.controls['ciudad_id'].setValue(ciudad.idCiudad);
  }


  onSubmit() {
    if (!this.TercerosForm.valid) {
      this.TercerosForm.markAllAsTouched();
      console.log("Error");
    } else {
      const tercerodatos: TercerosEntity = {
        id: '',
        almacen_id: localStorage.getItem('almacenid')!,
        sociedad_id: localStorage.getItem('sociedadid')!,
        tipotercero_id: this.lstTipoTerceros2[0].idTipo_tercero ?? 0,
        tipousuario_id: '1',
        nombresociedad: "",
        nombrealmacen: "",
        nombretercero: this.TercerosForm.value!.tipo_tercero ?? "",
        tipousuario: "",
        nombre: (this.TercerosForm.value!.nombre ?? "").concat(" " + this.TercerosForm.value!.apellido ?? ""),
        id_fiscal: this.TercerosForm.value!.id_fiscal ?? "",
        direccion: this.TercerosForm.value!.direccion ?? "",
        telefono: this.TercerosForm.value!.telefono ?? "",
        correo: this.TercerosForm.value!.correo ?? "",
        fecha_nac: "01-01-2000",
        ciudad: '',
        provincia: "",
        ciudadid: this.TercerosForm.value!.ciudad_id ?? ''
      }

      this.httpService.agregarTerceros(tercerodatos).subscribe(res => {
        if (res.codigoError == "OK") {
          this.httpService.obtenerTerceroCedula(tercerodatos).subscribe(res1 => {
            if (res1.codigoError == "OK") {
              const newMovimiento: MovimientosEntity = {
                id: localStorage.getItem('movimiento_id')!,
                tipo_id: '',
                tipo_emision_cod: '',
                estado_fact_id: '',
                tipo_comprb_id: '',
                almacen_id: '',
                cod_doc: '',
                secuencial: '',
                tercero_id: res1.lstTerceros[0].id!
              }
              console.log(res1)
              console.log(newMovimiento)
              this.httpServiceMov.actualizarClientePedido(newMovimiento).subscribe(res2 => {
                if (res2.codigoError != "OK") {
                  Swal.fire({
                    icon: 'info',
                    title: 'Información',
                    text: 'Ha ocurrido un error',
                    showConfirmButton: true,
                    // timer: 3000
                  });
                } else {
                  Swal.fire({
                    icon: 'info',
                    title: 'Información',
                    text: 'Se ha elegido al Cliente',
                    showConfirmButton: true,
                    // timer: 3000
                  });
                  this.cerrarDialog();
                }
              });
            }
          })
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

  onChangeSearchCiudad(val: string) {
    if (val == '') {
      this.selectCiudades = true;
      this.TercerosForm.controls['ciudad_id'].setValue('0');
    }
  }

  onInputClearedCiudad() {
    this.selectCiudades = true;
    this.TercerosForm.controls['ciudad_id'].setValue('0');
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


}