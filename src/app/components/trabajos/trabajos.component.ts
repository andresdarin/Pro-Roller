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
            size: 'large'
        },
        {
            img: 'assets/img/roller-bambu.jpeg',
            titulo: 'Bambú',
            descripcion: 'Estilo rústico, ideal para ambientes cálidos.',
            size: 'wide'
        },
        {
            img: 'assets/img/cortina-tipo-antigua.jpeg',
            titulo: 'Tradicional',
            descripcion: 'Con pinza americana. Cálidas y acogedoras.',
            size: 'wide'
        },
        {
            img: 'assets/img/roller-rayada.jpeg',
            titulo: 'Bambú rayada',
            descripcion: 'Ideal para ambientes con estilo natural.',
            size: 'large'
        },
        {
            img: 'assets/img/roller-translucida.jpeg',
            titulo: 'Roller con tela Screen',
            descripcion: 'Filtra el sol directo, protegiendo tus espacios del deterioro.',
            size: 'normal'
        },
        {
            img: 'assets/img/cortina-tipo-antigua-translucida.jpeg',
            titulo: 'Pinza italiana',
            descripcion: 'Cortina clásica con un toque más moderno.',
            size: 'normal'
        }
    ];

    // Genera 40 trabajos mezclando los existentes
    get trabajosInfinitos() {
        const trabajosExtendidos = [];
        for (let i = 0; i < 40; i++) {
            const original = this.trabajos[i % this.trabajos.length];
            trabajosExtendidos.push({
                ...original,
                titulo: `${original.titulo} ${i + 1}` // opcional: numerar para diferenciarlos
            });
        }
        return trabajosExtendidos;
    }

    ngAfterViewInit() {
        // Delay para asegurar que el DOM esté listo
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

        setTimeout(() => {
            const allItems = sliderGrid.querySelectorAll('li');

            // Calcular ancho total de los ítems visibles (en vez de solo los originales)
            let maxRight = 0;
            allItems.forEach((item: Element) => {
                const el = item as HTMLElement;
                const right = el.offsetLeft + el.offsetWidth;
                maxRight = Math.max(maxRight, right);
            });

            const resetPoint = maxRight + 50; // padding extra para que reinicie suave

            const autoScroll = () => {
                this.scrollAmount += this.speed;

                if (this.scrollAmount >= resetPoint) {
                    this.scrollAmount = 0;
                }

                slider.scrollLeft = this.scrollAmount;
                this.animationId = requestAnimationFrame(autoScroll);
            };

            autoScroll();
        }, 300);
    }

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
