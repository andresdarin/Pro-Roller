const slider = document.getElementById('sliderContainer');
const sliderGrid = document.getElementById('sliderGrid');

// Clonar los items para simular infinito
sliderGrid.innerHTML += sliderGrid.innerHTML;

let scrollAmount = 0;
const speed = 0.5; // velocidad de desplazamiento (px/frame)

function autoScroll() {
    scrollAmount += speed;
    if (scrollAmount >= sliderGrid.scrollWidth / 2) {
        scrollAmount = 0; // reinicia scroll cuando llega a la mitad (copia)
    }
    slider.scrollLeft = scrollAmount;
    requestAnimationFrame(autoScroll);
}

autoScroll();
