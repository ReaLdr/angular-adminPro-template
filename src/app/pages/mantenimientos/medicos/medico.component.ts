import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Medico } from 'src/app/models/medico.model';
import { Hospital } from 'src/app/models/hospital.models';

import { HospitalService } from 'src/app/services/hospital.service';
import { MedicoService } from 'src/app/services/medico.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: [
  ]
})
export class MedicoComponent implements OnInit {

  public medicoForm!: FormGroup;
  public hospitales: Hospital[] = [];

  public medicoSeleccionado!: Medico;
  public hospitalSeleccionado!: Hospital;

  constructor(private fb: FormBuilder,
    private hospitalService: HospitalService,
    private medicoService: MedicoService,
    private router: Router,
    private activatedroute: ActivatedRoute) { }

  ngOnInit(): void {

    this.activatedroute.params.subscribe(({ id }) => this.cargarMedico(id) );

    this.medicoForm = this.fb.group({
      nombre: ['', Validators.required],
      hospital: ['', Validators.required]
    })

    this.cargarHospitales();


    this.medicoForm.get('hospital')?.valueChanges
      .subscribe(hospitalId => {

        this.hospitalSeleccionado = this.hospitales.find(h => h._id === hospitalId)!;

      })

    // this.medicoService.obtenerMedicoPorId(  )

  }

  cargarMedico(id: string) {

    if(id === 'nuevo'){
      return;
    }
    

    this.medicoService.obtenerMedicoPorId(id)
      .pipe(
        delay(100)
      )
      .subscribe( medico => {
        
        const {nombre, hospital:{_id} } = medico;
        
        this.medicoSeleccionado = medico;
        this.medicoForm.setValue( { nombre, hospital: _id } );
        
      }, error=> {
        this.router.navigateByUrl(`/dashboard/medicos`)
      });

  }

  guardarMedico() {
    

    const { nombre } = this.medicoForm.value;

    if(this.medicoSeleccionado){
      // Actualizar
      // construir data
      const data = {
        ...this.medicoForm.value,
        _id: this.medicoSeleccionado._id
      }

      this.medicoService.actualizarMedico( data )
        .subscribe( resp =>{
          Swal.fire('Actualizado', `${nombre} actualizado correctamente`, 'success')
          // this.router.navigateByUrl(`/dashboard/medico/${}`)
        } )

    } else{
      // crear
  
      this.medicoService.crearMedicos(this.medicoForm.value)
        .subscribe((resp: any) => {
  
          Swal.fire('Creado', `${nombre} creado correctamente`, 'success')
          this.router.navigateByUrl(`/dashboard/medico/${resp.medico._id}`)
  
        })
    }

  }

  cargarHospitales() {
    this.hospitalService.cargarHospitales()
      .subscribe((hospitales: Hospital[]) => {

        this.hospitales = hospitales;

      })
  }

}
