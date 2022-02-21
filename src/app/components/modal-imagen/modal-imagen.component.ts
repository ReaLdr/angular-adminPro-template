import { Component, OnInit } from '@angular/core';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-imagen',
  templateUrl: './modal-imagen.component.html',
  styles: [
  ]
})
export class ModalImagenComponent implements OnInit {

  public imagenSubir!: File;
  public imgTemp: any = '';

  constructor( public modalImagenService: ModalImagenService, public fileUploadServices: FileUploadService ) { }

  ngOnInit(): void {
  }

  cerrarModal(){
    //
    this.imgTemp = null;
    this.modalImagenService.cerrarModal();
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

    const id = this.modalImagenService.id;
    const tipo = this.modalImagenService.tipo;

    console.log(this.imagenSubir);
    

    this.fileUploadServices.actualizarFoto( this.imagenSubir, tipo, id )
    .then( (img) =>{

      Swal.fire('Correcto', 'Avatar actualizado', 'success');
      this.modalImagenService.nuevaImagen.emit( img );
      this.cerrarModal();

    }).catch( err =>{
      console.log(err);
      
      Swal.fire('Error', 'No pudo subirse la imagen', 'error');

    })
}

}
