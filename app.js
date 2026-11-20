const API_KEY = '71d958f8c6e596bda98074635b045557';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// Referencias a los elementos del DOM
const contenedorPeliculas = document.getElementById('movies-container');
const inputBuscador = document.getElementById('search-input');
const formularioBuscador = document.getElementById('search-form');


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


async function obtenerPeliculasPopulares() {
    try {
        const respuesta = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=es-MX`);
        if (!respuesta.ok) throw new Error('Error en la respuesta de la red');
        
        const datos = await respuesta.json();
        mostrarPeliculas(datos.results);
    } catch (error) {
        console.error("Hubo un error al obtener las películas populares:", error);
        contenedorPeliculas.innerHTML = '<p class="error-msg">Error al cargar las películas. Intenta recargar la página.</p>';
    }
}

async function buscarPeliculas(terminoBusqueda) {
    if (terminoBusqueda.trim() === '') {
        obtenerPeliculasPopulares();
        return;
    }

    try {
    
        const queryCodificada = encodeURIComponent(terminoBusqueda);
        const respuesta = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&language=es-MX&query=${queryCodificada}`);
        if (!respuesta.ok) throw new Error('Error en la búsqueda');

        const datos = await respuesta.json();
        mostrarPeliculas(datos.results);
    } catch (error) {
        console.error("Error al buscar las películas:", error);
    }
}

function debounce(funcionPrincipal, tiempoEspera) {
    let temporizador;
    return function(...argumentos) {
        clearTimeout(temporizador);
        temporizador = setTimeout(() => {
            funcionPrincipal.apply(this, argumentos);
        }, tiempoEspera);
    };
}

const realizarBusqueda = debounce((evento) => {
    buscarPeliculas(evento.target.value);
}, 500);


inputBuscador.addEventListener('input', realizarBusqueda);
formularioBuscador.addEventListener('submit', (evento) => {
    evento.preventDefault();
});


obtenerPeliculasPopulares();