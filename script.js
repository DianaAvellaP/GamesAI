// Mini-quiz multiple-choice (máx. 5 preguntas)
const PREGUNTAS = [
    
    {
        id: 'traductores',
        question: '¿Cuál es la definición correcta de Inteligencia Artificial (IA)?',
        choices: ['La Inteligencia Artificial es cualquier programa que hace cálculos matemáticos de forma más rápida que una persona', 'La Inteligencia Artificial es la capacidad de las máquinas para realizar tareas que normalmente requieren inteligencia humana, como entender lenguaje, reconocer patrones o tomar decisiones', 'La Inteligencia Artificial es un sistema que funciona siempre perfecto y nunca se equivoca', 'La Inteligencia Artificial es un software que funciona únicamente con reglas fijas y no puede aprender nada nuevo'],
        correct: 1,
        feedback: 'Respuesta: La Inteligencia Artificial es la capacidad de las máquinas para realizar tareas que normalmente requieren inteligencia humana, como entender lenguaje, reconocer patrones o tomar decisiones'
    },
    
    
    
    
    {
        id: 'traductores',
        question: 'Los traductores automáticos (Google Translate, DeepL) que convierten texto entre idiomas son un ejemplo de:',
        choices: ['ANI (IA estrecha)', 'AGI (IA general)', 'ASI (Superinteligencia)', 'No es IA'],
        correct: 0,
        feedback: 'Respuesta: ANI. Son sistemas diseñados para una tarea específica (traducción) y no poseen razonamiento general.'
    },
    {
        id: 'asistentes',
        question: 'Asistentes virtuales como Siri o Alexa que responden preguntas y controlan dispositivos son:',
        choices: ['AGI', 'ASI', 'ANI', 'Software sin IA'],
        correct: 2,
        feedback: 'Respuesta: ANI. Son potentes en tareas concretas (voz, búsquedas) pero no tienen inteligencia general.'
    },
    {
        id: 'recomendacion',
        question: 'Un motor de recomendación (Netflix, Spotify) que sugiere contenido está mejor clasificado como:',
        choices: ['ANI', 'AGI', 'ASI', 'Sistemas expertos clásicos'],
        correct: 0,
        feedback: 'Respuesta: ANI. Optimizado para una función concreta: predecir preferencias.'
    },
    {
        id: 'chatgpt_actuales',
        question: 'Modelos de lenguaje actuales (ej.: ChatGPT) que generan texto y mantienen diálogo son:',
        choices: ['AGI', 'ANI', 'ASI', 'No son IA'],
        correct: 1,
        feedback: 'Respuesta: ANI (en la clasificación común). Son muy capaces en lenguaje, pero siguen siendo sistemas especializados.'
    },
    {
        id: 'agi_descripcion',
        question: '¿Cuál describe mejor una AGI (Inteligencia Artificial General)?',
        choices: ['Un sistema especializado', 'Un sistema con capacidades humanas generales', 'Un asistente de voz', 'Un motor de recomendaciones'],
        correct: 1,
        feedback: 'Respuesta: AGI. Se refiere a sistemas con capacidades comparables a las humanas en múltiples dominios.'
    },
    {
        id: 'asi_descripcion',
        question: 'Una Superinteligencia Artificial (ASI) es:',
        choices: ['Un sistema que supera ampliamente la inteligencia humana', 'Un chatbot de servicio', 'Un clasificador de imágenes simple', 'Un algoritmo de búsqueda'],
        correct: 0,
        feedback: 'Respuesta: ASI. Nivel teórico donde la IA supera ampliamente a los humanos en creatividad, planificación y juicio.'
    },
    {
        id: 'chatbots_servicio',
        question: 'Chatbots de atención al cliente que siguen guiones y responden FAQs son:',
        choices: ['ASI', 'AGI', 'ANI', 'Conciencia artificial'],
        correct: 2,
        feedback: 'Respuesta: ANI. Automatizan interacciones concretas sin razonamiento humano amplio.'
    }
];

const MAX_PREGUNTAS = 5;

// Estado
let pool = [];
let preguntasSeleccionadas = [];
let indice = 0;
let respuestas = []; // { pregunta, selected, correct }
let skipCounts = {}; // contar saltos por pregunta.id para evitar bucles

