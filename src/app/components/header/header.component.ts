import { Component, HostListener } from '@angular/core';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent {
    menuAbierto = false;
    previousScrollPosition = window.pageYOffset;
    headerVisible = true;

    toggleMenu(): void {
        this.menuAbierto = !this.menuAbierto;
    }

    hideBurguer(): void {
        this.menuAbierto = false;
    }

    navigateToSection(event: Event, sectionId: string): void {
        event.preventDefault(); // evita salto directo
        this.hideBurguer(); // cierra el menú hamburguesa

        // Esperamos un poco para dar tiempo a cerrar animaciones
        setTimeout(() => {
            const section = document.getElementById(sectionId);
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
            }
        }, 200);
    }

    @HostListener('window:scroll', [])
    onWindowScroll(): void {
        const currentScroll = window.pageYOffset;

        if (currentScroll > this.previousScrollPosition && currentScroll > 100) {
            this.headerVisible = false;
        } else {
            this.headerVisible = true;
        }

        this.previousScrollPosition = currentScroll;
    }
}
