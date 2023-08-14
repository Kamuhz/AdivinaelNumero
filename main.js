let numeroAleatorio = Math.floor(Math.random() * 25) + 1;
const intentosMaximos = 5;
let intentos = 0;
let confettiInstance = null;

const adivinaForm = document.getElementById('adivina-form');

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

adivinaForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value;
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
                confirmButtonText: 'Nuevo juego',
                cancelButtonText: 'Salir',
            }).then((result) => {
                if (result.isConfirmed) {
                    intentos = 0;
                    numeroAleatorio = Math.floor(Math.random() * 25) + 1;
                    mostrarMejoresPuntuaciones();
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
});