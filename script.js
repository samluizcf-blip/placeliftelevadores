const mobileMenuButton = document.querySelector('.mobile-menu-button');
const mainNavigation = document.querySelector('.main-navigation');
const navigationLinks = document.querySelectorAll('.main-navigation a');
const contactForm = document.querySelector('.contact-form');
const contactFeedback = document.querySelector('.contact-form__feedback');
const carouselTrack = document.querySelector('.portfolio-carousel__track');
const carouselCards = document.querySelectorAll('.portfolio-card');
const carouselPreviousButton = document.querySelector('.carousel-button--previous');
const carouselNextButton = document.querySelector('.carousel-button--next');
const animatedElements = document.querySelectorAll('.animate-on-scroll');

// TROCAR TELEFONE AQUI: use somente números, com DDI + DDD.
const whatsappPhoneNumber = '5511986991107';
let currentCarouselIndex = 0;

function closeMobileMenu() {
    if (!mobileMenuButton || !mainNavigation) return;
    mainNavigation.classList.remove('is-open');
    mobileMenuButton.classList.remove('is-active');
    mobileMenuButton.setAttribute('aria-expanded', 'false');
}

if (mobileMenuButton && mainNavigation) {
    mobileMenuButton.addEventListener('click', () => {
        const isOpen = mainNavigation.classList.toggle('is-open');
        mobileMenuButton.classList.toggle('is-active', isOpen);
        mobileMenuButton.setAttribute('aria-expanded', String(isOpen));
    });

    navigationLinks.forEach((link) => link.addEventListener('click', closeMobileMenu));
}

function getCarouselLimit() {
    const visibleCards = window.innerWidth >= 900 ? 2 : 1;
    return Math.max(carouselCards.length - visibleCards, 0);
}

function updatePortfolioCarousel() {
    if (!carouselTrack || carouselCards.length === 0) return;
    const cardWidth = carouselCards[0].getBoundingClientRect().width;
    const gapWidth = 16;
    carouselTrack.style.transform = `translateX(-${currentCarouselIndex * (cardWidth + gapWidth)}px)`;
}

if (carouselPreviousButton && carouselNextButton) {
    carouselPreviousButton.addEventListener('click', () => {
        currentCarouselIndex = Math.max(currentCarouselIndex - 1, 0);
        updatePortfolioCarousel();
    });

    carouselNextButton.addEventListener('click', () => {
        currentCarouselIndex = Math.min(currentCarouselIndex + 1, getCarouselLimit());
        updatePortfolioCarousel();
    });

    window.addEventListener('resize', () => {
        currentCarouselIndex = Math.min(currentCarouselIndex, getCarouselLimit());
        updatePortfolioCarousel();
    });
}

if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
        event.preventDefault();

        if (!contactForm.checkValidity()) {
            contactFeedback.textContent = 'Preencha todos os campos obrigatórios antes de enviar.';
            return;
        }

        const formData = new FormData(contactForm);
        const name = formData.get('nome');
        const phone = formData.get('telefone');
        const region = formData.get('regiao');
        const service = formData.get('servico');
        const message = formData.get('mensagem');

        const whatsappMessage = encodeURIComponent(
            `Olá, meu nome é ${name}.\n` +
            `Telefone: ${phone}.\n` +
            `Região do atendimento: ${region}.\n` +
            `Serviço desejado: ${service}.\n` +
            `Detalhes: ${message}`
        );

        contactFeedback.textContent = 'Abrindo o WhatsApp com a mensagem preenchida...';
        window.open(`https://wa.me/${whatsappPhoneNumber}?text=${whatsappMessage}`, '_blank');
    });
}

if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.16 });

    animatedElements.forEach((element) => observer.observe(element));
} else {
    animatedElements.forEach((element) => element.classList.add('is-visible'));
}

updatePortfolioCarousel();
