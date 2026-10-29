
/* =========================================
   GUCIA IBOVY | PORTFOLIO INTERACTIONS
========================================= */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
    // 1. MENU MOBILE
    const menuToggle = document.querySelector("#menu-toggle");
    const navLinks = document.querySelector("#nav-links");
    const header = document.querySelector(".header");

    function closeMenu() {
        if (!menuToggle || !navLinks) return;

        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Ouvrir le menu");
        navLinks.classList.remove("open");
    }

    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", () => {
            const isOpen =
                menuToggle.getAttribute("aria-expanded") === "true";

            menuToggle.setAttribute("aria-expanded", String(!isOpen));
            menuToggle.setAttribute(
                "aria-label",
                isOpen ? "Ouvrir le menu" : "Fermer le menu"
            );

            navLinks.classList.toggle("open", !isOpen);
        });

        navLinks.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", closeMenu);
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                closeMenu();
            }
        });

        document.addEventListener("click", (event) => {
            if (
                navLinks.classList.contains("open") &&
                !navLinks.contains(event.target) &&
                !menuToggle.contains(event.target)
            ) {
                closeMenu();
            }
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 760) {
                closeMenu();
            }
        });
    }

    // 2. EFFET DE TEXTE ANIMÉ
    const typewriter = document.querySelector("#typewriter");

    if (typewriter) {
        const words = [
            "le monde de demain.",
            "des solutions innovantes.",
            "des systèmes intelligents.",
            "des idées en réalité."
        ];

        const reducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        if (reducedMotion) {
            typewriter.textContent = words[0];
        } else {
            let wordIndex = 0;
            let characterIndex = words[0].length;
            let deleting = true;

            function animateText() {
                const currentWord = words[wordIndex];

                if (deleting) {
                    characterIndex--;
                    typewriter.textContent =
                        currentWord.substring(0, characterIndex);

                    if (characterIndex <= 0) {
                        deleting = false;
                        wordIndex = (wordIndex + 1) % words.length;
                        setTimeout(animateText, 400);
                        return;
                    }

                    setTimeout(animateText, 35);
                } else {
                    const nextWord = words[wordIndex];
                    characterIndex++;

                    typewriter.textContent =
                        nextWord.substring(0, characterIndex);

                    if (characterIndex >= nextWord.length) {
                        deleting = true;
                        setTimeout(animateText, 1800);
                        return;
                    }

                    setTimeout(animateText, 65);
                }
            }

            setTimeout(animateText, 1800);
        }
    }

    // 3. APPARITION PROGRESSIVE DES SECTIONS
    const revealElements = document.querySelectorAll(".reveal");

    const revealAll = () => {
        revealElements.forEach((element) => {
            element.classList.add("visible");
        });
    };

    const supportsObserver = "IntersectionObserver" in window;
    const shouldReduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!supportsObserver || shouldReduceMotion) {
        revealAll();
    } else {
        const observer = new IntersectionObserver(
            (entries, currentObserver) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        currentObserver.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -35px 0px"
            }
        );

        revealElements.forEach((element) => {
            observer.observe(element);
        });

        // Évite de laisser un élément masqué si le chargement
        // du navigateur ou le défilement pose problème.
        window.addEventListener("load", () => {
            revealElements.forEach((element) => {
                const rect = element.getBoundingClientRect();

                if (
                    rect.top < window.innerHeight &&
                    rect.bottom > 0
                ) {
                    element.classList.add("visible");
                    observer.unobserve(element);
                }
            });
        });
    }

    // 4. STYLE DE LA BARRE DE NAVIGATION AU DÉFILEMENT
    function updateHeader() {
        if (!header) return;

        header.classList.toggle("scrolled", window.scrollY > 20);
    }

    updateHeader();

    window.addEventListener("scroll", updateHeader, {
        passive: true
    });

    // 5. LIEN ACTIF DANS LA NAVIGATION
    const sections = document.querySelectorAll(
        "main section[id]"
    );

    const navigationLinks = document.querySelectorAll(
        '.nav-links a[href^="#"]'
    );

    if ("IntersectionObserver" in window) {
        const sectionObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;

                    const currentId = entry.target.id;

                    navigationLinks.forEach((link) => {
                        const isActive =
                            link.getAttribute("href") === `#${currentId}`;

                        if (isActive) {
                            link.classList.add("active");
                        } else {
                            link.classList.remove("active");
                        }
                    });
                });
            },
            {
                rootMargin: "-30% 0px -60% 0px",
                threshold: 0
            }
        );

        sections.forEach((section) => {
            sectionObserver.observe(section);
        });
    }

    // 6. ANNÉE AUTOMATIQUE DANS LE FOOTER
    const yearElement = document.querySelector("#year");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // 7. PRÉSENTATION VOCALE DU HERO
    const voiceButton = document.querySelector("#poster-voice");
    const voiceStatus = document.querySelector("#voice-status");
    const heroDescription = document.querySelector(".hero-description");
    let activeUtterance = null;

    if (voiceButton && voiceStatus && heroDescription) {
        voiceButton.addEventListener("click", () => {
            if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) {
                voiceStatus.textContent = "La lecture vocale n'est pas prise en charge par ce navigateur.";
                return;
            }

            if (activeUtterance) {
                activeUtterance = null;
                window.speechSynthesis.cancel();
                voiceButton.setAttribute("aria-pressed", "false");
                voiceButton.setAttribute("aria-label", "Écouter ma présentation");
                voiceStatus.textContent = "Lecture arrêtée.";
                return;
            }

            const utterance = new SpeechSynthesisUtterance(
                heroDescription.textContent.trim()
            );
            utterance.lang = "fr-FR";
            utterance.addEventListener("end", () => {
                if (activeUtterance !== utterance) return;

                activeUtterance = null;
                voiceButton.setAttribute("aria-pressed", "false");
                voiceButton.setAttribute("aria-label", "Écouter ma présentation");
                voiceStatus.textContent = "Présentation terminée.";
            });
            utterance.addEventListener("error", () => {
                if (activeUtterance !== utterance) return;

                activeUtterance = null;
                voiceButton.setAttribute("aria-pressed", "false");
                voiceButton.setAttribute("aria-label", "Écouter ma présentation");
                voiceStatus.textContent = "La lecture vocale n'a pas pu démarrer.";
            });

            activeUtterance = utterance;
            voiceButton.setAttribute("aria-pressed", "true");
            voiceButton.setAttribute("aria-label", "Arrêter la présentation");
            voiceStatus.textContent = "Lecture de la présentation.";
            window.speechSynthesis.speak(utterance);
        });
    }

    window.addEventListener("pagehide", () => {
        if (activeUtterance && "speechSynthesis" in window) {
            window.speechSynthesis.cancel();
        }
    });

    // 8. LÉGER EFFET DE PROFONDEUR AU SURVOL
    const poster = document.querySelector(".hero-poster");
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    if (poster && canHover && !shouldReduceMotion) {
        poster.addEventListener("pointermove", (event) => {
            const bounds = poster.getBoundingClientRect();
            const x = (event.clientX - bounds.left) / bounds.width;
            const y = (event.clientY - bounds.top) / bounds.height;
            poster.style.setProperty("--pointer-x", `${x * 100}%`);
            poster.style.setProperty("--pointer-y", `${y * 100}%`);
            poster.style.setProperty("--tilt-x", `${(0.5 - y) * 2}deg`);
            poster.style.setProperty("--tilt-y", `${(x - 0.5) * 2}deg`);
        });

        poster.addEventListener("pointerleave", () => {
            poster.style.setProperty("--pointer-x", "50%");
            poster.style.setProperty("--pointer-y", "50%");
            poster.style.setProperty("--tilt-x", "0deg");
            poster.style.setProperty("--tilt-y", "0deg");
        });
    }

    // 9. MESSAGE DE VÉRIFICATION DANS LA CONSOLE
    console.log(
        "%cGucia Ibovy | Portfolio",
        "color: #67e8f9; font-size: 18px; font-weight: bold;"
    );

    console.log(
        "Bienvenue dans mon espace numérique. Merci de votre visite !"
    );
});
