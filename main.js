document.addEventListener('DOMContentLoaded', function () {
    let numeroAleatorio = Math.floor(Math.random() * 25) + 1;
    const intentosMaximos = 5;
    let intentos = intentosMaximos; // Comenzamos con 5 intentos
    let intentosExtra = 0; // Inicialmente no se tienen intentos extra
    let intentosTotales = 0; // Para llevar un registro de intentos totales
    let confettiInstance = null;

    // Función para actualizar el número de intentos en el cuadro HTML
    function actualizarIntentos() {
        const cuadroIntentos = document.getElementById('cantidad-intentos');
        cuadroIntentos.textContent = intentos + intentosExtra;
    }

    // Llama a esta función al inicio para mostrar los 5 intentos iniciales
    actualizarIntentos();

    function mostrarMejoresPuntuaciones() {
        const puntuacionesLista = document.getElementById('puntuaciones-lista');
        puntuacionesLista.innerHTML = '';

        const mejoresPuntuaciones = JSON.parse(localStorage.getItem('mejoresPuntuaciones')) || [];

        mejoresPuntuaciones.forEach((puntaje, index) => {
            const listItem = document.createElement('li');
            listItem.textContent = `${index + 1}. ${puntaje.nombre} - ${puntaje.intentos} intentos`;
            puntuacionesLista.appendChild(listItem);
        });
    }

    mostrarMejoresPuntuaciones();

    const adivinarButton = document.getElementById('adivinar-button');
    adivinarButton.addEventListener('click', function () {
        const nombre = document.getElementById('nombre').value;

        if (intentos + intentosExtra === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Límite de intentos alcanzado',
                text: `Lo siento ${nombre}, has superado el límite de intentos.`,
                showCancelButton: true,
                confirmButtonText: 'Responder pregunta del trivia para un intento extra',
                cancelButtonText: 'Salir',
            }).then((result) => {
                if (result.isConfirmed) {
                    mostrarPreguntaTriviaParaIntentoExtra();
                } else {
                    window.close();
                }
            });
        } else {
            const numero = parseInt(document.getElementById('numero').value);

            if (isNaN(numero) || numero < 1 || numero > 25) {
                Swal.fire({
                    icon: 'error',
                    title: 'Número inválido',
                    text: 'Por favor, ingresa un número válido entre 1 y 25.'
                });
                return;
            }

            if (intentos > 0) {
                intentos--;
            } else if (intentosExtra > 0) {
                intentosExtra--;
            }

            intentosTotales++; // Incrementar el contador de intentos totales

            if (numero === numeroAleatorio) {
                confettiInstance = new ConfettiGenerator({ target: 'confetti-canvas' });
                confettiInstance.render();

                const intentosTotalesJuegoActual = intentosMaximos - intentos + intentosExtra;
                const puntaje = { nombre, intentos: intentosTotalesJuegoActual };
                let mejoresPuntuaciones = JSON.parse(localStorage.getItem('mejoresPuntuaciones')) || [];
                mejoresPuntuaciones.push(puntaje);
                mejoresPuntuaciones.sort((a, b) => a.intentos - b.intentos);
                localStorage.setItem('mejoresPuntuaciones', JSON.stringify(mejoresPuntuaciones));

                Swal.fire({
                    icon: 'success',
                    title: `¡Felicidades ${nombre}!`,
                    text: `Adivinaste el número ${numeroAleatorio} en ${intentosTotalesJuegoActual} intentos.\n¡Tus mejores puntuaciones están disponibles en la sección "Mis Mejores Puntuaciones"!`,
                    showCancelButton: true,
                    confirmButtonText: 'Jugar de nuevo',
                    cancelButtonText: 'Salir',
                }).then((result) => {
                    if (result.isConfirmed) {
                        // Reiniciar el juego
                        intentos = intentosMaximos;
                        intentosExtra = 0;
                        intentosTotales = 0; // Reiniciar el contador de intentos totales
                        numeroAleatorio = Math.floor(Math.random() * 25) + 1;
                        mostrarMejoresPuntuaciones();
                        actualizarIntentos(); // Actualizar el número de intentos en el cuadro HTML
                        confettiInstance.clear();
                    } else {
                        // Salir del juego (opcional)
                        window.close();
                    }
                });
            } else {
                let mensajeFallo = '¡Fallaste! Sigue intentando.';
                mensajeFallo += numero < numeroAleatorio ? ' El número es mayor.' : ' El número es menor.';
                Swal.fire({
                    icon: 'error',
                    title: 'Intento fallido',
                    text: mensajeFallo,
                });

                // Actualizar el número de intentos en el cuadro HTML
                actualizarIntentos();
            }
        }
    });

    function decodeHTMLEntities(text) {
        const textarea = document.createElement('textarea');
        textarea.innerHTML = text;
        return textarea.value;
    }

    function mostrarPreguntaTriviaParaIntentoExtra() {
        fetch('https://opentdb.com/api.php?amount=1&type=multiple&language=es')
            .then(response => response.json())
            .then(data => {
                const pregunta = data.results[0];

                Swal.fire({
                    title: 'Pregunta de Trivia',
                    html: `
                      <p>${decodeHTMLEntities(pregunta.question)}</p>
                      <form id="trivia-form">
                      ${pregunta.incorrect_answers.map((opcion, index) => `
                      <div>
                        <input type="radio" id="opcion${index}" name="respuesta" value="${decodeHTMLEntities(opcion)}">
                        <label for="opcion${index}">${decodeHTMLEntities(opcion)}</label>
                      </div>
                      `).join('')}
                       <div>
                       <input type="radio" id="respuestaCorrecta" name="respuesta" value="${decodeHTMLEntities(pregunta.correct_answer)}">
                       <label for="respuestaCorrecta">${decodeHTMLEntities(pregunta.correct_answer)}</label>
                       </div>
                       </form>
                       `,
                    showCancelButton: true,
                    confirmButtonText: 'Responder',
                    cancelButtonText: 'Cancelar',
                    showLoaderOnConfirm: true,
                    preConfirm: () => {
                        const respuestaElegida = document.querySelector('input[name="respuesta"]:checked');
                        if (!respuestaElegida) {
                            Swal.showValidationMessage('Debes seleccionar una respuesta');
                        }
                        return respuestaElegida.value;
                    },
                    customClass: {
                        confirmButton: 'swal2-btn',
                    },
                }).then((result) => {
                    if (result.isConfirmed) {
                        const respuestaElegida = result.value;
                        const respuestaCorrecta = decodeHTMLEntities(pregunta.correct_answer);

                        if (respuestaElegida === respuestaCorrecta) {
                            Swal.fire({
                                icon: 'success',
                                title: '¡Respuesta correcta!',
                                text: 'Has ganado un intento extra.',
                            });
                            intentosExtra++;
                            actualizarIntentos(); // Actualizar el número de intentos en el cuadro HTML
                        } else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Respuesta incorrecta',
                                text: `La respuesta correcta era "${respuestaCorrecta}".`,
                            }).then(() => {
                                mostrarPreguntaTriviaParaIntentoExtra();
                            });
                        }
                    }
                });
            })
            .catch(error => {
                console.error('Error al obtener la pregunta de trivia:', error);
            });
    }
});

