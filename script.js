// Gestion de la modal d'accueil
document.addEventListener('DOMContentLoaded', function() {
    const welcomeModal = document.getElementById('welcomeModal');
    const closeBtn = document.getElementById('closeModal');
    const voirInvitationBtn = document.getElementById('voirInvitation');
    
    // Fermer la modal en cliquant sur la croix
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            welcomeModal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        });
    }

    // Fermer la modal en cliquant sur "Voir l'invitation"
    if (voirInvitationBtn) {
        voirInvitationBtn.addEventListener('click', function() {
            welcomeModal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        });
    }
    
    // Fermer la modal en cliquant en dehors
    welcomeModal.addEventListener('click', function(e) {
        if (e.target === welcomeModal) {
            welcomeModal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
    });
    
    // Fermer la modal avec la touche Échap
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !welcomeModal.classList.contains('hidden')) {
            welcomeModal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
    });
    
    // Empêcher le scroll du body quand la modal est ouverte
    document.body.style.overflow = 'hidden';
});

// Date cible pour le compteur (22 octobre 2025 à 16h00)
const targetDate = new Date('2025-10-22T16:00:00').getTime();

// Fonction pour mettre à jour le compteur
function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    // Calculs pour les jours, heures, minutes et secondes
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Mise à jour des éléments HTML
    document.getElementById('days').textContent = days.toString().padStart(2, '0');
    document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
    document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');

    // Si le compte à rebours est terminé
    if (distance < 0) {
        document.getElementById('days').textContent = '00';
        document.getElementById('hours').textContent = '00';
        document.getElementById('minutes').textContent = '00';
        document.getElementById('seconds').textContent = '00';
    }
}

// Mise à jour du compteur toutes les secondes
setInterval(updateCountdown, 1000);
updateCountdown(); // Appel initial

// Gestion du formulaire de présence
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.presence-form');
    
    if (form) {
        // Gestion de l'affichage des champs nombre de personnes
        const radioGroups = form.querySelectorAll('.radio-group');
        
        radioGroups.forEach(group => {
            const radios = group.querySelectorAll('input[type="radio"]');
            const eventName = group.closest('.form-group').querySelector('label').textContent.toLowerCase();
            
            radios.forEach(radio => {
                radio.addEventListener('change', function() {
                    const numberGroup = group.parentElement.querySelector('.number-group');
                    if (this.value === 'oui') {
                        numberGroup.style.display = 'block';
                    } else {
                        numberGroup.style.display = 'none';
                        numberGroup.querySelector('input[type="number"]').value = '';
                    }
                });
            });
        });
        
        // Gestion de la soumission du formulaire
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Récupération des données du formulaire
            const formData = new FormData(form);
            const responseData = {
                name: formData.get('name'),
                mairie: formData.get('mairie'),
                mairieCount: formData.get('mairie-count'),
                henne: formData.get('henne'),
                henneCount: formData.get('henne-count'),
                houppa: formData.get('houppa'),
                houppaCount: formData.get('houppa-count')
            };
            
            console.log('Données de présence:', responseData);
            
            // Préparation du message SMS
            let smsMessage = `Nouvelle confirmation de présence:\n`;
            smsMessage += `De: ${responseData.name}\n`;
            smsMessage += `Mairie: ${responseData.mairie}${responseData.mairie === 'oui' ? ` (${responseData.mairieCount} pers.)` : ''}\n`;
            smsMessage += `Henné: ${responseData.henne}${responseData.henne === 'oui' ? ` (${responseData.henneCount} pers.)` : ''}\n`;
            smsMessage += `Houppa: ${responseData.houppa}${responseData.houppa === 'oui' ? ` (${responseData.houppaCount} pers.)` : ''}`;
            
            // Proposer l'envoi à Ilana ou Harrisson
            const choix = window.prompt('Envoyer la réponse à:\n1) Ilana\n2) Harisson\n(Entrez 1 ou 2)', '1');
            let targetNumber = null;
            if (choix === '1') {
                targetNumber = '+33646596320'; // Ilana
            } else if (choix === '2') {
                targetNumber = '+33629203590'; // Harisson
            }
            
            if (targetNumber) {
                sendSMS(targetNumber, smsMessage);
            } else {
                alert('Aucun destinataire sélectionné. Envoi annulé.');
            }
            
            // Affichage d'un message de confirmation
            alert('Merci pour votre confirmation de présence !');
            form.reset();
            
            // Masquer les champs nombre de personnes
            const numberGroups = form.querySelectorAll('.number-group');
            numberGroups.forEach(group => {
                group.style.display = 'none';
            });
        });
    }
});

// Gestion des boutons d'itinéraire
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.btn-itineraire');
    
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const location = this.closest('.content-box').querySelector('.location, .address');
            if (location) {
                const address = location.textContent;
                const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
                window.open(googleMapsUrl, '_blank');
            }
        });
    });
});

// Animation au scroll
document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('.section');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(section);
    });
});

// Navigation fluide
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Ajustement pour la navbar fixe
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Effet de parallaxe pour le hero
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    
    if (hero) {
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// Gestion du responsive pour la navigation
document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scroll vers le bas
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scroll vers le haut
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
});

// Validation du formulaire
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.response-form');
    
    if (form) {
        const nameInput = form.querySelector('#name');
        const radioGroups = form.querySelectorAll('.radio-group');
        
        // Validation du nom
        nameInput.addEventListener('blur', function() {
            if (this.value.trim() === '') {
                this.style.borderColor = '#e74c3c';
                this.setCustomValidity('Veuillez saisir votre nom');
            } else {
                this.style.borderColor = '#d4af37';
                this.setCustomValidity('');
            }
        });
        
        // Validation des groupes radio
        radioGroups.forEach(group => {
            const radios = group.querySelectorAll('input[type="radio"]');
            const question = group.previousElementSibling;
            
            radios.forEach(radio => {
                radio.addEventListener('change', function() {
                    question.style.color = '#333';
                    group.style.borderColor = '#d4af37';
                });
            });
        });
    }
});

// Effet de hover pour les cartes
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.content-box, .contact-person');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '';
        });
    });
}); 

// Fonction pour envoyer SMS (utilise WhatsApp Web API)
function sendSMS(phoneNumber, message) {
    // Utilisation de WhatsApp Web API
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    // Ouvrir WhatsApp Web dans un nouvel onglet
    window.open(whatsappUrl, '_blank');
    
    // Alternative : copier le message dans le presse-papiers
    navigator.clipboard.writeText(message).then(function() {
        console.log('Message copié dans le presse-papiers');
    });
} 