// Datos del juego (copiados del código Python)
const IAs = {
    "chatgpt": {
        "aliases": new Set(["chatgpt", "gpt", "openai chatgpt"]),
        "pistas": [
            "Soy un modelo conversacional creado por OpenAI que puede dialogar sobre muchos temas.",
            "Puedo redactar textos, explicar conceptos, escribir código y ayudar a estudiar.",
            "Pertenezco a la familia GPT. ¿Quién soy?"
        ],
        "feedback": " 🎉 ¡Correcto! ChatGPT\n\n FEEDBACK: Funciones básicas:\n1) Generación de texto y conversación natural.\n2) Explicación de conceptos y tutoría.\n3) Asistencia en redacción y creatividad.\n4) Ayuda con código y depuración.\n"
    },
    "gemini": {
        "aliases": new Set(["gemini", "google gemini", "bard", "google bard"]),
        "pistas": [
            "Soy un asistente de Google que se integra con su ecosistema.",
            "Trabajo con información multimodal (texto, imágenes…)",
            "Antes se me conocía como Bard. ¿Quién soy?"
        ],
        "feedback": "🌟 ¡Bien! Gemini\n\n FEEDBACK: Funciones básicas:\n1) Respuestas contextuales y creativas.\n2) Soporte multimodal (p. ej., texto e imagen).\n3) Integración con productos de Google.\n4) Búsqueda y razonamiento asistido.\n"
    },
    "perplexity": {
        "aliases": new Set(["perplexity", "perplexity ai"]),
        "pistas": [
            "Me enfoco en respuestas con citas y fuentes verificables.",
            "Soy un buscador impulsado por IA con transparencia.",
            "Soy conocido por mostrar referencias en cada respuesta. ¿Quién soy?"
        ],
        "feedback": "🧠 ¡Exacto! Perplexity\n\nFEEDBACK: Funciones básicas:\n1) Respuestas con citas y referencias.\n2) Búsqueda en la web en tiempo real.\n3) Síntesis precisa y verificable.\n4) Conversación enfocada en fuentes.\n"
    },
    "claude": {
        "aliases": new Set(["claude", "caude", "claud", "anthropic claude"]),
        "pistas": [
            "Fui creado por Anthropic, con foco en seguridad y ética.",
            "Mi nombre rinde homenaje a Claude Shannon.",
            "Se me reconoce por respuestas cuidadosas y claras. ¿Quién soy?"
        ],
        "feedback": "🌈 ¡Muy bien! Claude\n\n FEEDBACK: Funciones básicas:\n1) Conversación clara y útil.\n2) Enfoque en seguridad y alineamiento.\n3) Apoyo en escritura y análisis.\n4) Razonamiento y resumen de información.\n"
    }
};

const POSIBLES = ["ChatGPT", "Gemini", "Perplexity", "Claude"];

// Utilidades
function normaliza(txt) {
    return txt.trim().toLowerCase();
}

function es_acierto(entrada, clave) {
    const e = normaliza(entrada);
    const aliases = IAs[clave]["aliases"];
    return aliases.has(e);
}

function envoltorio(txt, ancho = 88) {
    const palabras = txt.split(' ');
    const lineas = [];
    let lineaActual = '';
    
    palabras.forEach(palabra => {
        if ((lineaActual + palabra).length <= ancho) {
            lineaActual += (lineaActual ? ' ' : '') + palabra;
        } else {
            if (lineaActual) lineas.push(lineaActual);
            lineaActual = palabra;
        }
    });
    if (lineaActual) lineas.push(lineaActual);
    
    return lineas.join('\n');
}

// Estado del juego
let claves = [];
let indiceActual = 0;
let puntos = 0;
let acertadas = [];
let pistaActual = 0;
let iaActual = null;
let pistasIaActual = [];
let juegoCompletado = false;

// Elementos del DOM
const respuestaInput = document.getElementById('respuesta-input');
const btnVerificar = document.getElementById('btn-verificar');
const btnOpciones = document.getElementById('btn-opciones');
const btnNuevoJuego = document.getElementById('btn-nuevo-juego');
const btnSalir = document.getElementById('btn-salir');
const pistasContainer = document.getElementById('pistas-container');
const feedbackContainer = document.getElementById('feedback-container');
const iaNumero = document.getElementById('ia-numero');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');
const modalOpciones = document.getElementById('modal-opciones');
const modalResultados = document.getElementById('modal-resultados');
const opcionesLista = document.getElementById('opciones-lista');
const resultadosFinales = document.getElementById('resultados-finales');

// Inicializar juego
function iniciarJuego() {
    // Mezclar las IAs aleatoriamente
    claves = Object.keys(IAs);
    for (let i = claves.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [claves[i], claves[j]] = [claves[j], claves[i]];
    }
    
    indiceActual = 0;
    puntos = 0;
    acertadas = [];
    juegoCompletado = false;
    
    // Limpiar contenedores
    pistasContainer.innerHTML = '';
    feedbackContainer.innerHTML = '';
    
    // Mostrar/ocultar botones
    btnNuevoJuego.style.display = 'none';
    btnVerificar.disabled = false;
    respuestaInput.disabled = false;
    
    cargarSiguienteIA();
}

function cargarSiguienteIA() {
    if (indiceActual >= claves.length) {
        mostrarResultadosFinales();
        return;
    }
    
    iaActual = claves[indiceActual];
    pistasIaActual = IAs[iaActual]["pistas"];
    pistaActual = 0;
    
    const nombreMostrable = iaActual === "chatgpt" ? "ChatGPT" : iaActual.charAt(0).toUpperCase() + iaActual.slice(1);
    iaNumero.textContent = `IAS adivinadas: ${indiceActual + 1} de ${claves.length} - Vamos a a ganar el juego!`;
    
    mostrarSiguientePista();
    actualizarProgreso();
}

