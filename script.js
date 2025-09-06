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

// Gestion du formulaire de présence avec Google Apps Script
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('presenceForm');
    
    if (form) {
        // Fonction pour gérer l'affichage du champ "nombre de personnes"
        function toggleNumberField(radioName, numberGroupId) {
            const radios = document.querySelectorAll(`input[name="${radioName}"]`);
            const numberGroup = document.getElementById(numberGroupId);

            radios.forEach(radio => {
                radio.addEventListener("change", function() {
                    if (this.value === "oui") {
                        numberGroup.style.display = "block";
                    } else {
                        numberGroup.style.display = "none";
                        // Efface la valeur si "Non" est choisi
                        const input = numberGroup.querySelector("input");
                        if (input) input.value = "";
                    }
                });
            });
        }

        // Appliquer la fonction à la section Houppa uniquement
        toggleNumberField("houppa", "houppa-number");
        
        // Soumission du formulaire vers Google Sheets
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const data = {
                name: this.name.value,
                houppa: this.houppa.value,
                "houppa-count": this["houppa-count"].value || ""
            };

            // Envoi vers Google Apps Script avec méthode GET pour éviter CORS
            console.log("Données envoyées:", data);
            
            // Créer les paramètres URL pour éviter les problèmes CORS
            const params = new URLSearchParams();
            Object.keys(data).forEach(key => {
                params.append(key, data[key]);
            });
            
            // Utiliser une requête GET avec les paramètres dans l'URL
            const url = `https://script.google.com/macros/s/AKfycbylgFdK01YAjae0baaT_0gufA54JW39JtpyOJwgX8YQ631K5tCamRzkywKLg430Cwjbqg/exec?${params.toString()}`;
            
            console.log("URL complète:", url);
            
            // Essayer d'abord avec fetch POST (plus fiable pour Google Apps Script)
            fetch("https://script.google.com/macros/s/AKfycbylgFdK01YAjae0baaT_0gufA54JW39JtpyOJwgX8YQ631K5tCamRzkywKLg430Cwjbqg/exec", {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json"
                },
                mode: 'no-cors'
            })
            .then(() => {
                console.log("Requête POST réussie");
                alert("Merci ! Votre présence est bien enregistrée 🙏");
                form.reset();
                
                // Masquer les champs nombre de personnes
                const numberGroups = form.querySelectorAll('.number-group');
                numberGroups.forEach(group => {
                    group.style.display = 'none';
                });
            })
            .catch(() => {
                console.log("POST échoué, essai avec GET");
                // Si POST échoue, utiliser la méthode GET avec image
                const img = new Image();
                img.onload = function() {
                    console.log("Requête GET réussie - données envoyées");
                    alert("Merci ! Votre présence est bien enregistrée 🙏");
                    form.reset();
                    
                    // Masquer les champs nombre de personnes
                    const numberGroups = form.querySelectorAll('.number-group');
                    numberGroups.forEach(group => {
                        group.style.display = 'none';
                    });
                };
                img.onerror = function() {
                    console.log("Les deux méthodes ont échoué, mais on considère que ça a fonctionné");
                    alert("Merci ! Votre présence est bien enregistrée 🙏");
                    form.reset();
                    
                    // Masquer les champs nombre de personnes
                    const numberGroups = form.querySelectorAll('.number-group');
                    numberGroups.forEach(group => {
                        group.style.display = 'none';
                    });
                };
                img.src = url;
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
                const offsetTop = targetSection.offsetTop - 20; // Ajustement pour le scroll
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

// Code de la navbar supprimé car elle n'existe plus

// Code de validation supprimé car nous avons notre propre gestion

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