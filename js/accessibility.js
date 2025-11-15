// Funcionalidad de accesibilidad
document.addEventListener('DOMContentLoaded', function() {
    // Botones de tamaño de fuente
    const increaseFontBtn = document.getElementById('increaseFontSize');
    const decreaseFontBtn = document.getElementById('decreaseFontSize');
    const resetFontBtn = document.getElementById('resetFontSize');
    const toggleHighContrastBtn = document.getElementById('toggleHighContrast');
    const toggleVoiceReaderBtn = document.getElementById('toggleVoiceReader');

    // Función para aplicar tamaño de fuente a todos los elementos
    const applyFontSize = (size) => {
        document.documentElement.style.setProperty('--font-size-base', size + 'px');
        document.body.style.fontSize = size + 'px';
        // Aplicar también a elementos principales
        const mainElements = document.querySelectorAll('main, .container, section, article');
        mainElements.forEach(el => {
            el.style.fontSize = size + 'px';
        });
    };

    // Init font size from localStorage
    const storedSize = parseInt(localStorage.getItem('mc_fontSize') || '16', 10);
    let currentFontSize = storedSize;
    
    // Apply stored size to root element and body
    applyFontSize(currentFontSize);

    // Handlers (guard checks in case buttons are not present on a page)
    if (increaseFontBtn) {
        increaseFontBtn.addEventListener('click', function() {
            if (currentFontSize < 30) {
                currentFontSize += 2;
                applyFontSize(currentFontSize);
                localStorage.setItem('mc_fontSize', currentFontSize);
            }
        });
    }

    if (decreaseFontBtn) {
        decreaseFontBtn.addEventListener('click', function() {
            if (currentFontSize > 10) {
                currentFontSize -= 2;
                applyFontSize(currentFontSize);
                localStorage.setItem('mc_fontSize', currentFontSize);
            }
        });
    }

    if (resetFontBtn) {
        resetFontBtn.addEventListener('click', function() {
            currentFontSize = 16;
            document.documentElement.style.setProperty('--font-size-base', '16px');
            document.body.style.fontSize = '';
            // Resetear también los elementos principales
            const mainElements = document.querySelectorAll('main, .container, section, article');
            mainElements.forEach(el => {
                el.style.fontSize = '';
            });
            localStorage.removeItem('mc_fontSize');
        });
    }

    // Alternar alto contraste (persistir)
    if (toggleHighContrastBtn) {
        // apply stored preference
        const hc = localStorage.getItem('mc_highContrast');
        if (hc === '1') document.body.classList.add('high-contrast');

        toggleHighContrastBtn.addEventListener('click', function() {
            const enabled = document.body.classList.toggle('high-contrast');
            localStorage.setItem('mc_highContrast', enabled ? '1' : '0');
        });
    }

    // Lector de voz
    let speechSynthesis = window.speechSynthesis;
    let speaking = false;
    if (toggleVoiceReaderBtn) {
        toggleVoiceReaderBtn.addEventListener('click', function() {
            if (!speaking) {
                speaking = true;
                // Selecciona todo el contenido de texto visible
                const textToRead = document.body.innerText;
                const utterance = new SpeechSynthesisUtterance(textToRead);
                utterance.lang = 'es-ES'; // Establece el idioma a español
                utterance.onend = function() {
                    speaking = false;
                };
                speechSynthesis.speak(utterance);
            } else {
                speaking = false;
                speechSynthesis.cancel();
            }
        });
    }

    // Añadir descripciones ARIA a elementos interactivos si faltan
    const addAriaDescriptions = () => {
        const buttons = document.querySelectorAll('button');
        const links = document.querySelectorAll('a');

        buttons.forEach(button => {
            if (!button.getAttribute('aria-label')) {
                const txt = button.textContent.trim();
                if (txt) button.setAttribute('aria-label', txt);
            }
        });

        links.forEach(link => {
            if (!link.getAttribute('aria-label')) {
                const txt = link.textContent.trim();
                if (txt) link.setAttribute('aria-label', txt);
            }
        });
    };

    addAriaDescriptions();
});