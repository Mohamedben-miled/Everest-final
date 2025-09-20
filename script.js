// Professional Accounting Website JavaScript
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const header = document.querySelector('.header');

// Mobile menu toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu on link click
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = target.offsetTop - headerHeight;
            window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        }
    });
});

// Contact form
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    const name = formData.get('name');
    const email = formData.get('email');
    const service = formData.get('service');
    const message = formData.get('message');
    
    if (!name || !email || !service || !message) {
        showMessage('Please fill in all required fields.', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showMessage('Please enter a valid email address.', 'error');
        return;
    }
    
    const submitBtn = this.querySelector('button[type="submit"]');
    submitBtn.innerHTML = 'Sending...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        showMessage('Thank you for your message! We will get back to you soon.', 'success');
        this.reset();
        submitBtn.innerHTML = 'Send Message';
        submitBtn.disabled = false;
    }, 2000);
});

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showMessage(text, type) {
    const existingMessage = document.querySelector('.success-message, .error-message');
    if (existingMessage) existingMessage.remove();
    
    const messageDiv = document.createElement('div');
    messageDiv.className = type === 'success' ? 'success-message' : 'error-message';
    messageDiv.innerHTML = '<i class="fas ' + (type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle') + '"></i> <span>' + text + '</span>';
    
    contactForm.parentNode.insertBefore(messageDiv, contactForm.nextSibling);
    
    setTimeout(() => {
        if (messageDiv.parentNode) messageDiv.remove();
    }, 5000);
}

// Enhanced scroll effects for navbar
let ticking = false;
function updateScrollEffects() {
    const scrolled = window.pageYOffset;
    
    if (scrolled > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(updateScrollEffects);
        ticking = true;
    }
});

// Animate elements on scroll
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
});

document.querySelectorAll('.service-card, .stat').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Button ripple effect
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = 'position: absolute; width: ' + size + 'px; height: ' + size + 'px; left: ' + x + 'px; top: ' + y + 'px; border-radius: 50%; background: rgba(255, 255, 255, 0.4); transform: scale(0); animation: ripple 0.6s linear; pointer-events: none;';
        
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });
});

// Professional Chatbot
class ProfessionalChatbot {
    constructor() {
        this.isOpen = false;
        this.responses = {
            'greeting': ["Bonjour! Je suis votre assistant comptable EVEREST AUDIT. Comment puis-je vous aider aujourd'hui?"],
            'services': ["Nous offrons des services d'expertise comptable, audit, conseil fiscal, tenue de livres, et consultation financière."],
            'pricing': ["Nous offrons des consultations gratuites et des tarifs compétitifs. Contactez-nous au 20 448 160 pour un devis."],
            'contact': ["Appelez-nous au 20 448 160, email majdi.besbes@mail.com, ou visitez notre bureau à Résidence Rania, Aouina, Tunis."],
            'tax_calculator': ["Je peux calculer votre TVA à 19%. Combien avez-vous gagné ce mois-ci en dinars tunisiens?"],
            'default': ["Je serais ravi de vous aider! Contactez-nous au 20 448 160 pour plus d'informations."]
        };
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeChatbot());
        } else {
            this.initializeChatbot();
        }
    }
    
    initializeChatbot() {
        this.toggle = document.getElementById('chatbotToggle');
        this.window = document.getElementById('chatbotWindow');
        this.close = document.getElementById('chatbotClose');
        this.input = document.getElementById('chatbotInput');
        this.sendBtn = document.getElementById('chatbotSend');
        this.messagesContainer = document.getElementById('chatbotMessages');
        
        if (!this.toggle || !this.window) {
            console.error('Chatbot elements not found!');
            return;
        }
        
        this.toggle.addEventListener('click', () => this.toggleChatbot());
        this.close.addEventListener('click', () => this.closeChatbot());
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
        
        document.querySelectorAll('.quick-action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.input.value = e.target.getAttribute('data-message');
                this.sendMessage();
            });
        });
        
        console.log('Chatbot initialized successfully!');
    }
    
    toggleChatbot() {
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
            this.window.classList.add('active');
            this.input.focus();
        } else {
            this.window.classList.remove('active');
        }
    }
    
    closeChatbot() {
        this.isOpen = false;
        this.window.classList.remove('active');
    }
    
    sendMessage() {
        const message = this.input.value.trim();
        if (!message) return;
        
        this.addUserMessage(message);
        this.input.value = '';
        
        setTimeout(() => {
            this.processMessage(message);
        }, 1000);
    }
    
    addUserMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message user-message';
        messageDiv.innerHTML = '<div class="message-avatar"><i class="fas fa-user"></i></div><div class="message-content"><p>' + message + '</p><span class="message-time">' + new Date().toLocaleTimeString() + '</span></div>';
        this.messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
    }
    
    addBotMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot-message';
        messageDiv.innerHTML = '<div class="message-avatar"><i class="fas fa-user-tie"></i></div><div class="message-content"><p>' + message + '</p><span class="message-time">' + new Date().toLocaleTimeString() + '</span></div>';
        this.messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
    }
    
    processMessage(message) {
        const lowerMessage = message.toLowerCase();
        let response = '';
        
        if (lowerMessage.includes('bonjour') || lowerMessage.includes('salut') || lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
            response = this.responses.greeting[0];
        } else if (lowerMessage.includes('service') || lowerMessage.includes('services')) {
            response = this.responses.services[0];
        } else if (lowerMessage.includes('prix') || lowerMessage.includes('tarif') || lowerMessage.includes('price') || lowerMessage.includes('cost')) {
            response = this.responses.pricing[0];
        } else if (lowerMessage.includes('contact') || lowerMessage.includes('adresse') || lowerMessage.includes('téléphone')) {
            response = this.responses.contact[0];
        } else if (lowerMessage.includes('tva') || lowerMessage.includes('impôt') || lowerMessage.includes('tax') || lowerMessage.includes('calcul') || lowerMessage.includes('revenu') || lowerMessage.includes('salaire')) {
            response = this.responses.tax_calculator[0];
        } else if (this.isNumeric(message)) {
            // If message is a number, treat it as monthly income for TVA calculation
            const income = parseFloat(message);
            response = this.calculateTunisianTax(income);
        } else {
            response = this.responses.default[0];
        }
        
        this.addBotMessage(response);
    }
    
    isNumeric(str) {
        return !isNaN(str) && !isNaN(parseFloat(str));
    }
    
    calculateTunisianTax(monthlyIncome) {
        if (!monthlyIncome || monthlyIncome <= 0) {
            return "Veuillez entrer un revenu mensuel valide en dinars tunisiens.";
        }
        
        // Calculate 19% TVA
        const tvaRate = 0.19; // 19%
        const tvaAmount = monthlyIncome * tvaRate;
        const netIncome = monthlyIncome - tvaAmount;
        
        return `💰 Calcul TVA pour ${monthlyIncome.toLocaleString()} DT ce mois:\n\n` +
               `📊 Revenu mensuel: ${monthlyIncome.toLocaleString()} DT\n` +
               `🧾 TVA à 19%: ${tvaAmount.toLocaleString()} DT\n` +
               `💵 Revenu net: ${netIncome.toLocaleString()} DT\n\n` +
               `📈 Revenu annuel estimé: ${(monthlyIncome * 12).toLocaleString()} DT\n` +
               `📈 TVA annuelle estimée: ${(tvaAmount * 12).toLocaleString()} DT\n\n` +
               `💡 Pour une consultation détaillée, contactez-nous au 20 448 160.`;
    }
    
    scrollToBottom() {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
}