// DOM
const btnTomarQuiz = document.getElementById('btn-tomar-quiz');
const quizArea = document.getElementById('quiz-area');
const questionText = document.getElementById('question-text');
const choicesContainer = document.getElementById('choices-container');
const quizProgress = document.getElementById('quiz-progress');
const btnSaltar = document.getElementById('btn-saltar');
const btnRevisar = document.getElementById('btn-revisar');
const feedbackContainer = document.getElementById('feedback-container');
const btnFinalizar = document.getElementById('btn-finalizar');
const modalResultados = document.getElementById('modal-resultados');
const resultadosFinales = document.getElementById('resultados-finales');
const accionesFinales = document.getElementById('acciones-finales');
// Nuevo: contenedor de resultados dentro del área de quiz
const resultsSummary = document.getElementById('results-summary');
const resultsContent = document.getElementById('results-content');
const resultsActions = document.getElementById('results-actions');

let opcionSeleccionada = null;

// Helpers
function mezclar(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function startQuiz() {
    pool = Array.from({ length: PREGUNTAS.length }, (_, i) => i);
    mezclar(pool);
    preguntasSeleccionadas = pool.slice(0, Math.min(MAX_PREGUNTAS, pool.length)).map(i => PREGUNTAS[i]);
    indice = 0;
    respuestas = [];
    opcionSeleccionada = null;
    quizArea.style.display = 'block';
    btnTomarQuiz.style.display = 'none';
    btnFinalizar.style.display = 'none';
    renderPregunta();
}

function renderPregunta() {
    const p = preguntasSeleccionadas[indice];
    questionText.textContent = p.question;
    choicesContainer.innerHTML = '';
    opcionSeleccionada = null;
    btnRevisar.disabled = true;
    feedbackContainer.innerHTML = '';

    p.choices.forEach((c, i) => {
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.textContent = String.fromCharCode(65 + i) + '. ' + c; // A., B., C., D.
        btn.dataset.index = i;
        btn.addEventListener('click', () => selectChoice(i, btn));
        choicesContainer.appendChild(btn);
    });

    quizProgress.textContent = `${indice + 1} / ${preguntasSeleccionadas.length}`;
}

function selectChoice(i, btn) {
    opcionSeleccionada = i;
    // marcar visualmente
    document.querySelectorAll('.choice-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    btnRevisar.disabled = false;
}

function handleSaltar() {
    const current = preguntasSeleccionadas[indice];
    // Si ya fue saltada una vez, registrar como saltada definitivamente
    skipCounts[current.id] = (skipCounts[current.id] || 0) + 1;
    if (skipCounts[current.id] > 1) {
        respuestas.push({ pregunta: current, selected: null, correct: current.correct });
        avanzar();
        return;
    }

    // Mover la pregunta actual al final del conjunto para que se genere una nueva ahora
    preguntasSeleccionadas.push(current);
    preguntasSeleccionadas.splice(indice, 1);

    // Si la lista terminò, finalizar
    if (indice >= preguntasSeleccionadas.length) {
        finalizarQuiz();
    } else {
        renderPregunta();
    }
}

function handleRevisar() {
    if (opcionSeleccionada === null) return;
    const p = preguntasSeleccionadas[indice];
    const esCorrecta = opcionSeleccionada === p.correct;
    respuestas.push({ pregunta: p, selected: opcionSeleccionada, correct: p.correct });

    if (esCorrecta) {
        showFeedback('✅ ¡Correcto! ' + p.feedback, 'correcto');
    } else {
        const texto = `❌ Incorrecto. ${p.feedback}`;
        showFeedback(texto, 'incorrecto');
    }

    // Avanzar automáticamente después de 2 segundos
    setTimeout(avanzar, 2000);
}

function showFeedback(text, tipo) {
    feedbackContainer.innerHTML = '';
    const div = document.createElement('div');
    div.className = tipo === 'correcto' ? 'feedback-correcto' : 'feedback-incorrecto';
    div.textContent = text;
    feedbackContainer.appendChild(div);
}

function avanzar() {
    indice++;
    if (indice >= preguntasSeleccionadas.length) {
        finalizarQuiz();
    } else {
        renderPregunta();
    }
}

function finalizarQuiz() {
    // Mostrar resultados dentro de la caja del quiz
    // ocultar la tarjeta de pregunta y mostrar el resumen
    const quizCard = quizArea.querySelector('.card');
    if (quizCard) quizCard.style.display = 'none';
    resultsSummary.style.display = 'block';
    const total = preguntasSeleccionadas.length;
    const correctas = respuestas.filter(r => r.selected === r.correct).length;

    let html = `<h3>Puntuación: ${correctas} / ${total}</h3>`;
    preguntasSeleccionadas.forEach((p, idx) => {
        // Buscar respuesta correspondiente por id
        const r = respuestas.find(rr => rr.pregunta.id === p.id);
        const sel = r && r.selected !== null ? p.choices[r.selected] : '<i>No respondida</i>';
        const ok = r && r.selected === p.correct;

        html += `<div class="result-item" data-id="${p.id}">`;
        html += `<div class="result-header">Pregunta ${idx + 1}:</div>`;
        html += `<div class="result-question">${p.question}</div>`;
        html += `<div><strong>Tu respuesta:</strong> ${sel}</div>`;
        html += `<div><strong>Correcta:</strong> ${p.choices[p.correct]}</div>`;
        html += `<div style="margin-top:6px;"><span class="${ok ? 'feedback-correcto' : 'feedback-incorrecto'} small inline">${ok ? 'Correcta' : (r ? 'Incorrecta' : 'Sin respuesta')}</span>`;
        if (!ok) {
            html += ` <button class="btn btn-secondary revisar-incorrecta" data-id="${p.id}">Ver explicación</button>`;
        }
        html += `</div>`;
        if (!ok) {
            html += `<div class="explanation" id="exp-${p.id}">${p.feedback}</div>`;
        }
        html += `</div>`;
    });

    resultsContent.innerHTML = html;

    // Acciones finales dentro del summary
    resultsActions.innerHTML = '';
    if (correctas >= 4) {
        const btnTest = document.createElement('button');
        btnTest.className = 'btn btn-success';
        btnTest.textContent = 'Tomar test (desbloqueado)';
        btnTest.addEventListener('click', () => {
            alert('Has desbloqueado el test. (Función de test no implementada en este prototipo).');
            // volver al inicio
            resultsSummary.style.display = 'none';
            const quizCard = quizArea.querySelector('.card');
            if (quizCard) quizCard.style.display = 'block';
            btnTomarQuiz.style.display = 'inline-block';
        });
        resultsActions.appendChild(btnTest);
    }

    const btnContinuar = document.createElement('button');
    btnContinuar.className = 'btn btn-primary';
    btnContinuar.textContent = 'Continuar aprendiendo';
    btnContinuar.addEventListener('click', () => {
        resultsSummary.style.display = 'none';
        const quizCard = quizArea.querySelector('.card');
        if (quizCard) quizCard.style.display = 'block';
        btnTomarQuiz.style.display = 'inline-block';
    });
    resultsActions.appendChild(btnContinuar);

    // Añadir listeners a botones "Ver explicación" para mostrar/ocultar la explicación
    // listeners para los botones dentro del resultsContent
    resultsContent.querySelectorAll('.revisar-incorrecta').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            const exp = document.getElementById(`exp-${id}`);
            if (!exp) return;
            exp.classList.toggle('show');
            e.target.textContent = exp.classList.contains('show') ? 'Ocultar explicación' : 'Ver explicación';
        });
    });
}

// Eventos
btnTomarQuiz.addEventListener('click', startQuiz);
btnSaltar.addEventListener('click', handleSaltar);
btnRevisar.addEventListener('click', handleRevisar);
btnFinalizar.addEventListener('click', finalizarQuiz);

// Cerrar modal
document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
        modalResultados.style.display = 'none';
        quizArea.style.display = 'none';
        btnTomarQuiz.style.display = 'inline-block';
    });
});

window.addEventListener('click', (e) => {
    if (e.target === modalResultados) modalResultados.style.display = 'none';
});

// Estilo simple: destacar opción seleccionada mediante clases en CSS (ver estilos)