function mostrarSiguientePista() {
    if (pistaActual >= pistasIaActual.length) {
        // No se adivinó con ninguna pista
        const nombreMostrable = iaActual === "chatgpt" ? "ChatGPT" : iaActual.charAt(0).toUpperCase() + iaActual.slice(1);
        const feedback = IAs[iaActual]["feedback"];
        agregarFeedback(`❌ No adivinaste. La respuesta correcta era: ${nombreMostrable}\n\n${envoltorio(feedback)}\n`, 'incorrecto');
        setTimeout(() => {
            siguienteIA();
        }, 10000);
        return;
    }
    
    const pista = pistasIaActual[pistaActual];
    pistasContainer.innerHTML = `<div class="pista-item"><strong>Pista ${pistaActual + 1}:</strong> ${pista}</div>`;
    
    respuestaInput.value = '';
    respuestaInput.focus();
    feedbackContainer.innerHTML = '';
}

function verificarRespuesta() {
    if (juegoCompletado) return;
    
    const entrada = respuestaInput.value.trim();
    
    if (!entrada) {
        alert('Por favor ingresa una respuesta.');
        return;
    }
    
    const e = normaliza(entrada);
    
    if (e === 'salir') {
        if (confirm('¿Estás seguro de que quieres salir del juego?')) {
            window.close();
        }
        return;
    }
    
    if (e === 'opciones') {
        mostrarOpciones();
        return;
    }
    
    if (es_acierto(entrada, iaActual)) {
        // ¡Correcto!
        puntos++;
        const nombreMostrable = iaActual === "chatgpt" ? "ChatGPT" : iaActual.charAt(0).toUpperCase() + iaActual.slice(1);
        acertadas.push(nombreMostrable);
        
        const feedback = IAs[iaActual]["feedback"];
        agregarFeedback(`✅ ¡Correcto!\n\n${envoltorio(feedback)}\n`, 'correcto');
        
        // Esperar un momento antes de continuar
        setTimeout(() => {
            siguienteIA();
        }, 7000);
    } else {
        // Incorrecto
        agregarFeedback('❌ Incorrecto.  ¡Vamos no te rindas! Intenta de nuevo.\n', 'incorrecto');
        pistaActual++;
        setTimeout(() => {
            mostrarSiguientePista();
        }, 3000);
    }
}

function siguienteIA() {
    indiceActual++;
    cargarSiguienteIA();
}

function mostrarOpciones() {
    opcionesLista.innerHTML = '';
    POSIBLES.forEach(opcion => {
        const li = document.createElement('li');
        li.textContent = opcion;
        opcionesLista.appendChild(li);
    });
    modalOpciones.style.display = 'block';
}

function agregarFeedback(texto, tipo = 'info') {
    const div = document.createElement('div');
    div.className = `feedback-item feedback-${tipo}`;
    div.textContent = texto;
    feedbackContainer.appendChild(div);
    feedbackContainer.scrollTop = feedbackContainer.scrollHeight;
}

function actualizarProgreso() {
    const porcentaje = (indiceActual / claves.length) * 100;
    progressBar.style.width = porcentaje + '%';
    progressText.textContent = `Progreso: ${indiceActual}/${claves.length} IAs completadas`;
}

function mostrarResultadosFinales() {
    juegoCompletado = true;
    
    pistasContainer.innerHTML = '<div class="pista-item"><strong>=== JUEGO COMPLETADO ===</strong></div>';
    
    respuestaInput.disabled = true;
    btnVerificar.disabled = true;
    btnNuevoJuego.style.display = 'inline-block';
    
    let resultados = '=== RESULTADOS ===\n\n';
    resultados += `Puntuación: ${puntos} / ${Object.keys(IAs).length}\n\n`;
    
    if (acertadas.length > 0) {
        resultados += `Adivinadas: ${acertadas.join(', ')}\n\n`;
    } else {
        resultados += 'No acertaste ninguna.\n\n';
    }
    
    resultados += 'Gracias por jugar. 🎉';
    
    agregarFeedback(resultados, 'info');
    progressBar.style.width = '100%';
    progressText.textContent = `Progreso: ${claves.length}/${claves.length} IAs completadas`;
    
    // Mostrar modal de resultados
    resultadosFinales.innerHTML = resultados.replace(/\n/g, '<br>');
    modalResultados.style.display = 'block';
}

// Event listeners
btnVerificar.addEventListener('click', verificarRespuesta);
btnOpciones.addEventListener('click', mostrarOpciones);
btnNuevoJuego.addEventListener('click', () => {
    iniciarJuego();
});
btnSalir.addEventListener('click', () => {
    if (confirm('¿Estás seguro de que quieres salir del juego?')) {
        window.close();
    }
});

respuestaInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        verificarRespuesta();
    }
});

// Cerrar modales
document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
        modalOpciones.style.display = 'none';
        modalResultados.style.display = 'none';
    });
});

window.addEventListener('click', (e) => {
    if (e.target === modalOpciones) {
        modalOpciones.style.display = 'none';
    }
    if (e.target === modalResultados) {
        modalResultados.style.display = 'none';
    }
});

// Iniciar el juego al cargar la página
window.addEventListener('DOMContentLoaded', () => {
    iniciarJuego();
});

