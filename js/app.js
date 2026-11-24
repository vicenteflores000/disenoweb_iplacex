/*
 * Luz & Bloom - Lógica JavaScript e interacción con el DOM
 * Funcionalidades implementadas:
 *   1. Botón flotante "Volver arriba" controlado por eventos scroll y click.
 *   2. Filtro por categoría, buscador en vivo y preselección de pedido en el catálogo.
 *   3. Validación interactiva, vista previa dinámica y envío formateado a WhatsApp en el formulario.
 */

document.addEventListener('DOMContentLoaded', function () {
    initVolverArriba();
    initCatalogoInteractivo();
    initFormularioContacto();
});

/**
 * Muestra el botón "Volver arriba" al desplazarse y sube suavemente al hacer clic.
 */
function initVolverArriba() {
    const btnArriba = document.getElementById('btn-volver-arriba');
    if (!btnArriba) return;

    window.addEventListener('scroll', function () {
        btnArriba.classList.toggle('visible', window.scrollY > 240);
    });

    btnArriba.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/**
 * Normaliza texto removiendo tildes y pasando a minúsculas para búsquedas tolerantes.
 */
function normalizarTexto(texto) {
    return texto
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}

/**
 * Filtro por categoría, búsqueda de texto en tiempo real y enlace directo al formulario.
 */
function initCatalogoInteractivo() {
    const botonesFiltro = document.querySelectorAll('.btn-filtro');
    const buscador = document.getElementById('buscador-productos');
    const btnLimpiar = document.getElementById('btn-limpiar-busqueda');
    const tarjetas = document.querySelectorAll('.item-producto');
    const secciones = document.querySelectorAll('.seccion-catalogo');
    const contador = document.getElementById('contador-resultados');
    const avisoSinResultados = document.getElementById('sin-resultados');

    if (!tarjetas.length) return;

    let categoriaActiva = 'todos';

    function aplicarFiltros() {
        const termino = normalizarTexto((buscador ? buscador.value : '').trim());
        let visibles = 0;

        tarjetas.forEach(function (tarjeta) {
            const categoria = tarjeta.dataset.categoria;
            const contenido = normalizarTexto(tarjeta.textContent);
            const coincideCategoria = categoriaActiva === 'todos' || categoria === categoriaActiva;
            const coincideTexto = termino === '' || contenido.includes(termino);
            const mostrar = coincideCategoria && coincideTexto;

            tarjeta.classList.toggle('d-none', !mostrar);
            if (mostrar) visibles++;
        });

        // Oculta secciones sin tarjetas visibles para evitar títulos huérfanos
        secciones.forEach(function (seccion) {
            const hayVisibles = seccion.querySelectorAll('.item-producto:not(.d-none)').length > 0;
            seccion.classList.toggle('d-none', !hayVisibles);
        });

        if (contador) {
            contador.textContent = visibles === 1
                ? 'Mostrando 1 producto disponible.'
                : `Mostrando ${visibles} productos disponibles.`;
        }
        if (avisoSinResultados) {
            avisoSinResultados.classList.toggle('d-none', visibles > 0);
        }
    }

    botonesFiltro.forEach(function (boton) {
        boton.addEventListener('click', function () {
            botonesFiltro.forEach(function (b) { b.classList.remove('active'); });
            boton.classList.add('active');
            categoriaActiva = boton.dataset.categoria;
            aplicarFiltros();
        });
    });

    if (buscador) {
        buscador.addEventListener('input', aplicarFiltros);
    }

    if (btnLimpiar && buscador) {
        btnLimpiar.addEventListener('click', function () {
            buscador.value = '';
            categoriaActiva = 'todos';
            botonesFiltro.forEach(function (b) {
                b.classList.toggle('active', b.dataset.categoria === 'todos');
            });
            aplicarFiltros();
            buscador.focus();
        });
    }

    // Redirige al formulario pre-cargando el producto y aroma elegidos
    document.querySelectorAll('.btn-consultar-producto').forEach(function (btn) {
        btn.addEventListener('click', function () {
            const params = new URLSearchParams({
                linea: btn.dataset.linea || '',
                aroma: btn.dataset.aroma || '',
                producto: btn.dataset.producto || ''
            });
            window.location.href = `contacto.html?${params.toString()}`;
        });
    });
}

/**
 * Validación por campo (blur/input), vista previa en vivo y envío formateado a WhatsApp.
 */
function initFormularioContacto() {
    const formulario = document.getElementById('formulario-contacto');
    if (!formulario) return;

    const campoNombre = document.getElementById('nombre');
    const campoCorreo = document.getElementById('correo');
    const campoTelefono = document.getElementById('telefono');
    const campoLinea = document.getElementById('linea_producto');
    const campoAroma = document.getElementById('materia_prima');
    const campoMensaje = document.getElementById('mensaje');
    const campoEnvase = document.getElementById('envase_reutilizable');
    const textoResumen = document.getElementById('texto-resumen');
    const alerta = document.getElementById('alerta-formulario');

    // Precarga datos si el usuario viene desde un botón "Solicitar este producto"
    const params = new URLSearchParams(window.location.search);
    if (params.get('linea') && campoLinea) {
        campoLinea.value = params.get('linea');
    }
    if (params.get('aroma') && campoAroma) {
        campoAroma.value = params.get('aroma');
    }
    if (params.get('producto') && campoMensaje && campoMensaje.value.trim() === '') {
        campoMensaje.value = `Hola, me gustaría consultar por: ${params.get('producto')}.`;
    }

    function validarCampo(campo) {
        const valor = campo.value.trim();
        let esValido = true;

        if (campo === campoNombre) {
            esValido = valor.length >= 3;
        } else if (campo === campoCorreo) {
            esValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
        } else if (campo === campoTelefono) {
            const digitos = valor.replace(/\D/g, '');
            esValido = valor === '' || digitos.length >= 8;
        } else if (campo === campoLinea) {
            esValido = valor !== '';
        } else if (campo === campoMensaje) {
            esValido = valor.length >= 10;
        }

        campo.classList.toggle('is-valid', esValido && (campo !== campoTelefono || valor !== ''));
        campo.classList.toggle('is-invalid', !esValido);
        return esValido;
    }

    function textoSeleccionado(select) {
        if (!select || select.selectedIndex < 0) return '';
        return select.options[select.selectedIndex].text;
    }

    function actualizarResumen() {
        if (!textoResumen) return;
        const nombre = campoNombre.value.trim() || 'Cliente';
        const linea = campoLinea.value ? textoSeleccionado(campoLinea) : 'Por definir';
        const aroma = textoSeleccionado(campoAroma) || 'Por definir';
        const envase = campoEnvase.checked ? 'Sí, incluir información de envases reutilizables' : 'No especificado';

        textoResumen.textContent = `${nombre} | Línea: ${linea} | Aroma: ${aroma} | ${envase}.`;
    }

    const camposValidables = [campoNombre, campoCorreo, campoTelefono, campoLinea, campoMensaje];
    camposValidables.forEach(function (campo) {
        campo.addEventListener('blur', function () {
            validarCampo(campo);
        });
        campo.addEventListener('input', function () {
            if (campo.classList.contains('is-invalid') || campo.classList.contains('is-valid')) {
                validarCampo(campo);
            }
            actualizarResumen();
        });
    });

    [campoLinea, campoAroma, campoEnvase].forEach(function (control) {
        control.addEventListener('change', actualizarResumen);
    });

    formulario.addEventListener('submit', function (event) {
        event.preventDefault();

        let primerInvalido = null;
        let todoValido = true;

        camposValidables.forEach(function (campo) {
            const ok = validarCampo(campo);
            if (!ok) {
                todoValido = false;
                if (!primerInvalido) primerInvalido = campo;
            }
        });

        if (!todoValido) {
            alerta.className = 'alert alert-danger';
            alerta.textContent = 'Por favor revisa los campos marcados antes de enviar tu solicitud.';
            if (primerInvalido) primerInvalido.focus();
            return;
        }

        const mensajeWhatsApp = [
            `Hola Luz & Bloom, soy ${campoNombre.value.trim()}.`,
            `Correo: ${campoCorreo.value.trim()}`,
            campoTelefono.value.trim() ? `Teléfono: ${campoTelefono.value.trim()}` : null,
            `Línea de interés: ${textoSeleccionado(campoLinea)}`,
            `Aroma preferido: ${textoSeleccionado(campoAroma)}`,
            `Envases reutilizables: ${campoEnvase.checked ? 'Sí' : 'No'}`,
            `Detalle: ${campoMensaje.value.trim()}`
        ].filter(Boolean).join('\n');

        const urlWhatsApp = `https://wa.me/56930549400?text=${encodeURIComponent(mensajeWhatsApp)}`;

        // Construye la confirmación de forma segura sin inyectar HTML de usuario
        alerta.className = 'alert alert-success';
        alerta.textContent = '';

        const titulo = document.createElement('strong');
        titulo.textContent = '¡Solicitud validada con éxito! ';
        const texto = document.createElement('span');
        texto.textContent = 'Tu mensaje está listo para enviarse por WhatsApp oficial (+56 9 3054 9400). ';
        const enlace = document.createElement('a');
        enlace.href = urlWhatsApp;
        enlace.target = '_blank';
        enlace.rel = 'noopener';
        enlace.className = 'alert-link text-decoration-underline';
        enlace.textContent = 'Abrir chat en WhatsApp';

        alerta.append(titulo, texto, enlace);
    });

    formulario.addEventListener('reset', function () {
        setTimeout(function () {
            camposValidables.forEach(function (campo) {
                campo.classList.remove('is-valid', 'is-invalid');
            });
            alerta.className = 'alert d-none';
            alerta.textContent = '';
            actualizarResumen();
        }, 0);
    });

    actualizarResumen();
}
