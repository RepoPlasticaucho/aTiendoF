import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faSave, faTimes, faUserFriends } from '@fortawesome/free-solid-svg-icons';
import { AlmacenesEntity } from 'src/app/models/almacenes';
import { SociedadesEntity } from 'src/app/models/sociedades';
import { AlmacenesService } from 'src/app/services/almacenes.service';
import { SociedadesService } from 'src/app/services/sociedades.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-almacenes-create',
  templateUrl: './almacenes-create.component.html',
  styleUrls: ['./almacenes-create.component.css']
})
export class AlmacenesCreateComponent implements OnInit {

   //Iconos para la pagina de grupos
   faTimes = faTimes;
   faUserFriends = faUserFriends;
   faSave = faSave;
   //Creación de la variable para formulario
   warehousesForm = new FormGroup({
     sociedad: new FormControl('0', Validators.required),
     Direccion: new FormControl('', [Validators.required]),
     codigo: new FormControl('', [Validators.required]),
     pto_emision: new FormControl('', [Validators.required]),
     telefono: new FormControl('', [Validators.required, Validators.minLength(9)]),
   });
   //Variables para listas desplegables
   lstSociedades: SociedadesEntity[] = [];
   selectSociedades: boolean = false;
 
   constructor(private readonly httpService: AlmacenesService,
     private readonly httpServiceSociedades: SociedadesService,
     private router: Router) { }
 
   ngOnInit(): void {
     //Obtener Grupos
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
         console.log(this.lstSociedades);
       }
     })
   }
 
   onSubmit(): void {
    
     if (!this.warehousesForm.valid) {
      
       this.warehousesForm.markAllAsTouched();
       if (this.warehousesForm.get("sociedad")?.value == "0") {
         this.selectSociedades = true;         
       }
    } else {
       if (this.warehousesForm.get("sociedad")?.value == "0") {
         this.selectSociedades = true;
       }
       
       else {
         const almacenEntity: AlmacenesEntity = {
           sociedad_id: this.warehousesForm.value!.sociedad ?? "",
           direccion: this.warehousesForm.value!.Direccion ?? "",
           codigo: this.warehousesForm.value!.codigo ?? "",
           pto_emision: this.warehousesForm.value!.pto_emision ?? "",
           telefono: this.warehousesForm.value!.telefono ?? "",
           idAlmacen: '',
           nombresociedad: ''
         };
         console.log(almacenEntity)
         console.log(almacenEntity);
         this.httpService.agregarAlmacen(almacenEntity).subscribe(res => {
           if (res.codigoError == "OK") {
             Swal.fire({
               icon: 'success',
               title: 'Guardado Exitosamente.',
               text: `Se ha creado la sociedad ${this.warehousesForm.value.Direccion}`,
               showConfirmButton: true,
               confirmButtonText: "Ok"
             }).finally(() => {
               this.router.navigate(['/navegation-adm', { outlets: { 'contentAdmin': ['almacenes'] } }]);
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
   
   changeGroup(sociedad: any): void {
     if (sociedad.target.value == 0) {
       this.selectSociedades = true;
     } else {
       this.selectSociedades = false;
       this.warehousesForm.get("sociedad")?.setValue(sociedad.target.value);
     }
   }
 
   visualizarAlmacenes() {
     this.router.navigate(['/navegation-adm', { outlets: { 'contentAdmin': ['almacenes'] } }]);
   }
  }


