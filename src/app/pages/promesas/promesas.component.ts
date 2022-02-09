import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-promesas',
  templateUrl: './promesas.component.html',
  styles: [
  ]
})
export class PromesasComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
   /*  const promesa = new Promise( (resolve, reject) =>{

      if(false){
        resolve('Hola mundo');
      } else{
        reject('Algo salió mal');
      }

      
    });

    promesa.then( (res) =>{
      console.log(res);
      
    })
    .catch( err => console.log(err) )
    console.log('Fin del init'); */
    // this.getUsuarios();
    this.getUsuarios()
      .then( usuarios => {
        console.log(usuarios);
      })
  }
  getUsuarios(){

    return new Promise( (resolve) =>{
      fetch('https://reqres.in/api/users')
        .then( resp => resp.json() )
        .then( body => console.log(body.data) )
    });


  }

}
