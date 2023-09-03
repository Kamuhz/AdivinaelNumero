document.addEventListener('DOMContentLoaded', function () {
    let numeroAleatorio = Math.floor(Math.random() * 25) + 1;
    const intentosMaximos = 5;
    let intentos = 0;
    let confettiInstance = null;

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

    document.addEventListener('DOMContentLoaded', () => {
        mostrarMejoresPuntuaciones();
    });
    const adivinarButton = document.getElementById('adivinar-button');
    adivinarButton.addEventListener('click', function () {
        const nombre = document.getElementById('nombre').value;

        if (intentos === intentosMaximos) {
            Swal.fire({
                icon: 'warning',
                title: 'Límite de intentos alcanzado',
                text: `Lo siento ${nombre}, has superado el límite de intentos. El número era ${numeroAleatorio}.`,
                showCancelButton: true,
                confirmButtonText: 'Responder pregunta para una oportunidad extra',
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

            intentos++;

            if (numero === numeroAleatorio) {
                confettiInstance = new ConfettiGenerator({ target: 'confetti-canvas' });
                confettiInstance.render();

                const puntaje = { nombre, intentos };
                let mejoresPuntuaciones = JSON.parse(localStorage.getItem('mejoresPuntuaciones')) || [];
                mejoresPuntuaciones.push(puntaje);
                mejoresPuntuaciones.sort((a, b) => a.intentos - b.intentos);
                localStorage.setItem('mejoresPuntuaciones', JSON.stringify(mejoresPuntuaciones));

                Swal.fire({
                    icon: 'success',
                    title: `¡Felicidades ${nombre}!`,
                    text: `Adivinaste el número ${numeroAleatorio} en ${intentos} intentos.\n¡Tus mejores puntuaciones están disponibles en la sección "Mis Mejores Puntuaciones"!`,
                }).then(() => {
                    confettiInstance.clear();
                    intentos = 0;
                    numeroAleatorio = Math.floor(Math.random() * 25) + 1;
                    mostrarMejoresPuntuaciones();
                });
            } else {
                if (intentos === intentosMaximos) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Límite de intentos alcanzado',
                        text: `Lo siento ${nombre}, has superado el límite de intentos. El número era ${numeroAleatorio}.`,
                        showCancelButton: true,
                        confirmButtonText: 'Responder pregunta para una oportunidad extra',
                        cancelButtonText: 'Salir',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            mostrarPreguntaTriviaParaIntentoExtra();
                        } else {
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
                    if (intentos < intentosMaximos) {
                        const intentosRestantes = intentosMaximos - intentos;
                        const cuadroIntentos = document.getElementById('cantidad-intentos');
                        cuadroIntentos.textContent = intentosRestantes;
                    }
                }
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
                            intentos = 0;
                            Swal.fire({
                                icon: 'success',
                                title: '¡Respuesta correcta!',
                                text: 'Has ganado una oportunidad extra para adivinar el número.'
                            });
                        } else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Respuesta incorrecta',
                                text: `La respuesta correcta era "${respuestaCorrecta}".`
                            }).then(() => {
                                preguntarOtraPreguntaOEmpezarNuevoJuego();
                            });
                        }
                    } else {
                        preguntarOtraPreguntaOEmpezarNuevoJuego();
                    }
                });
            })
            .catch(error => {
                console.error('Error al obtener la pregunta de trivia:', error);
            });
    }

    function mostrarRespuestaCorrecta(respuestaCorrecta) {
        console.log('Mostrando respuesta correcta:', respuestaCorrecta);
        Swal.fire({
            icon: 'info',
            title: 'Respuesta correcta',
            text: `La respuesta correcta era "${respuestaCorrecta}".`
        }).then(() => {
            console.log('Llamando a preguntarOtraPreguntaOEmpezarNuevoJuego');
            preguntarOtraPreguntaOEmpezarNuevoJuego();
        });
    }

    function preguntarOtraPreguntaOEmpezarNuevoJuego() {
        Swal.fire({
            icon: 'question',
            title: '¿Qué quieres hacer?',
            showCancelButton: true,
            confirmButtonText: 'Contestar otra pregunta',
            cancelButtonText: 'Empezar nuevo juego',
        }).then((result) => {
            if (result.isConfirmed) {
                mostrarPreguntaTriviaParaIntentoExtra(); // Mostrar otra pregunta
            } else {
                // Empezar un nuevo juego
                intentos = 0;
                numeroAleatorio = Math.floor(Math.random() * 25) + 1;
                mostrarMejoresPuntuaciones();
            }
        });
    }

    // Generar un número aleatorio al cargar la página
    numeroAleatorio = Math.floor(Math.random() * 25) + 1;
});
