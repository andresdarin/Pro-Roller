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
    isNavigating = false;

    toggleMenu(): void {
        this.menuAbierto = !this.menuAbierto;

        // Prevenir scroll del body cuando el menú está abierto
        if (this.menuAbierto) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    hideBurguer(): void {
        this.menuAbierto = false;
        document.body.style.overflow = ''; // Restaurar scroll
    }

    navigateToSection(event: Event, sectionId: string): void {
        event.preventDefault();
        event.stopPropagation(); // Evita propagación de eventos

        this.isNavigating = true;
        this.headerVisible = true;

        setTimeout(() => {
            this.hideBurguer();

            setTimeout(() => {
                const section = document.getElementById(sectionId);
                if (section) {
                    const headerHeight = 70;
                    const elementPosition = section.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }

                setTimeout(() => {
                    this.isNavigating = false;
                }, 500);

            }, 50); // Delay post-cierre de menú

        }, 50); // Delay pre-cierre
    }

    @HostListener('window:scroll', [])
    onWindowScroll(): void {
        if (this.isNavigating || this.menuAbierto) {
            return;
        }

        const currentScroll = window.pageYOffset;
        const scrollThreshold = 100;
        const scrollDifference = Math.abs(currentScroll - this.previousScrollPosition);

        if (scrollDifference < 5) {
            return;
        }

        if (currentScroll > this.previousScrollPosition && currentScroll > scrollThreshold) {
            this.headerVisible = false;
        } else if (currentScroll < this.previousScrollPosition || currentScroll <= scrollThreshold) {
            this.headerVisible = true;
        }

        this.previousScrollPosition = currentScroll;
    }

    @HostListener('window:resize', [])
    onWindowResize(): void {
        if (this.menuAbierto) {
            this.hideBurguer();
        }
    }

    @HostListener('document:keydown', ['$event'])
    onKeyDown(event: KeyboardEvent): void {
        if (event.key === 'Escape' && this.menuAbierto) {
            this.hideBurguer();
        }
    }

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: Event): void {
        const target = event.target as HTMLElement;
        const menuContainer = document.querySelector('.nav-container');
        const hamburgerBtn = document.querySelector('.hamburger-btn');

        if (this.menuAbierto &&
            !menuContainer?.contains(target) &&
            !hamburgerBtn?.contains(target)) {
            this.hideBurguer();
        }
    }
}
