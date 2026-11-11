/* ==========================================================================
   1. Funciones Globales y DOM (Aplica a las 3 páginas)
   ========================================================================== */

// 1.1 Configurar el año automático en el footer
const spansAnio = document.querySelectorAll('.anio-actual, #anio-actual');
spansAnio.forEach(span => span.textContent = new Date().getFullYear());

// 1.2 Modo Oscuro con LocalStorage
const btnOscuro = document.getElementById('btn-modo-oscuro');
const body = document.body;

// Comprobar si el usuario ya había elegido el tema oscuro
if (localStorage.getItem('tema-cafe') === 'oscuro') {
    body.classList.add('oscuro');
}

btnOscuro.addEventListener('click', () => {
    body.classList.toggle('oscuro');
    // Guardar la preferencia en el almacenamiento del navegador
    if (body.classList.contains('oscuro')) {
        localStorage.setItem('tema-cafe', 'oscuro');
    } else {
        localStorage.setItem('tema-cafe', 'claro');
    }
});

// 1.3 Menú Hamburguesa Móvil (Creación dinámica e interacción)
const navUl = document.querySelector('nav ul');
const header = document.querySelector('header');

// Creamos el botón hamburguesa con JS para no tener que repetir código HTML
const btnHamburguesa = document.createElement('button');
btnHamburguesa.id = 'btn-hamburguesa';
btnHamburguesa.setAttribute('aria-expanded', 'false');
btnHamburguesa.setAttribute('aria-label', 'Abrir menú');
btnHamburguesa.innerHTML = '☰';

// Lo insertamos en el header antes del nav
header.insertBefore(btnHamburguesa, document.querySelector('nav'));

btnHamburguesa.addEventListener('click', () => {
    navUl.classList.toggle('activo');
    const estaExpandido = navUl.classList.contains('activo');
    btnHamburguesa.setAttribute('aria-expanded', estaExpandido);
});

// 1.4 Detalle propio: Botón "Volver arriba" dinámico al hacer scroll
const btnSubir = document.createElement('button');
btnSubir.textContent = '↑ Subir';
btnSubir.style.cssText = 'position: fixed; bottom: 20px; right: 20px; display: none; padding: 10px 15px; border-radius: 5px; background: var(--color-secundario); color: #fff; border: none; cursor: pointer; z-index: 1000; box-shadow: 0 4px 6px rgba(0,0,0,0.1);';
document.body.appendChild(btnSubir);

window.addEventListener('scroll', () => {
    // Mostrar el botón si bajamos más de 300px
    if (window.scrollY > 300) {
        btnSubir.style.display = 'block';
    } else {
        btnSubir.style.display = 'none';
    }
});

btnSubir.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});


/* ==========================================================================
   2. Contenido Dinámico (Página: servicios.html)
   ========================================================================== */
const contenedorTarjetas = document.getElementById('contenedor-tarjetas');

// Protegemos el código con un IF para que solo se ejecute si estamos en servicios.html
if (contenedorTarjetas) {
    // Arreglo de objetos (Nuestros productos)
    const catalogo = [
        { id: 1, nombre: 'Espresso Sencillo', categoria: 'caliente', precio: 100, descripcion: 'Un shot intenso y aromático de nuestra mezcla de la casa.', imagen: 'https://placehold.co/400x300/5c3a21/ffffff?text=Espresso' },
        { id: 2, nombre: 'Cappuccino Clásico', categoria: 'caliente', precio: 150, descripcion: 'Espresso perfecto, leche vaporizada y una capa de espuma.', imagen: 'https://placehold.co/400x300/5c3a21/ffffff?text=Cappuccino' },
        { id: 3, nombre: 'Cold Brew', categoria: 'frio', precio: 200, descripcion: 'Café de especialidad extraído en frío por 16 horas.', imagen: 'https://placehold.co/400x300/d4a373/333333?text=Cold+Brew' },
        { id: 4, nombre: 'Frappé de Caramelo', categoria: 'frio', precio: 220, descripcion: 'Café licuado con hielo, leche fresca y sirope de caramelo.', imagen: 'https://placehold.co/400x300/d4a373/333333?text=Frappe' },
        { id: 5, nombre: 'Tarta de Zanahoria', categoria: 'postre', precio: 250, descripcion: 'Bizcocho especiado con suave frosting de queso crema.', imagen: 'https://placehold.co/400x300/fcf9f5/333333?text=Tarta' },
        { id: 6, nombre: 'Brownie con Helado', categoria: 'postre', precio: 180, descripcion: 'Chocolate intenso caliente con bola de helado de vainilla.', imagen: 'https://placehold.co/400x300/fcf9f5/333333?text=Brownie' }
    ];

    const buscador = document.getElementById('buscador');
    const filtroCat = document.getElementById('filtro-categoria');
    const contador = document.getElementById('contador-resultados');

    // Función para dibujar las tarjetas
    const pintarTarjetas = (datos) => {
        contenedorTarjetas.innerHTML = ''; // Limpiamos el contenedor
        
        if (datos.length === 0) {
            contenedorTarjetas.innerHTML = '<p>No encontramos opciones con esa búsqueda. ¡Intenta con otra palabra!</p>';
            contador.textContent = '0 resultados encontrados.';
            return;
        }

        datos.forEach(item => {
            const div = document.createElement('div');
            div.className = 'tarjeta';
            // Dando formato DOP al precio
            const precioDOP = item.precio.toLocaleString('es-DO', { style: 'currency', currency: 'DOP' });
            
            div.innerHTML = `
                <img src="${item.imagen}" alt="${item.nombre}">
                <h3>${item.nombre}</h3>
                <p>${item.descripcion}</p>
                <p class="tarjeta-precio">${precioDOP}</p>
            `;
            contenedorTarjetas.appendChild(div);
        });

        contador.textContent = `Mostrando ${datos.length} de ${catalogo.length} opciones en el menú.`;
    };

    // Función para filtrar
    const filtrarCatalogo = () => {
        const texto = buscador.value.toLowerCase();
        const categoria = filtroCat.value;

        const filtrados = catalogo.filter(item => {
            const coincideTexto = item.nombre.toLowerCase().includes(texto) || item.descripcion.toLowerCase().includes(texto);
            const coincideCat = categoria === 'todas' || item.categoria === categoria;
            return coincideTexto && coincideCat;
        });

        pintarTarjetas(filtrados);
    };

    // Escuchamos eventos de los filtros
    buscador.addEventListener('input', filtrarCatalogo);
    filtroCat.addEventListener('change', filtrarCatalogo);

    // Renderizamos el catálogo por primera vez al cargar
    pintarTarjetas(catalogo);
}


