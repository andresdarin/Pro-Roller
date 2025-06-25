import { Component, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';

@Component({
    selector: 'app-trabajos',
    templateUrl: './trabajos.component.html',
    styleUrls: ['./trabajos.component.css']
})
export class TrabajosComponent implements AfterViewInit, OnDestroy {

    @ViewChild('sliderContainer') sliderContainer!: ElementRef<HTMLDivElement>;
    @ViewChild('sliderGrid') sliderGrid!: ElementRef<HTMLUListElement>;

    private animationId?: number;
    private scrollAmount = 0;
    private speed = 0.5;

    trabajos = [
        {
            img: 'assets/img/roller-blackout.jpeg',
            titulo: 'Black Out',
            descripcion: 'Aislante térmico y sonoro. Totalmente opaca.',
            size: 'large' // Para item de 4 filas
        },
        {
            img: 'assets/img/roller-bambu.jpeg',
            titulo: 'Bambú',
            descripcion: 'Estilo rústico, ideal para ambientes cálidos.',
            size: 'wide' // Para item de 2 filas, 2 columnas
        },
        {
            img: 'assets/img/cortina-tipo-antigua.jpeg',
            titulo: 'Tradicional',
            descripcion: 'Con pinza americana. Cálidas y acogedoras.',
            size: 'wide' // Para item de 2 filas, 2 columnas
        },
        {
            img: 'assets/img/roller-rayada.jpeg',
            titulo: 'Bambú rayada',
            descripcion: 'Ideal para ambientes con estilo natural.',
            size: 'large' // Para item de 4 filas
        },
        {
            img: 'assets/img/roller-translucida.jpeg',
            titulo: 'Roller con tela Screen',
            descripcion: 'Filtra el sol directo, protegiendo tus espacios del deterioro.',
            size: 'normal' // Para item normal
        },
        {
            img: 'assets/img/cortina-tipo-antigua-translucida.jpeg',
            titulo: 'Pinza italiana',
            descripcion: 'Cortina clásica con un toque más moderno.',
            size: 'normal' // Para item normal
        }
    ];

    // Duplicamos los trabajos para el efecto infinito
    get trabajosInfinitos() {
        return [...this.trabajos, ...this.trabajos];
    }

    ngAfterViewInit() {
        // Pequeño delay para asegurar que el DOM esté completamente renderizado
        setTimeout(() => {
            this.initAutoScroll();
        }, 100);
    }

    ngOnDestroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }

    private initAutoScroll() {
        const slider = this.sliderContainer.nativeElement;
        const sliderGrid = this.sliderGrid.nativeElement;

        // Esperamos que el DOM se renderice completamente
        setTimeout(() => {
            // Obtenemos todos los elementos li
            const allItems = sliderGrid.querySelectorAll('li');
            const originalItemsCount = this.trabajos.length;

            // Calculamos el ancho real hasta el último item original
            let maxRight = 0;
            for (let i = 0; i < originalItemsCount; i++) {
                const item = allItems[i] as HTMLElement;
                if (item) {
                    const rect = item.getBoundingClientRect();
                    const itemRight = item.offsetLeft + item.offsetWidth;
                    maxRight = Math.max(maxRight, itemRight);
                }
            }

            // Agregamos un pequeño buffer para asegurar transición suave
            const resetPoint = maxRight + 15; // gap adicional

            const autoScroll = () => {
                this.scrollAmount += this.speed;

                // Reiniciamos cuando llegamos al punto calculado
                if (this.scrollAmount >= resetPoint) {
                    this.scrollAmount = 0;
                }

                slider.scrollLeft = this.scrollAmount;
                this.animationId = requestAnimationFrame(autoScroll);
            };

            autoScroll();
        }, 300);
    }

    // Método para obtener la clase CSS según el tamaño
    getItemClass(index: number, size: string): string {
        const baseClass = 'item';

        switch (size) {
            case 'large':
                return `${baseClass} item-large`;
            case 'wide':
                return `${baseClass} item-wide`;
            default:
                return `${baseClass} item-normal`;
        }
    }

    // Método para pausar/reanudar el scroll (opcional)
    pauseScroll() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = undefined;
        }
    }

    resumeScroll() {
        if (!this.animationId) {
            this.initAutoScroll();
        }
    }
}