const botaoMenuMobile = document.querySelector('.botao-menu-mobile');
const menuNavegacao = document.querySelector('.menu-navegacao');
const linksMenu = document.querySelectorAll('.menu-navegacao a');
const formularioAgendamento = document.querySelector('.formulario-agendamento');
const mensagemFormulario = document.querySelector('.mensagem-formulario');
const trilhoCarrossel = document.querySelector('.carrossel-predios__trilho');
const botaoAnterior = document.querySelector('.carrossel-predios__controle--anterior');
const botaoProximo = document.querySelector('.carrossel-predios__controle--proximo');
const cartoesPredio = document.querySelectorAll('.cartao-predio');
const elementosAnimados = document.querySelectorAll('.efeito-subida');
const cabecalhoPrincipal = document.querySelector('.cabecalho-principal');
const faqItems = document.querySelectorAll('.item-faq');

window.addEventListener('scroll', () => {
    if (cabecalhoPrincipal) {
        if (window.scrollY > 50) {
            cabecalhoPrincipal.classList.add('cabecalho-rolagem');
        } else {
            cabecalhoPrincipal.classList.remove('cabecalho-rolagem');
        }
    }
});

faqItems.forEach(item => {
    item.addEventListener('toggle', (e) => {
        if (item.open) {
            faqItems.forEach(outroItem => {
                if (outroItem !== item) outroItem.removeAttribute('open');
            });
        }
    });
});

const telefoneWhatsApp = '5511986991107';
let indiceAtualCarrossel = 0;

if (botaoMenuMobile && menuNavegacao) {
    botaoMenuMobile.addEventListener('click', () => {
        const menuAberto = menuNavegacao.classList.toggle('aberto');
        botaoMenuMobile.classList.toggle('ativo', menuAberto);
        botaoMenuMobile.setAttribute('aria-expanded', String(menuAberto));
    });

    linksMenu.forEach((link) => {
        link.addEventListener('click', () => {
            menuNavegacao.classList.remove('aberto');
            botaoMenuMobile.classList.remove('ativo');
            botaoMenuMobile.setAttribute('aria-expanded', 'false');
        });
    });

    document.addEventListener('click', (evento) => {
        const isClickDentroMenu = menuNavegacao.contains(evento.target);
        const isClickBotaoMenu = botaoMenuMobile.contains(evento.target);
        
        if (!isClickDentroMenu && !isClickBotaoMenu && menuNavegacao.classList.contains('aberto')) {
            menuNavegacao.classList.remove('aberto');
            botaoMenuMobile.classList.remove('ativo');
            botaoMenuMobile.setAttribute('aria-expanded', 'false');
        }
    });
}

function atualizarCarrossel() {
    if (!trilhoCarrossel || cartoesPredio.length === 0) {
        return;
    }

    const larguraCartao = cartoesPredio[0].getBoundingClientRect().width;
    const espacamento = window.innerWidth >= 900 ? 16 : 16;
    const deslocamento = indiceAtualCarrossel * (larguraCartao + espacamento);
    trilhoCarrossel.style.transform = `translateX(-${deslocamento}px)`;
}

if (botaoAnterior && botaoProximo) {
    botaoAnterior.addEventListener('click', () => {
        indiceAtualCarrossel = Math.max(indiceAtualCarrossel - 1, 0);
        atualizarCarrossel();
    });

    botaoProximo.addEventListener('click', () => {
        const limiteDesktop = window.innerWidth >= 900 ? Math.max(cartoesPredio.length - 2, 0) : Math.max(cartoesPredio.length - 1, 0);
        indiceAtualCarrossel = Math.min(indiceAtualCarrossel + 1, limiteDesktop);
        atualizarCarrossel();
    });

    window.addEventListener('resize', () => {
        const limiteDesktop = window.innerWidth >= 900 ? Math.max(cartoesPredio.length - 2, 0) : Math.max(cartoesPredio.length - 1, 0);
        indiceAtualCarrossel = Math.min(indiceAtualCarrossel, limiteDesktop);
        atualizarCarrossel();
    });
}

if (trilhoCarrossel && cartoesPredio.length > 0) {
    let toqueInicioX = 0;
    let toqueFimX = 0;

    trilhoCarrossel.addEventListener('touchstart', (e) => {
        toqueInicioX = e.changedTouches[0].screenX;
    }, { passive: true });

    trilhoCarrossel.addEventListener('touchend', (e) => {
        toqueFimX = e.changedTouches[0].screenX;
        lidarComSwipe();
    }, { passive: true });

    function lidarComSwipe() {
        const limiteDesktop = window.innerWidth >= 900 ? Math.max(cartoesPredio.length - 2, 0) : Math.max(cartoesPredio.length - 1, 0);
        if (toqueFimX < toqueInicioX - 40) {
            indiceAtualCarrossel = Math.min(indiceAtualCarrossel + 1, limiteDesktop);
            atualizarCarrossel();
        }
        if (toqueFimX > toqueInicioX + 40) {
            indiceAtualCarrossel = Math.max(indiceAtualCarrossel - 1, 0);
            atualizarCarrossel();
        }
    }
}

if (formularioAgendamento) {
    formularioAgendamento.addEventListener('submit', (evento) => {
        evento.preventDefault();

        if (!formularioAgendamento.checkValidity()) {
            mensagemFormulario.textContent = 'Preencha todos os campos antes de continuar para o WhatsApp.';
            return;
        }

        const dadosFormulario = new FormData(formularioAgendamento);
        const nome = dadosFormulario.get('nome');
        const telefone = dadosFormulario.get('telefone');
        const regiao = dadosFormulario.get('regiao');
        const servico = dadosFormulario.get('servico');
        const mensagem = dadosFormulario.get('mensagem');

        const textoWhatsApp = `Olá, meu nome é ${nome}.%0A` +
            `Telefone: ${telefone}.%0A` +
            `Região do atendimento: ${regiao}.%0A` +
            `Serviço desejado: ${servico}.%0A` +
            `Detalhes: ${mensagem}`;

        const urlWhatsApp = `https://wa.me/${telefoneWhatsApp}?text=${textoWhatsApp}`;

        mensagemFormulario.textContent = 'Abrindo o WhatsApp com a mensagem preenchida...';
        window.open(urlWhatsApp, '_blank');
    });
}

if ('IntersectionObserver' in window) {
    const observador = new IntersectionObserver((entradas) => {
        entradas.forEach((entrada) => {
            if (entrada.isIntersecting) {
                entrada.target.classList.add('visivel');
                observador.unobserve(entrada.target);
            }
        });
    }, {
        threshold: 0.18
    });

    elementosAnimados.forEach((elemento) => observador.observe(elemento));
} else {
    elementosAnimados.forEach((elemento) => elemento.classList.add('visivel'));
}

atualizarCarrossel();