/* ==========================================================================
   3. Validación de Formulario (Página: contacto.html)
   ========================================================================== */
const formulario = document.getElementById('form-contacto');

if (formulario) {
    const inputs = formulario.querySelectorAll('input, select, textarea');

    // Función auxiliar para mostrar errores
    const mostrarError = (id, mensaje) => {
        const campo = document.getElementById(id);
        const spanError = document.getElementById(`error-${id}`);
        campo.classList.add('invalido');
        spanError.textContent = mensaje;
    };

    // Limpiar errores automáticamente cuando el usuario escribe o cambia el campo
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            input.classList.remove('invalido');
            const spanError = document.getElementById(`error-${input.id}`);
            if (spanError) spanError.textContent = '';
        });
    });

    formulario.addEventListener('submit', (evento) => {
        evento.preventDefault(); // Detener el envío natural del formulario
        let esValido = true;

        // 3.1 Validar reglas nativas de HTML5 manualmente con JS
        inputs.forEach(input => {
            if (input.required || input.value) {
                if (!input.checkValidity()) {
                    mostrarError(input.id, input.validationMessage || 'Este campo es obligatorio o tiene un formato incorrecto.');
                    esValido = false;
                }
            }
        });

        // 3.2 Regla propia #1: Teléfono Dominicano
        const tel = document.getElementById('telefono');
        if (tel.value) {
            // Regex: Debe iniciar con 809, 829 o 849 y seguir con 7 números
            const regexDominicano = /^(809|829|849)\d{7}$/;
            if (!regexDominicano.test(tel.value)) {
                mostrarError('telefono', 'El teléfono debe iniciar con 809, 829 o 849 y tener 10 dígitos.');
                esValido = false;
            }
        }

        // 3.3 Regla propia #2: Validar que la fecha no sea en el pasado
        const fecha = document.getElementById('fecha');
        if (fecha.value) {
            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0); // Resetear hora para comparar solo fechas
            const fechaIngresada = new Date(fecha.value + 'T00:00:00'); // Forzar zona horaria local
            
            if (fechaIngresada < hoy) {
                mostrarError('fecha', 'La fecha de reserva no puede ser en el pasado.');
                esValido = false;
            }
        }

        // 3.4 Regla propia #3: Condicional según el select
        const motivo = document.getElementById('motivo');
        const personas = document.getElementById('personas');
        // Si el motivo es "evento" privado, exigimos al menos 5 personas
        if (motivo.value === 'evento' && (!personas.value || personas.value < 5)) {
            mostrarError('personas', 'Para eventos privados se requieren mínimo 5 personas.');
            esValido = false;
        }

        // 3.5 Acciones si todo está correcto
        if (esValido) {
            const msjExito = document.getElementById('mensaje-exito');
            const nombreUsuario = document.getElementById('nombre').value;
            const nombreMotivo = motivo.options[motivo.selectedIndex].text;
            
            msjExito.innerHTML = `<strong>¡Listo, ${nombreUsuario}!</strong><br>Tu solicitud para "${nombreMotivo}" ha sido registrada. Nos comunicaremos contigo pronto.`;
            msjExito.classList.remove('oculto');
            
            // Limpiar formulario y desplazar la pantalla hacia el mensaje de éxito
            formulario.reset();
            window.scrollTo({ top: msjExito.offsetTop - 50, behavior: 'smooth' });
        }
    });
}