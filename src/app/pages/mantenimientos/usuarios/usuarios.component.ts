import { Component, OnDestroy, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

import { Usuario } from 'src/app/models/usuario.model';

import { BusquedasService } from 'src/app/services/busquedas.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { delay } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [
  ]
})
export class UsuariosComponent implements OnInit, OnDestroy {

  public totalUsuarios: number = 0;
  public usuarios: Usuario[] = [];
  public usuariosTemp: Usuario[] = [];

  public imgSub!: Subscription;
  public desde: number = 0;
  public cargando: boolean = true;

  constructor( private usuarioService: UsuarioService,
               private busquedasService: BusquedasService,
               private modalImagenService: ModalImagenService ) { }
  
  
  ngOnDestroy(): void {
    this.imgSub.unsubscribe()
  }

  ngOnInit(): void {

    this.cargarUsuarios();

    this.imgSub = this.modalImagenService.nuevaImagen
    .pipe(
      delay(100)
    ).subscribe( img => this.cargarUsuarios() );

  }

  cargarUsuarios(){

    this.cargando = true;
    
    this.usuarioService.cargarUsuarios( this.desde )
      .subscribe( ({total, usuarios}) =>{
        this.totalUsuarios = total;
        if(usuarios.length !== 0){
          this.usuarios = usuarios;
          this.usuariosTemp = usuarios;
        }
        this.cargando = false;
        
      })
  }

  cambiarPagina( valor: number ){

    this.desde += valor;

    if( this.desde < 0 ){
      this.desde = 0;
    } else if( this.desde >= this.totalUsuarios ){
      this.desde -=valor;
    }

    this.cargarUsuarios();

  }

  buscar( termino: string ){

    if(termino.length === 0){ 
      return this.usuarios = this.usuariosTemp;
     }

    return this.busquedasService.buscar( 'usuarios', termino )
      .subscribe( resultados => {
        this.usuarios = resultados as Usuario[];
        
      })
    
    
  }

  eliminarUsuario( usuario: Usuario ){
    

    if( usuario.uid === this.usuarioService.uid ){
      return Swal.fire('Error', 'No puede borrarse a si mismo', 'error');
    }

    Swal.fire({
      title: '¿Borrar usuario?',
      text: `Está a punto de borrar a ${usuario.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, borrarlo!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.eliminarUsuario( usuario )
          .subscribe( resp =>{

            Swal.fire(
              'Usuario borrado',
              `${usuario.nombre} fue eliminado correctamente`,
              'success'
            );

              this.cargarUsuarios();
          });
      }
    })

    return;

  }

  cambiarRole(usuario: Usuario){

    this.usuarioService.guardarUsuario( usuario )
      .subscribe( resp =>{
        console.log(resp);
        /* Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Your work has been saved',
          showConfirmButton: false,
          timer: 500
        }) */
      })

  }

  abrirModal(usuario: Usuario){
    console.log(usuario);
    this.modalImagenService.abrirModal('usuarios', usuario.uid!, usuario.img);
    
  }

}
