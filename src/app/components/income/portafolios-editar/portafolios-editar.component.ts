import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faList, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import { DetallesMovimiento, DetallesMovimientoEntity } from 'src/app/models/detallesmovimiento';
import { DetallesmovimientoService } from 'src/app/services/detallesmovimiento.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-portafolios-editar',
  templateUrl: './portafolios-editar.component.html',
  styleUrls: ['./portafolios-editar.component.css']
})
export class PortafoliosEditarComponent implements OnInit {

  constructor(private readonly httpServiceDetalle: DetallesmovimientoService,
    private router: Router) { }

  //Iconos para la pagina de grupos
  faList = faList;
  faTimes = faTimes;
  faSave = faSave;

  selectedPrecio: any | undefined = '' ;
  costo: any;
  
  //Variable contenedor id Modelo Producto
  codigo: string = '';

  //Creación de la variable para formulario
  detalleForm = new FormGroup({
    producto: new FormControl('',),
    color: new FormControl('',),
    tamanio: new FormControl('',),
    cantidad: new FormControl('',Validators.required),
    precio: new FormControl('',)
  });

  ngOnInit(): void {
    //Cargar los datos Modificar
    this.httpServiceDetalle.obtenerdetalle$.subscribe((res) => {
      if (res.id == '') {
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error.',
          text: 'No se ha obtenido información.',
          showConfirmButton: false,
        }).finally(() => {
          this.router.navigate([
            '/navegation-cl',
            { outlets: { contentClient: ['carrito'] } },
          ]);
        });
      } else {
        //Asignamos los valores a los campos
        console.log(res);
        this.costo = res.costo;
        this.selectedPrecio = res.precio;
        this.codigo = res.id!;
        this.detalleForm.get('producto')?.setValue(res.producto_nombre);
        this.detalleForm.get('color')?.setValue(res.color!);
        this.detalleForm.get('tamanio')?.setValue(res.tamanio!);
        this.detalleForm.get('cantidad')?.setValue(res.cantidad);
        this.detalleForm.get('precio')?.setValue(res.precio);
      }
    });
  }

  onInput() {
    const cant = document.getElementById(`cantidad`) as HTMLInputElement;
    const cantidad = Number(cant.value);
    const precio: any = Number((cantidad * this.costo).toFixed(2));
    this.selectedPrecio = precio;
  }

  onSubmit(): void {
    console.log(this.detalleForm.valid);
    //console.log(this.modelProductForm.value);
    //console.log(this.modelProductForm.value.modeloproducto_id);
    if (!this.detalleForm.valid) {
      this.detalleForm.markAllAsTouched();
      Swal.fire({
        icon: 'error',
        title: 'Ha ocurrido un error.',
        showConfirmButton: false,
      });
    } else {
        const detalleEntity: DetallesMovimientoEntity = {
          id: this.codigo,
          cantidad: this.detalleForm.value!.cantidad ?? '',
          precio: this.detalleForm.value!.precio ?? '',
          producto_id: '',
          producto_nombre: '',
          inventario_id: '',
          movimiento_id: '',
          costo: ''
        };

        this.httpServiceDetalle.modificarDetallePedido(detalleEntity).subscribe((res) => {
          if (res.codigoError == 'OK') {
            Swal.fire({
              icon: 'success',
              title: 'Modificado Exitosamente.',
              text: `Se ha modificado el Producto ${this.detalleForm.value.producto}`,
              showConfirmButton: true,
              confirmButtonText: 'Ok',
            }).finally(() => {
              this.router.navigate([
                '/navegation-cl',
                { outlets: { contentClient: ['carrito'] } },
              ]);
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Ha ocurrido un error.',
              text: res.descripcionError,
              showConfirmButton: false,
            });
          }
        });
      
    }
  }

  verCarrito() {
    this.router.navigate([
      '/navegation-cl',
      { outlets: { contentClient: ['carrito'] } },
    ]);
  }

  keyPressNumbers(event: any) {
    var charCode = (event.which) ? event.which : event.keyCode;
    // Only Numbers 0-9
    if ((charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    } else {
      // Check if the input field already has a value
      if (event.target.value === '' && charCode === 48) {
        event.preventDefault();
        return false;
      }
      return true;
    }
  }


}
