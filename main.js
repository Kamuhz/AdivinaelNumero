const numeroAleatorio = Math.floor(Math.random() * 100) + 1;
const intentos = [];
const jugador = { nombre: prompt('Ingresa tu nombre:') };

function adivinaElNumero() {
    const numero = parseInt(prompt('Ingresa un número entre 1 y 100:'));

    if (isNaN(numero) || numero < 1 || numero > 100) {
        console.log('Por favor, ingresa un número válido entre 1 y 100.');
        adivinaElNumero(); // Pedimos un nuevo intento al jugador
        return;
}

    intentos.push({ numero, intento: intentos.length + 1 });

    if (numero === numeroAleatorio) {
        console.log(`¡Felicidades ${jugador.nombre}! Adivinaste el número ${numeroAleatorio} en ${intentos.length} intentos.`);
} else {
    if (numero < numeroAleatorio) {
        console.log('El número es mayor. Intenta nuevamente.');
    } else {
        console.log('El número es menor. Intenta nuevamente.');
    }
    alert('¡Fallaste! Sigue intentando.'); // Mensaje de fallo con alert
    adivinaElNumero(); // Pedimos un nuevo intento al jugador
}
}

// Iniciar el juego
adivinaElNumero();