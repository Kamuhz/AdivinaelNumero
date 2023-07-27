const numeroAleatorio = Math.floor(Math.random() * 25) + 1;
const intentosMaximos = 5;
let intentos = 0;
const jugadores = []; // Array para almacenar

const obtenerNombre = () => prompt('Ingresa tu nombre:');

function agregarJugador(nombre) {
    jugadores.push({ nombre, intentos });
}

function adivinaElNumero() {
    const numero = parseInt(prompt('Ingresa un número entre 1 y 25:'));

    if (isNaN(numero) || numero < 1 || numero > 25) {
        console.log('Por favor, ingresa un número válido entre 1 y 25.');
        adivinaElNumero(); // Pedimos un nuevo intento al jugador
        return;
    }

    intentos++;

    if (numero === numeroAleatorio) {
        console.log(`¡Felicidades ${jugadores[jugadores.length - 1].nombre}! Adivinaste el número ${numeroAleatorio} en ${intentos} intentos.`);
        alert(`¡Felicidades ${jugadores[jugadores.length - 1].nombre}! Adivinaste el número en ${intentos} intentos.`);
    } else {
        if (intentos === intentosMaximos) {
            console.log(`Lo siento ${jugadores[jugadores.length - 1].nombre}, has superado el límite de intentos. El número era ${numeroAleatorio}.`);
            alert(`Lo siento ${jugadores[jugadores.length - 1].nombre}, has superado el límite de intentos. El número era ${numeroAleatorio}.`);
        } else {
            let mensajeFallo = '¡Fallaste! Sigue intentando.';
            if (numero < numeroAleatorio) {
                mensajeFallo += ' El número es mayor.';
            } else {
                mensajeFallo += ' El número es menor.';
            }
            alert(mensajeFallo); // Mensaje de fallo
            adivinaElNumero(); // Pedimos un nuevo intento al jugador
        }
    }
}

// Iniciar el juego
const nombreJugador = obtenerNombre();
agregarJugador(nombreJugador);
adivinaElNumero();
