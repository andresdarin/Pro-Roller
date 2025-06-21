import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { MessageService } from '../../services/message.service';

@Component({
    selector: 'app-contacto',
    templateUrl: './contacto.component.html',
    styleUrls: ['./contacto.component.css']
})
export class ContactoComponent {

    constructor(private messageService: MessageService) { }

    contactForm(form: NgForm) {
        if (form.invalid) {
            return;
        }

        this.messageService.sendMessage(form.value).subscribe(() => {
            Swal.fire({
                allowOutsideClick: true,
                icon: 'info',
                title: 'Formulario de contacto',
                text: 'Mensaje enviado correctamente'
            });
            form.resetForm();
        }, (error) => {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un problema enviando el mensaje. Intente de nuevo.'
            });
        });
    }
}
