import { Component, OnInit } from '@angular/core';
import { MessageService } from '../../services/message.service';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  constructor(public messageService: MessageService) { }

  contactForm(form: NgForm) {

    this.messageService.sendMessage(form).subscribe(() => {
      Swal.fire({
        allowOutsideClick: true,
        icon: 'info',
        text: 'Mensaje enviado correctamente',
        title: 'Formulario de contacto'
      });
    });

  }

}