// Initialize chatbot
new ProfessionalChatbot();

// Animated counter for hero stats
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
                // Add + or % symbols
                if (target === 1500) {
                    counter.textContent = target + '+';
                } else if (target === 20) {
                    counter.textContent = target + '+';
                } else if (target === 99) {
                    counter.textContent = target + '%';
                }
            }
        };
        
        updateCounter();
    });
}

// Start animation when page loads
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(animateCounters, 1000); // Start after 1 second delay
    
    // Services carousel event listeners
    const nextBtn = document.getElementById('nextService');
    const prevBtn = document.getElementById('prevService');
    const dots = document.querySelectorAll('.dot');
    
    if (nextBtn) nextBtn.addEventListener('click', nextServiceSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevServiceSlide);
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentServiceSlide = index;
            showServiceSlide(currentServiceSlide);
        });
    });
    
    // Auto-rotate carousel every 5 seconds
    setInterval(nextServiceSlide, 5000);
});

// Services Carousel
let currentServiceSlide = 0;
const totalServiceSlides = 3;

function showServiceSlide(slideIndex) {
    const slides = document.querySelectorAll('.services-slide');
    const dots = document.querySelectorAll('.dot');
    
    // Remove active class from all slides and dots
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    // Add active class to current slide and dot
    slides[slideIndex].classList.add('active');
    dots[slideIndex].classList.add('active');
}

function nextServiceSlide() {
    currentServiceSlide = (currentServiceSlide + 1) % totalServiceSlides;
    showServiceSlide(currentServiceSlide);
}

function prevServiceSlide() {
    currentServiceSlide = (currentServiceSlide - 1 + totalServiceSlides) % totalServiceSlides;
    showServiceSlide(currentServiceSlide);
}


// Add CSS animations
const style = document.createElement('style');
style.textContent = '@keyframes ripple { to { transform: scale(4); opacity: 0; } } .btn { position: relative; overflow: hidden; } .success-message, .error-message { display: flex; align-items: center; gap: 10px; padding: 15px; border-radius: 8px; margin-top: 20px; font-weight: 500; } .success-message { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; } .error-message { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; } .header { background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px); box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1); position: fixed; top: 0; width: 100%; z-index: 1000; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); } .header.scrolled { background: rgba(255, 255, 255, 0.98); box-shadow: 0 4px 30px rgba(0, 0, 0, 0.15); } .nav-link { position: relative; transition: all 0.3s ease; } .nav-link::before { content: ""; position: absolute; bottom: -5px; left: 0; width: 0; height: 2px; background: linear-gradient(135deg, #2c5aa0 0%, #ff6b35 100%); transition: width 0.3s ease; } .nav-link:hover::before { width: 100%; } .nav-link:hover { color: #2c5aa0; transform: translateY(-2px); } .hamburger.active .bar:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); } .hamburger.active .bar:nth-child(2) { opacity: 0; } .hamburger.active .bar:nth-child(3) { transform: rotate(-45deg) translate(7px, -6px); }';
document.head.appendChild(style);
