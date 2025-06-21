import { Component } from '@angular/core';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']  // Si tenés estilos para header
})
export class HeaderComponent {

    constructor() { }

    hideBurguer() {
        // Aquí va la lógica para ocultar el menú hamburguesa si tenés uno
        // Por ejemplo, si usás una variable booleana para mostrar/ocultar el menú, la manejás acá.
        console.log('hideBurguer called');
        // Implementa según tu lógica, o déjalo vacío si no es necesario
    }
}
