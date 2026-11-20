// 1. CONFIGURACIÓN DE LA API
const API_KEY = '71d958f8c6e596bda98074635b045557';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// Referencias a los elementos del DOM
const contenedorPeliculas = document.getElementById('movies-container');
const inputBuscador = document.getElementById('search-input');
const formularioBuscador = document.getElementById('search-form');

//Referencias para la paginación
const btnAnterior = document.getElementById('prev-btn');
const btnSiguiente = document.getElementById('next-btn');
const infoPagina = document.getElementById('page-info');

// Variables de estado para controlar la página y búsqueda actual
let paginaActual = 1;
let totalPaginas = 1;
let busquedaActual = '';

// 2. RENDERIZADO DE PELÍCULAS EN EL DOM
function mostrarPeliculas(peliculas) {
    contenedorPeliculas.innerHTML = '';

    if (!peliculas || peliculas.length === 0) {
        contenedorPeliculas.innerHTML = '<p class="no-results">No se encontraron películas que coincidan con tu búsqueda.</p>';
        return;
    }

    peliculas.forEach(pelicula => {
        const article = document.createElement('article');
        article.classList.add('movie-card');

        article.addEventListener('click', () => {
            window.location.href = `movie.html?id=${pelicula.id}`;
        });

        const rutaImagen = pelicula.poster_path 
            ? `${IMG_BASE_URL}${pelicula.poster_path}` 
            : 'https://via.placeholder.com/500x750?text=Sin+Poster';

        article.innerHTML = `
            <img src="${rutaImagen}" alt="Póster de ${pelicula.title}" loading="lazy">
            <div class="movie-info">
                <h2>${pelicula.title}</h2>
                <p>⭐ ${pelicula.vote_average ? pelicula.vote_average.toFixed(1) : 'N/A'}</p>
            </div>
        `;

        contenedorPeliculas.appendChild(article);
    });
}

//Función que actualiza el texto y habilita/deshabilita los botones
function actualizarControlesPaginacion() {
    infoPagina.textContent = `Página ${paginaActual} de ${totalPaginas}`;
    btnAnterior.disabled = paginaActual <= 1;
    btnSiguiente.disabled = paginaActual >= totalPaginas;
}


// 3. CONSULTAS A LA API (POPULARES Y BÚSQUEDA)
async function obtenerPeliculasPopulares(pagina = 1) {
    try {
        const respuesta = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=es-MX&page=${pagina}`);
        if (!respuesta.ok) throw new Error('Error en la respuesta de la red');
        
        const datos = await respuesta.json();
        paginaActual = datos.page;
        // TMDB permite máximo 200 páginas en consultas públicas
        totalPaginas = Math.min(datos.total_pages, 200); 
        
        mostrarPeliculas(datos.results);
        actualizarControlesPaginacion();
    } catch (error) {
        console.error("Hubo un error al obtener las películas populares:", error);
        contenedorPeliculas.innerHTML = '<p class="error-msg">Error al cargar las películas. Intenta recargar la página.</p>';
    }
}

async function buscarPeliculas(terminoBusqueda, pagina = 1) {
    busquedaActual = terminoBusqueda.trim();

    if (busquedaActual === '') {
        obtenerPeliculasPopulares(pagina);
        return;
    }

    try {
        const queryCodificada = encodeURIComponent(busquedaActual);
        const respuesta = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&language=es-MX&query=${queryCodificada}&page=${pagina}`);
        if (!respuesta.ok) throw new Error('Error en la búsqueda');

        const datos = await respuesta.json();
        paginaActual = datos.page;
        totalPaginas = datos.total_pages || 1;

        mostrarPeliculas(datos.results);
        actualizarControlesPaginacion();
    } catch (error) {
        console.error("Error al buscar las películas:", error);
    }
}


// 4. LÓGICA DE DEBOUNCE Y EVENTOS
function debounce(funcionPrincipal, tiempoEspera) {
    let temporizador;
    return function(...argumentos) {
        clearTimeout(temporizador);
        temporizador = setTimeout(() => {
            funcionPrincipal.apply(this, argumentos);
        }, tiempoEspera);
    };
}

// Al escribir una nueva búsqueda, siempre empezamos desde la página 1
const realizarBusqueda = debounce((evento) => {
    buscarPeliculas(evento.target.value, 1);
}, 200);

inputBuscador.addEventListener('input', realizarBusqueda);

formularioBuscador.addEventListener('submit', (evento) => {
    evento.preventDefault();
});

// NUEVO: Eventos para los botones Anterior y Siguiente
btnAnterior.addEventListener('click', () => {
    if (paginaActual > 1) {
        const nuevaPagina = paginaActual - 1;
        busquedaActual ? buscarPeliculas(busquedaActual, nuevaPagina) : obtenerPeliculasPopulares(nuevaPagina);
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Sube al inicio de la página
    }
});

btnSiguiente.addEventListener('click', () => {
    if (paginaActual < totalPaginas) {
        const nuevaPagina = paginaActual + 1;
        busquedaActual ? buscarPeliculas(busquedaActual, nuevaPagina) : obtenerPeliculasPopulares(nuevaPagina);
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Sube al inicio de la página
    }
});

// 5. INICIALIZACIÓN DE LA APLICACIÓN
obtenerPeliculasPopulares(1);