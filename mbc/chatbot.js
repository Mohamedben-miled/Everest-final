/**
 * MBC Expert Comptable - Intelligent Chatbot
 * Small LLM that knows about the website and can interact with people
 */

// ========================================
// 1. WEBSITE KNOWLEDGE BASE
// ========================================

const websiteKnowledge = {
    // Company Information
    company: {
        name: "MBC Expert Comptable",
        description: "Cabinet d'expertise comptable spécialisé dans l'accompagnement des entreprises et des entrepreneurs",
        services: [
            "Expertise comptable complète",
            "Fiscalité et optimisation fiscale", 
            "Social & Paie",
            "Conseil en gestion",
            "Création d'entreprise",
            "Formalités juridiques"
        ],
        contact: {
            phone: "01 23 45 67 89",
            email: "contact@mbc-expert.fr",
            address: "123 Avenue des Experts, 75001 Paris"
        }
    },
    
    // Services Details
    services: {
        "expertise comptable": {
            description: "Tenue de comptabilité, établissement des comptes annuels, déclarations fiscales",
            price: "À partir de 150€/mois",
            features: ["Comptabilité générale", "Déclarations TVA", "Bilan et compte de résultat", "Liasse fiscale"]
        },
        "fiscalité": {
            description: "Optimisation fiscale, conseils en matière d'impôts, déclarations",
            price: "Sur devis",
            features: ["Optimisation fiscale", "Déclarations d'impôts", "Conseil fiscal", "Contrôles fiscaux"]
        },
        "social paie": {
            description: "Gestion de la paie, déclarations sociales, conseil RH",
            price: "À partir de 50€/mois",
            features: ["Bulletins de paie", "Déclarations URSSAF", "Convention collective", "Conseil RH"]
        },
        "création entreprise": {
            description: "Accompagnement dans la création d'entreprise (SARL, SAS, auto-entrepreneur)",
            price: "À partir de 200€",
            features: ["Choix du statut", "Formalités de création", "Statuts", "Immatriculation"]
        }
    },
    
    // Simulators Information
    simulators: [
        {
            name: "Calculateur de TVA",
            description: "Calcul automatique de la TVA sur vos montants HT et TTC",
            features: ["Taux de TVA personnalisables", "Calcul en temps réel", "Export PDF"]
        },
        {
            name: "Simulateur de charges sociales",
            description: "Estimation des charges sociales selon votre statut",
            features: ["Salarié, micro-entreprise, SARL, SAS", "Calcul automatique", "Comparaison des statuts"]
        },
        {
            name: "Simulateur d'épargne & retraite",
            description: "Simulation PER et autres produits d'épargne",
            features: ["PER individuel et collectif", "Calcul des impôts", "Optimisation fiscale"]
        },
        {
            name: "Simulateur d'aides",
            description: "Estimation des aides auxquelles vous avez droit",
            features: ["Aides au logement", "Aides à l'emploi", "Aides à la création"]
        }
    ],
    
    // Common Questions and Answers
    faq: {
        "tarifs": "Nos tarifs varient selon vos besoins. Expertise comptable à partir de 150€/mois, social & paie à partir de 50€/mois. Demandez un devis personnalisé gratuit !",
        "devis": "Pour obtenir un devis personnalisé, contactez-nous au 01 23 45 67 89 ou par email à contact@mbc-expert.fr. C'est gratuit et sans engagement !",
        "création": "Nous accompagnons la création d'entreprise (SARL, SAS, auto-entrepreneur) à partir de 200€. Nous vous conseillons sur le meilleur statut pour votre projet.",
        "simulateurs": "Nous proposons 4 simulateurs gratuits : TVA, charges sociales, épargne & retraite, et aides. Accédez-y via le menu 'Simulateurs' !",
        "contact": "Contactez-nous au 01 23 45 67 89, par email à contact@mbc-expert.fr, ou venez nous voir au 123 Avenue des Experts, 75001 Paris."
    }
};

// ========================================
// 2. CHATBOT FUNCTIONS
// ========================================

/**
 * Get intelligent response based on user message
 */
