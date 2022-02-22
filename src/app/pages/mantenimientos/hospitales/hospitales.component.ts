import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { Hospital } from 'src/app/models/hospital.models';

import { BusquedasService } from 'src/app/services/busquedas.service';
import { HospitalService } from 'src/app/services/hospital.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [
  ]
})
export class HospitalesComponent implements OnInit {

  public hospitales: Hospital[] = [];
  public cargando: boolean = true;
  private imgSub!: Subscription;

  constructor( private hospitalService: HospitalService,
      private modalImagenService: ModalImagenService,
        private busquedasService: BusquedasService ) { }

  ngOnInit(): void {
    this.cargarHospitales();

    this.imgSub = this.modalImagenService.nuevaImagen
    .pipe(
      delay(100)
    ).subscribe( img => this.cargarHospitales() );
    
  }

  buscar( termino: string ){

    if(termino.length === 0){ 
      return this.cargarHospitales();
     }

    return this.busquedasService.buscar( 'hospitales', termino )
      .subscribe( resultados => {
        this.hospitales = resultados as Hospital[];
        
      })
    
    
  }
  
  cargarHospitales(){

    this.cargando = true;
    this.hospitalService.cargarHospitales()
      .subscribe( hospitales =>{

        this.cargando = false;
        this.hospitales = hospitales;
        
      });

  }

  guardarCambios(hospital: Hospital){
    
    this.hospitalService.actualizarHospital( hospital._id!, hospital.nombre )
      .subscribe( resp =>{
        Swal.fire( 'Actualizado', hospital.nombre, 'success' );
      });

  }

  eliminarHospital( hospital: Hospital ){
    this.hospitalService.borrarHospital( hospital._id! )
    .subscribe( resp =>{
      this.cargarHospitales();
      Swal.fire( 'Borrado', hospital.nombre, 'success' );
    });
  }

  async abrirSweetAlert(){
    const {value, isConfirmed} = await Swal.fire<string>({
      title: 'Crear hospital',
      text: 'Ingrese el nombre del nuevo hospital',
      input: 'text',
      inputPlaceholder: 'Nombre del hospital',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      allowOutsideClick: false
    });

    if(isConfirmed){
      if( value!.trim().length > 0 ){
        this.hospitalService.crearHospital( value! )
          .subscribe( (resp: any) =>{
            
            this.hospitales.push(resp.hospital)
            
            
          })
      }
    }
    
  }

  abrirModal (hospital: Hospital){
    this.modalImagenService.abrirModal('hospitales', hospital._id!, hospital.img);
  }

}
