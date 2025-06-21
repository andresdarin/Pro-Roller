window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;
    const header = window.document.querySelector('.main-header');
    const link = window.document.querySelector('.scroll-link');
    if (scrollPos > 10) {
        header.classList.add('scrolled');
        link.classList.add('blanco');
    } else {
        header.classList.remove('scrolled');
        link.classList.remove('blanco');
    }
});

function hideBurguer() {
    document.getElementById('menu-btn').checked = false;
}