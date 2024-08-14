import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faSave, faTimes, faUserFriends } from '@fortawesome/free-solid-svg-icons';
import { AlmacenesEntity } from 'src/app/models/almacenes';
import { DescuentosEntity } from 'src/app/models/descuentos';
import { AlmacenesService } from 'src/app/services/almacenes.service';
import { DescuentosService } from 'src/app/services/descuentos.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-discounts-create',
  templateUrl: './discounts-create.component.html',
  styleUrls: ['./discounts-create.component.css']
})
export class DiscountsCreateComponent implements OnInit {


   //Iconos para la pagina de grupos
   faTimes = faTimes;
   faUserFriends = faUserFriends;
   faSave = faSave;
   selectSociedades: boolean = false;
   //Creación de la variable para formulario
   warehousesForm = new FormGroup({
     tipo: new FormControl('0', Validators.required),
     codigoDescuento: new FormControl('', Validators.required),
     Direccion: new FormControl('', [Validators.required]),
     usoMaximo: new FormControl('', [Validators.required]),
     pto_emision: new FormControl('', [Validators.required]),
     valorDescuento: new FormControl('', [Validators.required, Validators.minLength(9)]),
     fecha_inicio: new FormControl('', [Validators.required]),
      fecha_fin: new FormControl('', [Validators.required]),
      tipoDescuento: new FormControl('0', Validators.required),
   });
   //Variables para listas desplegables
   selecttipoes: boolean = false;
 
   constructor(private readonly httpService: AlmacenesService,
    private readonly httpDiscounts: DescuentosService,
     private router: Router) { }
 
   ngOnInit(): void {
     //Obtener Grupos


   
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
   
   changeGroup(tipo: any): void {
     if (tipo.target.value == 0) {
       this.selecttipoes = true;
     } else {
       this.selecttipoes = false;
       this.warehousesForm.get("tipo")?.setValue(tipo.target.value);
     }
   }


 
   visualizarAlmacenes() {
     this.router.navigate(['/navegation-adm', { outlets: { 'contentAdmin': ['almacenes'] } }]);
   }

   onSubmit(): void {

    //Controles
    if (this.warehousesForm.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Ha ocurrido un error.',
        text: 'Por favor, complete los campos requeridos.',
        showConfirmButton: false,
      });
      return;
    }


    //Construir el objeto
    const descuentoEntity: DescuentosEntity = {
      id: '',
      codigoDescuento: this.warehousesForm.value!.codigoDescuento ?? "",
      usoMaximo: this.warehousesForm.value!.usoMaximo ?? "",
      valorDescuento: this.warehousesForm.value!.valorDescuento ?? "",
      fecha_inicio: this.warehousesForm.value!.fecha_inicio ?? "",
      fecha_fin: this.warehousesForm.value!.fecha_fin ?? "",
      tipoDescuento: this.warehousesForm.value!.tipoDescuento ?? "",
      sociedad: JSON.parse(localStorage.getItem('sociedadid') || "[]")
      
    };

    this.httpDiscounts.agregarDescuento(descuentoEntity).subscribe(res => {
      if (res.codigoError == "OK") {
        Swal.fire({
          icon: 'success',
          title: 'Guardado Exitosamente.',
          text: `Se ha creado el descuento ${this.warehousesForm.value.codigoDescuento}`,
          showConfirmButton: true,
          confirmButtonText: "Ok"
        }).finally(() => {
          this.router.navigate(['/navegation-cl', { outlets: { 'contentClient': ['descuentos'] } }]);
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