function getChatbotResponse(message) {
    const lowerMessage = message.toLowerCase().trim();
    
    // Greetings
    if (lowerMessage.includes('bonjour') || lowerMessage.includes('salut') || lowerMessage.includes('hello')) {
        return `Bonjour ! Je suis l'assistant virtuel de ${websiteKnowledge.company.name}. Je peux vous aider avec nos services, tarifs, simulateurs ou toute question comptable. Que puis-je faire pour vous ?`;
    }
    
    // Services questions
    if (lowerMessage.includes('service') || lowerMessage.includes('prestation')) {
        return `Nous proposons plusieurs services :\n\n` +
               `📊 **Expertise comptable** - ${websiteKnowledge.services['expertise comptable'].description}\n` +
               `💰 **Fiscalité** - ${websiteKnowledge.services.fiscalité.description}\n` +
               `👥 **Social & Paie** - ${websiteKnowledge.services['social paie'].description}\n` +
               `🏢 **Création d'entreprise** - ${websiteKnowledge.services['création entreprise'].description}\n\n` +
               `Voulez-vous plus de détails sur un service particulier ?`;
    }
    
    // Pricing questions
    if (lowerMessage.includes('prix') || lowerMessage.includes('tarif') || lowerMessage.includes('coût') || lowerMessage.includes('combien')) {
        return websiteKnowledge.faq.tarifs;
    }
    
    // Quote request
    if (lowerMessage.includes('devis') || lowerMessage.includes('estimation')) {
        return websiteKnowledge.faq.devis;
    }
    
    // Company creation
    if (lowerMessage.includes('créer') || lowerMessage.includes('entreprise') || lowerMessage.includes('sarl') || lowerMessage.includes('sas')) {
        return websiteKnowledge.faq.création;
    }
    
    // Simulators
    if (lowerMessage.includes('simulateur') || lowerMessage.includes('calcul') || lowerMessage.includes('tva') || lowerMessage.includes('charge')) {
        return websiteKnowledge.faq.simulateurs;
    }
    
    // Contact
    if (lowerMessage.includes('contact') || lowerMessage.includes('téléphone') || lowerMessage.includes('email') || lowerMessage.includes('adresse')) {
        return websiteKnowledge.faq.contact;
    }
    
    // Specific service details
    for (const [serviceKey, serviceData] of Object.entries(websiteKnowledge.services)) {
        if (lowerMessage.includes(serviceKey)) {
            return `**${serviceKey.charAt(0).toUpperCase() + serviceKey.slice(1)}**\n\n` +
                   `${serviceData.description}\n\n` +
                   `**Tarif :** ${serviceData.price}\n\n` +
                   `**Inclus :**\n${serviceData.features.map(f => `• ${f}`).join('\n')}\n\n` +
                   `Voulez-vous un devis personnalisé ?`;
        }
    }
    
    // Help
    if (lowerMessage.includes('aide') || lowerMessage.includes('help') || lowerMessage.includes('?')) {
        return `Je peux vous aider avec :\n\n` +
               `🏢 **Création d'entreprise** - SARL, SAS, auto-entrepreneur\n` +
               `📊 **Services comptables** - Expertise, fiscalité, social & paie\n` +
               `💰 **Tarifs et devis** - Estimation personnalisée\n` +
               `🛠️ **Simulateurs** - 4 outils de calcul gratuits\n` +
               `📞 **Contact** - Téléphone, email, adresse\n\n` +
               `Que souhaitez-vous savoir ?`;
    }
    
    // Default response
    return `Je comprends que vous cherchez des informations. Je peux vous aider avec :\n\n` +
           `🏢 **Création d'entreprise** - SARL, SAS, auto-entrepreneur\n` +
           `📊 **Services comptables** - Expertise, fiscalité, social & paie\n` +
           `💰 **Tarifs** - Devis personnalisé gratuit\n` +
           `🛠️ **Simulateurs** - 4 outils de calcul gratuits\n` +
           `📞 **Contact** - 01 23 45 67 89\n\n` +
           `Pouvez-vous être plus spécifique sur ce qui vous intéresse ?`;
}

/**
 * Initialize chatbot functionality
 */
function initializeChatbot() {
    // Add chatbot HTML if it doesn't exist
    if (!document.getElementById('mbc-chatbot')) {
        const chatbotHTML = `
            <div id="mbc-chatbot" class="mbc-chatbot">
                <div class="chatbot-toggle" onclick="toggleChatbot()">
                    <i class="fas fa-comments"></i>
                    <span>Assistant</span>
                </div>
                <div class="chatbot-window" id="chatbotWindow">
                    <div class="chatbot-header">
                        <div class="chatbot-title">
                            <i class="fas fa-robot"></i>
                            <span>Assistant MBC</span>
                        </div>
                        <button class="chatbot-close" onclick="toggleChatbot()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="chatbot-messages" id="chatbotMessages">
                        <div class="message bot-message">
                            <div class="message-content">
                                Bonjour ! Je suis l'assistant virtuel de MBC Expert Comptable. Comment puis-je vous aider aujourd'hui ?
                            </div>
                        </div>
                    </div>
                    <div class="chatbot-input">
                        <input type="text" id="chatbotInput" placeholder="Tapez votre message..." onkeypress="handleChatbotKeypress(event)">
                        <button onclick="sendChatbotMessage()">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    }
}

/**
 * Toggle chatbot visibility
 */
function toggleChatbot() {
    const chatbot = document.getElementById('mbc-chatbot');
    const window = document.getElementById('chatbotWindow');
    
    if (chatbot.classList.contains('active')) {
        chatbot.classList.remove('active');
        window.style.display = 'none';
    } else {
        chatbot.classList.add('active');
        window.style.display = 'flex';
        document.getElementById('chatbotInput').focus();
    }
}

/**
 * Send chatbot message
 */
function sendChatbotMessage() {
    const input = document.getElementById('chatbotInput');
    const message = input.value.trim();
    
    if (message) {
        // Add user message
        addChatbotMessage(message, 'user');
        input.value = '';
        
        // Simulate typing delay
        setTimeout(() => {
            const response = getChatbotResponse(message);
            addChatbotMessage(response, 'bot');
        }, 1000);
    }
}

/**
 * Add message to chatbot
 */
function addChatbotMessage(text, sender) {
    const messagesContainer = document.getElementById('chatbotMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.innerHTML = text.replace(/\n/g, '<br>');
    
    messageDiv.appendChild(contentDiv);
    messagesContainer.appendChild(messageDiv);
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

/**
 * Handle Enter key in chatbot input
 */
function handleChatbotKeypress(event) {
    if (event.key === 'Enter') {
        sendChatbotMessage();
    }
}

// ========================================
// 3. INITIALIZATION
// ========================================

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeChatbot();
});

