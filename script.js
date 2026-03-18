/**
 * MILLENNIUM STORE - SCRIPT.JS
 * Elegância e Sofisticação
 */

// ========================================
// CONFIGURAÇÕES
// ========================================
const CONFIG = {
    // Número do WhatsApp (substitua pelo número real)
    whatsappNumber: '5511999999999',
    
    // Mensagem padrão do WhatsApp
    whatsappMessage: 'Olá! Gostaria de saber mais sobre os produtos da Millennium Store.',
    
    // Configurações de animação
    animation: {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    }
};

// ========================================
// UTILITÁRIOS
// ========================================

/**
 * Debounce function para otimizar eventos
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function para otimizar scroll
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ========================================
// HEADER E NAVEGAÇÃO
// ========================================

/**
 * Controla o comportamento do header ao rolar
 */
function initHeader() {
    const header = document.getElementById('header');
    const scrollThreshold = 100;
    
    function updateHeader() {
        if (window.scrollY > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    // Usar throttle para otimizar performance
    window.addEventListener('scroll', throttle(updateHeader, 100));
    updateHeader(); // Verificar estado inicial
}

/**
 * Menu mobile - toggle
 */
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (!menuToggle || !navMenu) return;
    
    // Toggle menu
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    // Fechar menu ao clicar em um link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Fechar menu ao clicar fora
    document.addEventListener('click', (e) => {
        if (!header.contains(e.target) && navMenu.classList.contains('active')) {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

/**
 * Navegação suave entre seções
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ========================================
// ANIMAÇÕES DE SCROLL
// ========================================

/**
 * Inicializa animações de reveal ao scroll
 */
function initScrollReveal() {
    const revealElements = document.querySelectorAll(
        '.section-header, .product-card, .category-card, .value-item, .lookbook-item, .sobre-text'
    );
    
    const revealOptions = {
        threshold: CONFIG.animation.threshold,
        rootMargin: CONFIG.animation.rootMargin
    };
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal', 'active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, revealOptions);
    
    revealElements.forEach((el, index) => {
        el.style.transitionDelay = `${index * 0.05}s`;
        revealObserver.observe(el);
    });
}

/**
 * Animação de parallax sutil no hero
 */
function initParallax() {
    const heroImage = document.querySelector('.hero-image img');
    if (!heroImage) return;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.3;
        
        if (scrolled < window.innerHeight) {
            heroImage.style.transform = `translateY(${rate}px) scale(1.1)`;
        }
    }
    
    window.addEventListener('scroll', throttle(updateParallax, 16));
}

// ========================================
// FUNCIONALIDADE WHATSAPP
// ========================================

/**
 * Abre o WhatsApp com mensagem personalizada
 * @param {string} productName - Nome do produto (opcional)
 */
function comprar(productName = '') {
    let message = CONFIG.whatsappMessage;
    
    if (productName) {
        message = `Olá! Tenho interesse no produto: ${productName}. Poderia me passar mais informações?`;
    }
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
}

/**
 * Filtra produtos por categoria
 * @param {string} categoria - Nome da categoria
 */
function filtrarCategoria(categoria) {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        const categoryText = card.querySelector('.product-category').textContent.toLowerCase();
        
        if (categoryText === categoria.toLowerCase()) {
            card.style.display = 'block';
            card.classList.add('reveal', 'active');
        } else {
            card.style.display = 'none';
        }
    });
    
    // Scroll para a seção de produtos
    const colecaoSection = document.getElementById('colecao');
    if (colecaoSection) {
        const headerOffset = 100;
        const elementPosition = colecaoSection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
    
    // Mostrar mensagem de filtro aplicado
    showNotification(`Mostrando produtos da categoria: ${categoria.charAt(0).toUpperCase() + categoria.slice(1)}`);
}

// ========================================
// NOTIFICAÇÕES
// ========================================

/**
 * Exibe uma notificação temporária
 * @param {string} message - Mensagem a ser exibida
 */
function showNotification(message) {
    // Remover notificação anterior se existir
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Criar nova notificação
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <span>${message}</span>
    `;
    
    // Estilos da notificação
    notification.style.cssText = `
        position: fixed;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%) translateY(20px);
        background: var(--color-black);
        color: var(--color-white);
        padding: 1rem 2rem;
        border-radius: 4px;
        font-family: var(--font-body);
        font-size: 0.9rem;
        z-index: 10000;
        opacity: 0;
        transition: all 0.3s ease;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    `;
    
    document.body.appendChild(notification);
    
    // Animar entrada
    requestAnimationFrame(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(-50%) translateY(0)';
    });
    
    // Remover após 3 segundos
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(-50%) translateY(20px)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ========================================
// PRODUTOS E INTERAÇÕES
// ========================================

/**
 * Inicializa interações nos cards de produto
 */
function initProductCards() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        // Efeito de hover melhorado
        card.addEventListener('mouseenter', () => {
            card.style.zIndex = '10';
        });
        
        card.addEventListener('mouseleave', () => {
            setTimeout(() => {
                card.style.zIndex = '1';
            }, 300);
        });
    });
}

/**
 * Inicializa interações no lookbook
 */
function initLookbook() {
    const lookbookItems = document.querySelectorAll('.lookbook-item');
    
    lookbookItems.forEach(item => {
        item.addEventListener('click', () => {
            const instagramUrl = 'https://instagram.com/millenniumboutique';
            window.open(instagramUrl, '_blank', 'noopener,noreferrer');
        });
    });
}

// ========================================
// PERFORMANCE E OTIMIZAÇÃO
// ========================================

/**
 * Lazy loading para imagens
 */
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px 0px'
    });
    
    images.forEach(img => imageObserver.observe(img));
}

/**
 * Preload de imagens críticas
 */
function preloadCriticalImages() {
    const criticalImages = [
        'images/hero.jpg',
        'images/logo-black.png',
        'images/logo-white.png'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// ========================================
// ANÁLISE E RASTREAMENTO
// ========================================

/**
 * Rastreamento de eventos (preparado para Google Analytics)
 */
function trackEvent(eventName, eventData = {}) {
    // Se o Google Analytics estiver instalado
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, eventData);
    }
    
    // Log para debug
    console.log('Event tracked:', eventName, eventData);
}

/**
 * Inicializa rastreamento de eventos
 */
function initTracking() {
    // Rastrear cliques em produtos
    document.querySelectorAll('.btn-buy').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productName = e.target.closest('.product-card')?.dataset.product;
            if (productName) {
                trackEvent('product_click', {
                    product_name: productName
                });
            }
        });
    });
    
    // Rastrear cliques no WhatsApp
    document.querySelectorAll('.btn-whatsapp-large, .whatsapp-float').forEach(btn => {
        btn.addEventListener('click', () => {
            trackEvent('whatsapp_click');
        });
    });
    
    // Rastrear cliques no Instagram
    document.querySelectorAll('.btn-instagram, .lookbook-item').forEach(btn => {
        btn.addEventListener('click', () => {
            trackEvent('instagram_click');
        });
    });
}

// ========================================
// INICIALIZAÇÃO
// ========================================

/**
 * Inicializa todas as funcionalidades do site
 */
function init() {
    // Verificar se o DOM está pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeApp);
    } else {
        initializeApp();
    }
}

/**
 * Função principal de inicialização
 */
function initializeApp() {
    // Preload de imagens críticas
    preloadCriticalImages();
    
    // Inicializar componentes
    initHeader();
    initMobileMenu();
    initSmoothScroll();
    initScrollReveal();
    initParallax();
    initProductCards();
    initLookbook();
    initLazyLoading();
    initTracking();
    
    // Log de inicialização
    console.log('%c Millennium Store ', 'background: #1a1a1a; color: #c9a962; font-size: 20px; padding: 10px;');
    console.log('%c Elegância que veste você ', 'color: #6b6b6b; font-size: 14px;');
}

// Iniciar aplicação
init();

// ========================================
// EXPORTAÇÕES GLOBAIS
// ========================================

// Tornar funções disponíveis globalmente para uso em HTML
window.comprar = comprar;
window.filtrarCategoria = filtrarCategoria;
window.showNotification = showNotification;
