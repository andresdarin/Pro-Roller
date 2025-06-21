import { Component } from '@angular/core';

interface Servicio {
    titulo: string;
    descripcion: string;
    imagen: string;
    alt: string;
}

@Component({
    selector: 'app-servicios',
    templateUrl: './servicios.component.html',
    styleUrls: ['./servicios.component.css']
})
export class ServiciosComponent {
    servicios: Servicio[] = [
        {
            titulo: 'Confección',
            descripcion: 'Confeccionamos cortinas roller y tradicionales',
            imagen: '../../../assets/img/confeccion.png',
            alt: 'Confección'
        },
        {
            titulo: 'Instalación',
            descripcion: 'Instalamos cortinas de todo tipo',
            imagen: '../../../assets/img/instalacion.png',
            alt: 'Instalación'
        },
        {
            titulo: 'Automatismos',
            descripcion: 'Automatizamos tus cortinas.',
            imagen: '../../../assets/img/automatismos.png',
            alt: 'Automatismos'
        },
        {
            titulo: 'A medida',
            descripcion: 'Confeccionamos cortinados a medida y de acuerdo a tus necesidades',
            imagen: '../../../assets/img/amedida.png',
            alt: 'Confección a medida'
        },
        {
            titulo: 'Variedad',
            descripcion: 'Contamos con una amplia variedad de materiales de distintas calidades.',
            imagen: '../../../assets/img/variedad.png',
            alt: 'Variedad de materiales'
        },
        {
            titulo: 'Vamos a donde necesites',
            descripcion: 'Contanos cuál es tu necesidad y te brindamos la mejor solución.',
            imagen: '../../../assets/img/vamos.png',
            alt: 'Vamos'
        }
    ];
}
