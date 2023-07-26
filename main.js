const numeroAleatorio = Math.floor(Math.random() * 25) + 1;
const intentos = [];
const jugador = { nombre: prompt('Ingresa tu nombre:') };

function adivinaElNumero() {
    const numero = parseInt(prompt('Ingresa un número entre 1 y 25:'));

    if (isNaN(numero) || numero < 1 || numero > 25) {
        console.log('Por favor, ingresa un número válido entre 1 y 25.');
        adivinaElNumero(); // Pedimos un nuevo intento al jugador
        return;
}

    intentos.push({ numero, intento: intentos.length + 1 });

    if (numero === numeroAleatorio) {
    console.log(`¡Felicidades ${jugador.nombre}! Adivinaste el número ${numeroAleatorio} en ${intentos.length} intentos.`);
    alert(`¡Felicidades ${jugador.nombre}! Adivinaste el número en ${intentos.length} intentos.`);
} else {
    let mensajeFallo = '¡Fallaste! Sigue intentando.';
        if (numero < numeroAleatorio) {
            mensajeFallo += ' El número es mayor.';
    }   else {
            mensajeFallo += ' El número es menor.';
    }
    alert(mensajeFallo); // Mensaje de fallo con informacion adicional
    adivinaElNumero(); // Pedimos un nuevo intento al jugador
}
}

// Iniciar el juego
adivinaElNumero();