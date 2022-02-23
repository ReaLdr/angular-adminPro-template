import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators'

import { environment } from 'src/environments/environment';

import { RegisterForm } from '../interfaces/register-form.interface';
import { LoginForm } from '../interfaces/login-form.interface';
import { CargarUsuario } from '../interfaces/cargar-usuarios.interface';

import { Usuario } from '../models/usuario.model';

const base_url = environment.base_url;
declare const gapi: any;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  public auth2: any;
  public usuario!: Usuario;

  constructor(private http: HttpClient,
    private router: Router,
    private ngZone: NgZone) {
    this.googleInit();
  }

  get token (): string{
    return localStorage.getItem('token') || '';
  }

  get uid(): string{
    return this.usuario.uid || '';
  }

  get role(): 'ADMIN_ROLE'|'USER_ROLE' {

    return this.usuario.role!;

  }

  get headers(){
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  guardarLocalStorage( token: string, menu: any ){
    localStorage.setItem('token', token);
    localStorage.setItem('menu', JSON.stringify(menu));
  }



  googleInit() {

    return new Promise<void>( (resolve) =>{

      gapi.load('auth2', () => {
        this.auth2 = gapi.auth2.init({
          client_id: '565017560049-lng86osiru6kbqj5t5udoarlb2st1duo.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin'
        });

        resolve();

      });

    })
  }



  logOut() {
    localStorage.removeItem('token');

    // TODO: Borrar menú
    localStorage.removeItem('menu');

    this.auth2.signOut().then(() => {
      this.ngZone.run(() => {
        this.router.navigateByUrl('/login');
      })
    });
  }


// se ejecuta en el guard antes de abrir la ruta
  validarToken(): Observable<boolean> { // Regresa un observable que emite un boolean


    return this.http.get(`${base_url}/login/renew`, {
      headers: {
        'x-token': this.token
      }
    }).pipe(
      map((resp: any) => {
        const { email, google, img, nombre, role, uid } = resp.usuarioDB;

        this.usuario = new Usuario( nombre, email, '', img, google, role, uid );
        
        this.guardarLocalStorage( resp.token, resp.menu );
        return true;
      }),
      catchError(error => of(false))
    );
  }



  crearUsuario(formData: RegisterForm) {

    return this.http.post(`${base_url}/usuarios`, formData)
      .pipe(
        tap((resp: any) => {

          this.guardarLocalStorage(resp.token , resp.menu);

        })
      )

  }

  actualizarPerfil( data: { email:string, nombre: string, role: string } ){

    data = {
      ...data,
      role: this.usuario.role!
    }

    return this.http.put(`${base_url}/usuarios/${this.uid}`, data, this.headers);

  }

  login(formData: LoginForm) {
    return this.http.post(`${base_url}/login`, formData)
      .pipe(
        tap((resp: any) => {
          this.guardarLocalStorage( resp.token, resp.menu );
        })
      )
  }


  loginGoogle(token: string) {
    return this.http.post(`${base_url}/login/google`, { token })
      .pipe(
        tap((resp: any) => {

          this.guardarLocalStorage( resp.token, resp.menu );

        })
      )
  }


  cargarUsuarios( desde: number = 0 ){

    const url = `${base_url}/usuarios?desde=${desde}`;
    return this.http.get<CargarUsuario>( url, this.headers )
      .pipe(
        // delay(5000),
        map( resp =>{
          const usuarios = resp.usuarios.map(
            user => new Usuario(user.nombre, user.email, '', user.img, user.google, user.role, user.uid)
            );
          
          return {
            total: resp.total,
            usuarios
          };

        } )
      )

  }

  eliminarUsuario( usuario: Usuario ){

    // usuarios/6205ac4d933b11f51ac02c45
    const url = `${base_url}/usuarios/${usuario.uid}`;
    return this.http.delete( url, this.headers );
    
  }

  guardarUsuario( usuario: Usuario ){

    return this.http.put(`${base_url}/usuarios/${usuario.uid}`, usuario, this.headers);

  }
}
