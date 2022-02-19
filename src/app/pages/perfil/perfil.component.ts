import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuario } from 'src/app/models/usuario.model';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styles: [
  ]
})
export class PerfilComponent implements OnInit {

  public perfilForm!: FormGroup;
  public usuario: Usuario;
  public imagenSubir!: File;
  public imgTemp: any = '';

  constructor( private fb: FormBuilder,
      private usuarioService: UsuarioService,
      private fileUploadServices: FileUploadService) {
    this.usuario = usuarioService.usuario;
  }

  ngOnInit(): void {

    this.perfilForm = this.fb.group({
      nombre: [this.usuario.nombre, Validators.required],
      email: [this.usuario.email, [Validators.required, Validators.email]]
    });

  }

  actyalizarPerfil(){
    console.log(this.perfilForm.value);
    this.usuarioService.actualizarPerfil( this.perfilForm.value )
      .subscribe( () => {
        // TODO: Mostrar alerta de swal
        const { nombre, email } = this.perfilForm.value;
        this.usuario.nombre = nombre;
        this.usuario.email = email;

        Swal.fire('Guardado', 'Cambios guardados!', 'success');
        
      }, (err) =>{
        Swal.fire('Error', err.error.msg, 'error');
        
      })
    }
    
    cambiarImagen(evt: any) {
      
      if(!evt?.target?.files[0]){
        return this.imgTemp = null;
      }
      
      const img = evt?.target?.files[0];
      
      const reader = new FileReader();
      reader.readAsDataURL( img );
      reader.onloadend = () =>{
        this.imgTemp = reader.result;
      }
      
      return this.imagenSubir = evt?.target?.files[0];
    }
    
    subirImagen(){
      this.fileUploadServices.actualizarFoto( this.imagenSubir, 'usuarios', this.usuario.uid! )
      .then( (img) =>{

        this.usuario.img = img;
        Swal.fire('Correcto', 'Avatar actualizado', 'success');

      }).catch( err =>{
        console.log(err);
        
        Swal.fire('Error', 'No pudo subirse la imagen', 'error');
      })
  }

}
