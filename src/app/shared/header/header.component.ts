import { Component } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent {

  public usuario: Usuario;
  public nombre_customized: string = '';

  constructor( private usuarioService: UsuarioService ) {
    // Instancia de la clase
    this.usuario = usuarioService.usuario;
    // console.log(this.usuario);
    ( this.usuario.nombre.split(' ').length > 1 )
      ? this.nombre_customized = this.usuario.nombre.split(' ')[0] + ' ' + this.usuario.nombre.split(' ')[1]
      : this.nombre_customized = this.usuario.nombre;
    
  }

  logout(){
    this.usuarioService.logOut();
  }

}
