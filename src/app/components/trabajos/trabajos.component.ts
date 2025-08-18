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
    private isHovered = false;
    private isPaused = false;
    private isInitialized = false;

    // Variables para drag functionality
    private isDragging = false;
    private startX = 0;
    private startScrollAmount = 0;
    private dragVelocity = 0;
    private lastDragTime = 0;
    private lastDragX = 0;
    private momentumId?: number;
    private isMobile = false;

    // Variables para modal
    public selectedImage: any = null;
    public showModal = false;
    public scrollPosition = 0;

    trabajos = [
        {
            img: "assets/img/IMG-20250726-WA0053.jpg",
            titulo: "Roller Screen en Ventanal",
            descripcion: "Cortina roller screen en un amplio ventanal, permitiendo la visibilidad exterior con filtro UV.",
            size: "large"
        },
        {
            img: "assets/img/IMG-20250726-WA0056.jpg",
            titulo: "Tradicional en pinza italiana con blackout",
            descripcion: "Cortina tradicional en pinza italiana con blackout.",
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
            titulo: "Pinza italiana",
            descripcion: "Pinza italiana en tela Lino.",
            size: "large"
        },
        {
            img: "assets/img/cortina-tipo-antigua-translucida.jpeg",
            titulo: "Pinza italiana",
            descripcion: "Pinza italiana en tela Voile.",
            size: "large"
        },
        {
            img: "assets/img/IMG-20250726-WA0061.jpg",
            titulo: "En Voile",
            descripcion: "Cortinas en voile.",
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
            titulo: "Tradicional en Blackout",
            descripcion: "Cortina tradicional en blackout, brindando privacidad sin obstaculizar el espacio.",
            size: "normal"
        },
        {
            img: "assets/img/IMG-20250726-WA0052.jpg",
            titulo: "Roller Blackout Beige",
            descripcion: "Cortina roller blackout de color beige.",
            size: "giant"
        },
        {
            img: "assets/img/IMG-20250726-WA0050.jpg",
            titulo: "Screen 5%",
            descripcion: "Tela Screen 5%.",
            size: "large"
        },
        {
            img: "assets/img/IMG-20250726-WA0060.jpg",
            titulo: "Cortina Clásica",
            descripcion: "Un toque de elegancia y privacidad para tu espacio.",
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
            titulo: "Cortinas Screen",
            descripcion: "Cortinas que garantizan privacidad y control total de la luz.",
            size: "wide"
        },
        {
            img: "assets/img/IMG-20250726-WA0062.jpg",
            titulo: "Cortina tradicional en Voile",
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
            titulo: "Bambú",
            descripcion: "Ideal para ambientes con estilo natural.",
            size: "large"
        },
        {
            img: "assets/img/IMG-20250726-WA0051.jpg",
            titulo: "Cortina Roller",
            descripcion: "Tela Screen 5%.",
            size: "large"
        },
        {
            img: "assets/img/cortina-tipo-antigua.jpeg",
            titulo: "Tradicional",
            descripcion: "Cortina tradicional doble en Pinza Americana.",
            size: "giant"
        }
    ];

    get trabajosInfinitos() {
        return [...this.trabajos, ...this.trabajos, ...this.trabajos];
    }

    ngAfterViewInit() {
        this.checkIfMobile();
        setTimeout(() => {
            this.setupEventListeners();
            this.startScrollAnimation();
        }, 300);

        setTimeout(() => {
            if (!this.isInitialized) {
                this.startScrollAnimation();
            }
        }, 1000);

        // Listener para cambios de tamaño de ventana
        window.addEventListener('resize', () => {
            this.checkIfMobile();
        });
    }

    ngOnDestroy() {
        this.cleanup();
        if (this.momentumId) {
            cancelAnimationFrame(this.momentumId);
        }
    }

    private checkIfMobile() {
        this.isMobile = window.innerWidth <= 768;
    }

    private cleanup() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = undefined;
        }
    }

    private setupEventListeners() {
        const container = this.sliderContainer.nativeElement;

        // Eventos de mouse para desktop
        if (!this.isMobile) {
            container.addEventListener('mouseenter', () => {
                this.isHovered = true;
            });

            container.addEventListener('mouseleave', () => {
                this.isHovered = false;
            });

            this.setupMouseEvents(container);
        } else {
            // Eventos touch para móvil
            this.setupTouchEvents(container);
        }

        // Manejar visibilidad de la pestaña
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.isPaused = true;
            } else {
                this.isPaused = false;
            }
        });
    }

    private setupMouseEvents(container: HTMLElement) {
        let mouseStartTime = 0;
        let mouseStartX = 0;
        let hasMoved = false;
        let isMouseDown = false;

        // Mouse down
        container.addEventListener('mousedown', (e) => {
            // Solo botón izquierdo
            if (e.button !== 0) return;

            mouseStartTime = Date.now();
            mouseStartX = e.clientX;
            hasMoved = false;
            isMouseDown = true;

            this.startX = e.clientX;
            this.startScrollAmount = this.scrollAmount;
            this.isDragging = true;
            this.isPaused = true;
            this.dragVelocity = 0;
            this.lastDragTime = Date.now();
            this.lastDragX = this.startX;

            if (this.momentumId) {
                cancelAnimationFrame(this.momentumId);
                this.momentumId = undefined;
            }

            container.style.cursor = 'grabbing';

            // Prevenir selección de texto
            e.preventDefault();
        });

        // Mouse move
        container.addEventListener('mousemove', (e) => {
            if (!this.isDragging || !isMouseDown) return;

            e.preventDefault();
            hasMoved = true;

            const currentX = e.clientX;
            const deltaX = this.startX - currentX;
            const currentTime = Date.now();

            // Calcular velocidad para momentum
            if (currentTime - this.lastDragTime > 0) {
                this.dragVelocity = (this.lastDragX - currentX) / (currentTime - this.lastDragTime);
            }

            this.lastDragX = currentX;
            this.lastDragTime = currentTime;

            // Actualizar posición
            const newScrollAmount = this.startScrollAmount + deltaX;
            const singleSetWidth = this.calculateSingleSetWidth();

            // Wrap around logic
            if (newScrollAmount < 0) {
                this.scrollAmount = singleSetWidth + (newScrollAmount % singleSetWidth);
            } else if (newScrollAmount >= singleSetWidth) {
                this.scrollAmount = newScrollAmount % singleSetWidth;
            } else {
                this.scrollAmount = newScrollAmount;
            }

            this.updateSliderPosition();
        });

        // Mouse up
        container.addEventListener('mouseup', (e) => {
            if (!isMouseDown) return;

            const mouseEndTime = Date.now();
            const mouseDuration = mouseEndTime - mouseStartTime;
            const mouseDistance = Math.abs(e.clientX - mouseStartX);

            // Si fue un click rápido sin mucho movimiento = CLICK
            if (mouseDuration < 300 && mouseDistance < 10 && !hasMoved) {
                const target = e.target as HTMLElement;
                let imageElement: HTMLImageElement | null = null;

                // Buscar imagen
                if (target.tagName === 'IMG') {
                    imageElement = target as HTMLImageElement;
                } else {
                    const parentLi = target.closest('li');
                    if (parentLi) {
                        imageElement = parentLi.querySelector('img');
                    }
                }

                if (imageElement) {
                    const imgSrc = imageElement.src;
                    const trabajo = this.trabajos.find(t => {
                        const imgName = t.img.split('/').pop();
                        return imgSrc.includes(imgName || '') || imgSrc.includes(t.img);
                    });

                    if (trabajo) {
                        this.openModal(trabajo);
                        // Reset estados y salir
                        this.resetMouseStates(container);
                        isMouseDown = false;
                        return;
                    }
                }
            }

            this.resetMouseStates(container);
            isMouseDown = false;

            // Aplicar momentum si hay velocidad
            if (Math.abs(this.dragVelocity) > 0.1 && hasMoved) {
                this.applyMomentum();
            } else {
                this.isPaused = false;
            }
        });

        // Mouse leave - para cuando el mouse sale del container
        container.addEventListener('mouseleave', () => {
            if (this.isDragging && isMouseDown) {
                this.resetMouseStates(container);
                isMouseDown = false;
                // Aplicar momentum si hay velocidad
                if (Math.abs(this.dragVelocity) > 0.1 && hasMoved) {
                    this.applyMomentum();
                } else {
                    this.isPaused = false;
                }
            }
        });

        // Mouse up global - por si sueltan fuera del container
        document.addEventListener('mouseup', () => {
            if (isMouseDown) {
                this.resetMouseStates(container);
                isMouseDown = false;
                this.isPaused = false;
            }
        });
    }

    private setupTouchEvents(container: HTMLElement) {
        let touchStartTime = 0;
        let touchStartX = 0;
        let touchStartY = 0;
        let hasMoved = false;
        let holdTimer: any;
        let isHolding = false;

        // Touch start
        container.addEventListener('touchstart', (e) => {
            if (e.touches.length !== 1) return;

            touchStartTime = Date.now();
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            hasMoved = false;
            isHolding = false;

            this.startX = e.touches[0].clientX;
            this.startScrollAmount = this.scrollAmount;
            this.dragVelocity = 0;
            this.lastDragTime = Date.now();
            this.lastDragX = this.startX;

            if (this.momentumId) {
                cancelAnimationFrame(this.momentumId);
                this.momentumId = undefined;
            }

            // Timer para detectar "hold" (200ms)
            holdTimer = setTimeout(() => {
                isHolding = true;
                this.isDragging = true;
                this.isPaused = true;
                container.style.cursor = 'grabbing';

                // Vibración sutil para feedback (si está disponible)
                if ('vibrate' in navigator) {
                    navigator.vibrate(50);
                }
            }, 200);

        }, { passive: false });

        // Touch move
        container.addEventListener('touchmove', (e) => {
            if (e.touches.length !== 1) return;

            const currentX = e.touches[0].clientX;
            const currentY = e.touches[0].clientY;
            const deltaX = Math.abs(currentX - touchStartX);
            const deltaY = Math.abs(currentY - touchStartY);

            // Si se mueve más de 10px, cancelar el timer de hold
            if ((deltaX > 10 || deltaY > 10) && !isHolding) {
                clearTimeout(holdTimer);
                hasMoved = true;
            }

            // Solo procesar drag si ya estamos en modo holding
            if (!this.isDragging || !isHolding) return;

            e.preventDefault();
            hasMoved = true;

            const deltaXScroll = this.startX - currentX;
            const currentTime = Date.now();

            // Calcular velocidad para momentum
            if (currentTime - this.lastDragTime > 0) {
                this.dragVelocity = (this.lastDragX - currentX) / (currentTime - this.lastDragTime);
            }

            this.lastDragX = currentX;
            this.lastDragTime = currentTime;

            // Actualizar posición
            const newScrollAmount = this.startScrollAmount + deltaXScroll;
            const singleSetWidth = this.calculateSingleSetWidth();

            // Wrap around logic
            if (newScrollAmount < 0) {
                this.scrollAmount = singleSetWidth + (newScrollAmount % singleSetWidth);
            } else if (newScrollAmount >= singleSetWidth) {
                this.scrollAmount = newScrollAmount % singleSetWidth;
            } else {
                this.scrollAmount = newScrollAmount;
            }

            this.updateSliderPosition();
        }, { passive: false });

        // Touch end
        container.addEventListener('touchend', (e) => {
            clearTimeout(holdTimer);

            const touchEndTime = Date.now();
            const touchDuration = touchEndTime - touchStartTime;
            const touchDistance = Math.abs(e.changedTouches[0].clientX - touchStartX);

            // Si fue un tap rápido, sin hold y sin mucho movimiento = CLICK
            if (touchDuration < 200 && touchDistance < 10 && !hasMoved && !isHolding) {
                // Buscar el elemento imagen más cercano
                const target = e.target as HTMLElement;
                let imageElement: HTMLImageElement | null = null;
                let trabajo: any = null;

                // Buscar la imagen de diferentes maneras
                if (target.tagName === 'IMG') {
                    imageElement = target as HTMLImageElement;
                } else {
                    imageElement = target.closest('li')?.querySelector('img') as HTMLImageElement;
                }

                if (imageElement) {
                    const imgSrc = imageElement.src;
                    // Buscar el trabajo correspondiente
                    trabajo = this.trabajos.find(t => {
                        const imgName = t.img.split('/').pop();
                        return imgSrc.includes(imgName || '');
                    }) || this.trabajos.find(t => imgSrc.includes(t.img));

                    if (trabajo) {
                        this.openModal(trabajo);
                        return; // Salir para evitar aplicar momentum
                    }
                }
            }

            // Reset estados
            this.isDragging = false;
            isHolding = false;
            container.style.cursor = 'grab';

            // Aplicar momentum solo si se hizo drag y hay velocidad
            if (Math.abs(this.dragVelocity) > 0.1 && hasMoved && isHolding) {
                this.applyMomentum();
            } else {
                this.isPaused = false;
            }
        });

        // Touch cancel - por si se interrumpe el touch
        container.addEventListener('touchcancel', () => {
            clearTimeout(holdTimer);
            this.isDragging = false;
            isHolding = false;
            this.isPaused = false;
            container.style.cursor = 'grab';
        });
    }

    private resetMouseStates(container: HTMLElement) {
        this.isDragging = false;
        container.style.cursor = 'grab';
    }

    private applyMomentum() {
        const friction = 0.95;
        const minVelocity = 0.1;

        const momentum = () => {
            if (Math.abs(this.dragVelocity) < minVelocity) {
                this.isPaused = false;
                return;
            }

            this.scrollAmount += this.dragVelocity * 5;
            this.dragVelocity *= friction;

            const singleSetWidth = this.calculateSingleSetWidth();

            if (this.scrollAmount < 0) {
                this.scrollAmount = singleSetWidth + (this.scrollAmount % singleSetWidth);
            } else if (this.scrollAmount >= singleSetWidth) {
                this.scrollAmount = this.scrollAmount % singleSetWidth;
            }

            this.updateSliderPosition();
            this.momentumId = requestAnimationFrame(momentum);
        };

        this.momentumId = requestAnimationFrame(momentum);
    }

    private updateSliderPosition() {
        const sliderGrid = this.sliderGrid.nativeElement;
        sliderGrid.style.transform = `translateX(-${this.scrollAmount}px)`;
    }

    private startScrollAnimation() {
        if (this.isInitialized) return;

        const sliderGrid = this.sliderGrid.nativeElement;
        this.isInitialized = true;

        const animate = () => {
            if (!this.isHovered && !this.isPaused && !document.hidden && !this.isDragging) {
                this.scrollAmount += this.speed;

                const singleSetWidth = this.calculateSingleSetWidth();

                if (this.scrollAmount >= singleSetWidth) {
                    this.scrollAmount = 0;
                }

                sliderGrid.style.transform = `translateX(-${this.scrollAmount}px)`;
            }

            this.animationId = requestAnimationFrame(animate);
        };

        setTimeout(() => {
            animate();
        }, 200);
    }

    private calculateSingleSetWidth(): number {
        const sliderGrid = this.sliderGrid.nativeElement;
        const items = sliderGrid.querySelectorAll('li');
        const itemsPerSet = this.trabajos.length;

        if (items.length === 0) return 2000;

        const firstSetItems = Array.from(items).slice(0, itemsPerSet);

        if (firstSetItems.length === 0) return 2000;

        let maxRight = 0;
        firstSetItems.forEach((item: any) => {
            const rect = item.getBoundingClientRect();
            const containerRect = sliderGrid.getBoundingClientRect();
            const relativeRight = rect.right - containerRect.left + 15;
            maxRight = Math.max(maxRight, relativeRight);
        });

        if (maxRight === 0) {
            const estimatedWidth = itemsPerSet * (280 + 15);
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

    // Métodos para modal
    openModal(trabajo: any) {
        this.selectedImage = trabajo;
        this.showModal = true;
        this.scrollPosition = window.pageYOffset;

        // Bloquear scroll en toda la página
        document.documentElement.style.overflow = 'hidden';
    }

    closeModal() {
        this.showModal = false;
        this.selectedImage = null;

        // Desbloquear scroll
        document.documentElement.style.overflow = '';
        // Restaurar posición
        window.scrollTo(0, this.scrollPosition);
    }

    onModalBackgroundClick(event: Event) {
        // Solo cerrar si se hace click en el background, no en la imagen o contenido
        if (event.target === event.currentTarget) {
            this.closeModal();
            event.preventDefault();
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

    reinitializeSlider() {
        this.cleanup();
        this.isInitialized = false;
        this.scrollAmount = 0;
        setTimeout(() => {
            this.startScrollAnimation();
        }, 100);
    }
}