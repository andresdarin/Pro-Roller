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
    private speed = 0.2; // Velocidad más fluida
    private isHovered = false;
    private isPaused = false;
    private isInitialized = false;

    trabajos = [
        {
            img: "assets/img/IMG-20250726-WA0053.jpg",
            titulo: "Roller Screen en Ventanal",
            descripcion: "Cortina roller screen en un amplio ventanal, permitiendo la visibilidad exterior y filtrando la luz.",
            size: "large"
        },
        {
            img: "assets/img/IMG-20250726-WA0056.jpg",
            titulo: "Roller Dual en Espacio Moderno",
            descripcion: "Cortina roller dual en un ambiente con diseño moderno, ofreciendo versatilidad en la entrada de luz.",
            size: "large"
        },
        {
            img: "assets/img/roller-translucida.jpeg",
            titulo: "Tela Screen",
            descripcion: "Filtra el sol directo, protegiendo tus espacios del deterioro.",
            size: "large"
        },
        {
            img: "assets/img/IMG-20250721-WA0006.jpg",
            titulo: "Pinza italiana 2",
            descripcion: "Cortina clásica con un toque más moderno.",
            size: "wide"
        },
        {
            img: "assets/img/cortina-tipo-antigua-translucida.jpeg",
            titulo: "Pinza italiana 1",
            descripcion: "Cortina clásica con un toque más moderno.",
            size: "wide"
        },
        {
            img: "assets/img/IMG-20250726-WA0061.jpg",
            titulo: "Ambiente Interior con Cortinas Suaves",
            descripcion: "Cortinas de tela suave que crean un ambiente relajante y acogedor en el interior.",
            size: "giant"
        },

        {
            img: "assets/img/IMG-20250726-WA0059.jpg",
            titulo: "Cortina Texturizada",
            descripcion: "Cortina con textura sutil, combinando funcionalidad y estilo.",
            size: "normal"
        },
        {
            img: "assets/img/IMG-20250726-WA0057.jpg",
            titulo: "Cortina Corta para Ventana",
            descripcion: "Cortina corta ideal para ventanas pequeñas, brindando privacidad sin obstaculizar el espacio.",
            size: "normal"
        },
        {
            img: "assets/img/IMG-20250726-WA0052.jpg",
            titulo: "Roller Blackout Gris",
            descripcion: "Cortina roller blackout de color gris, ideal para oscurecer el ambiente.",
            size: "giant"
        },

        {
            img: "assets/img/IMG-20250726-WA0050.jpg",
            titulo: "Bambú",
            descripcion: "Estilo rústico, ideal para ambientes cálidos.",
            size: "large"
        },
        {
            img: "assets/img/IMG-20250726-WA0060.jpg",
            titulo: "Cortina Clásica para Oficina",
            descripcion: "Cortina clásica que brinda un toque de elegancia y privacidad a un espacio de oficina.",
            size: "normal"
        },
        {
            img: "assets/img/roller-blackout.jpeg",
            titulo: "Black Out",
            descripcion: "Aislante térmico y sonoro. Totalmente opaca.",
            size: "normal"
        },
        {
            img: "assets/img/IMG-20250726-WA0055.jpg",
            titulo: "Cortinas Opacas en Habitación",
            descripcion: "Cortinas opacas que garantizan privacidad y control total de la luz en el dormitorio.",
            size: "wide"
        },
        {
            img: "assets/img/IMG-20250726-WA0062.jpg",
            titulo: "Dormitorio con Cortina Roller",
            descripcion: "Dormitorio con cortina roller que permite regular la entrada de luz y asegurar el descanso.",
            size: "large"
        },
        {
            img: "assets/img/IMG-20250726-WA0058.jpg",
            titulo: "Cortinas en Sala de Estar",
            descripcion: "Cortinas que complementan la decoración de una sala de estar, aportando calidez.",
            size: "wide"
        },
        {
            img: "assets/img/roller-rayada.jpeg",
            titulo: "Bambú rayada",
            descripcion: "Ideal para ambientes con estilo natural.",
            size: "large"
        },
        {
            img: "assets/img/IMG-20250726-WA0051.jpg",
            titulo: "Cortina Blanca Tradicional",
            descripcion: "Cortina de tela blanca clásica, aportando luminosidad a la habitación.",
            size: "large"
        },
        {
            img: "assets/img/cortina-tipo-antigua.jpeg",
            titulo: "Tradicional",
            descripcion: "Con pinza americana. Cálidas y acogedoras.",
            size: "giant"
        }
    ];

    get trabajosInfinitos() {
        // 3 repeticiones para scroll infinito más suave
        return [...this.trabajos, ...this.trabajos, ...this.trabajos];
    }

    ngAfterViewInit() {
        // Inicializar con un delay mayor para asegurar renderizado completo
        setTimeout(() => {
            this.setupEventListeners();
            this.startScrollAnimation();
        }, 300);

        // Backup: reinicializar si no se ha iniciado después de 1 segundo
        setTimeout(() => {
            if (!this.isInitialized) {
                this.startScrollAnimation();
            }
        }, 1000);
    }

    ngOnDestroy() {
        this.cleanup();
    }

    private cleanup() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = undefined;
        }
    }

    private setupEventListeners() {
        const container = this.sliderContainer.nativeElement;

        // Pausar/reanudar en hover
        container.addEventListener('mouseenter', () => {
            this.isHovered = true;
        });

        container.addEventListener('mouseleave', () => {
            this.isHovered = false;
        });

        // Manejar visibilidad de la pestaña
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.isPaused = true;
            } else {
                this.isPaused = false;
            }
        });
    }

    private startScrollAnimation() {
        if (this.isInitialized) return;

        const sliderGrid = this.sliderGrid.nativeElement;

        this.isInitialized = true;

        const animate = () => {
            // Solo pausar si está en hover o la pestaña no está visible
            if (!this.isHovered && !this.isPaused && !document.hidden) {
                this.scrollAmount += this.speed;

                // Calcular el ancho de un set completo dinámicamente
                const singleSetWidth = this.calculateSingleSetWidth();

                // Reset cuando completamos un ciclo (cuando llegamos al segundo set)
                if (this.scrollAmount >= singleSetWidth) {
                    this.scrollAmount = 0;
                }

                sliderGrid.style.transform = `translateX(-${this.scrollAmount}px)`;
            }

            this.animationId = requestAnimationFrame(animate);
        };

        // Pequeño delay para asegurar que el DOM esté listo
        setTimeout(() => {
            animate();
        }, 200);
    }

    private calculateSingleSetWidth(): number {
        const sliderGrid = this.sliderGrid.nativeElement;
        const items = sliderGrid.querySelectorAll('li');
        const itemsPerSet = this.trabajos.length;

        if (items.length === 0) return 2000; // Fallback mayor

        // Esperar a que los elementos estén renderizados
        const firstSetItems = Array.from(items).slice(0, itemsPerSet);

        if (firstSetItems.length === 0) return 2000;

        // Calcular basado en posiciones reales
        let maxRight = 0;
        firstSetItems.forEach((item: any) => {
            const rect = item.getBoundingClientRect();
            const containerRect = sliderGrid.getBoundingClientRect();
            const relativeRight = rect.right - containerRect.left + 15; // gap
            maxRight = Math.max(maxRight, relativeRight);
        });

        // Si no tenemos medidas válidas, usar cálculo estimado
        if (maxRight === 0) {
            const estimatedWidth = itemsPerSet * (280 + 15); // ancho base + gap
            return estimatedWidth;
        }

        return maxRight;
    }

    getItemClass(index: number, size: string): string {
        const baseClass = 'item';
        switch (size) {
            case 'large':
                return `${baseClass} item-large`;
            case 'giant':
                return `${baseClass} item-giant`;
            case 'wide':
                return `${baseClass} item-wide`;
            default:
                return `${baseClass} item-normal`;
        }
    }

    // Métodos públicos para control manual
    pauseScroll() {
        this.isPaused = true;
    }

    resumeScroll() {
        this.isPaused = false;
    }

    setSpeed(newSpeed: number) {
        this.speed = Math.max(0.5, Math.min(3, newSpeed));
    }

    // Método para reinicializar el slider si hay problemas
    reinitializeSlider() {
        this.cleanup();
        this.isInitialized = false;
        this.scrollAmount = 0;
        setTimeout(() => {
            this.startScrollAnimation();
        }, 100);
    }
}