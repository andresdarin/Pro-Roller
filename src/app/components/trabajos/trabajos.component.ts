import { Component } from '@angular/core';

@Component({
    selector: 'app-trabajos',
    templateUrl: './trabajos.component.html',
    styleUrls: ['./trabajos.component.css']
})
export class TrabajosComponent {

    trabajos = [
        {
            img: 'assets/img/roller-translucida.jpeg',
            titulo: 'Roller con tela Screen',
            descripcion: 'Filtra el sol directo, protegiendo tus espacios del deterioro que provocan los rayos solares.'
        },
        {
            img: 'assets/img/roller-blackout.jpeg',
            titulo: 'Roller con tela Black Out',
            descripcion: 'No deja pasar la luz. Aislante térmico y sonoro.'
        },
        {
            img: 'assets/img/roller-bambu.jpeg',
            titulo: 'Roller Doble en tela Bambú',
            descripcion: 'Cortinas cálidas de estilo rústico.'
        },
        {
            img: 'assets/img/roller-rayada.jpeg',
            titulo: 'Roller con tela Bambú rayada',
            descripcion: 'Al igual que el bambú liso, son ideales para ambientes rústicos.'
        },
        {
            img: 'assets/img/cortina-tipo-antigua.jpeg',
            titulo: 'Cortina tradicional con pinza Americana',
            descripcion: 'De estilo clásico. Cálidas y acogedoras.'
        },
        {
            img: 'assets/img/cortina-tipo-antigua-translucida.jpeg',
            titulo: 'Cortina tradicional con pinza italiana',
            descripcion: 'Al igual que la pinza americana, es una cortina clásica pero con un toque más moderno.'
        }
    ];

}
