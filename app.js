const API_KEY = '71d958f8c6e596bda98074635b045557'; // clave real de nuestra APIs
const BASE_URL = 'https://api.themoviedb.org/3';
// 1. NUEVO: TMDB no envía la URL completa de la imagen, solo la parte final.
const IMG_BASE_URL = 'https://image.tmdb.org/t/p/w500'; 

// 2. la etiqueta <section> de nuestro HTML donde irán las películas
const contenedorPeliculas = document.getElementById('movies-container');

// 3.  Función que recibe la lista de películas y las mete en el HTML
function mostrarPeliculas(peliculas) {
    
    contenedorPeliculas.innerHTML = '';

    // Recorremos cada película de la lista
    peliculas.forEach(pelicula => {
        // Creamos la etiqueta <article> que nos pide la rúbrica (HTML5 semántico)
        const article = document.createElement('article');
        article.classList.add('movie-card'); // Le damos una clase para ponerle CSS luego

        // Rellenamos el artículo con la imagen, el título y la calificación
        // Usamos las comillas invertidas (backticks ` `) para poder inyectar las variables
        article.innerHTML = `
            <img src="${IMG_BASE_URL}${pelicula.poster_path}" alt="Póster de ${pelicula.title}">
            <div class="movie-info">
                <h2>${pelicula.title}</h2>
                <p>⭐ ${pelicula.vote_average.toFixed(1)}</p>
            </div>
        `;

        // Agregamos este nuevo artículo al contenedor principal del HTML
        contenedorPeliculas.appendChild(article);
    });
}

// 4. ACTUALIZADO: Modificamos nuestra función original
async function obtenerPeliculasPopulares() {
    try {
        const respuesta = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=es-MX`);
        const datos = await respuesta.json();
        
        // En lugar de hacer console.log, ahora le pasamos los datos a nuestra nueva función
        mostrarPeliculas(datos.results);
        
    } catch (error) {
        console.error("Hubo un error al conectar con la API:", error);
    }
}

// ==========================================
// LÓGICA DEL BUSCADOR CON DEBOUNCE
// ==========================================

// 1. Atrapamos el input de búsqueda del HTML
const inputBuscador = document.getElementById('search-input');

// 2. Creamos la función Debounce pura en JavaScript
function debounce(funcionPrincipal, tiempoEspera) {
    let temporizador;
    return function(...argumentos) {
        // Si el usuario sigue escribiendo, borramos el temporizador anterior
        clearTimeout(temporizador);
        // Creamos un nuevo temporizador
        temporizador = setTimeout(() => {
            funcionPrincipal.apply(this, argumentos);
        }, tiempoEspera);
    };
}

// 3. Función para buscar en la API de TMDB
async function buscarPeliculas(terminoBusqueda) {
    // Si el usuario borra todo y deja el buscador vacío, volvemos a mostrar las populares
    if (terminoBusqueda.trim() === '') {
        obtenerPeliculasPopulares();
        return;
    }

    try {
        // Fíjate que la URL cambia, ahora usamos "/search/movie" y le pasamos el "query"
        const respuesta = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&language=es-MX&query=${terminoBusqueda}`);
        const datos = await respuesta.json();
        
        // Reutilizamos nuestra función que pinta las películas, pero ahora con los resultados de la búsqueda
        mostrarPeliculas(datos.results);
        
    } catch (error) {
        console.error("Error al buscar las películas:", error);
    }
}

// 4. Unimos todo: Le decimos al input que use el Debounce con medio segundo de espera (500ms)
const realizarBusqueda = debounce((evento) => {
    buscarPeliculas(evento.target.value);
}, 500);

// 5. Escuchamos cada vez que el usuario escribe algo en el input
inputBuscador.addEventListener('input', realizarBusqueda);

// Llamamos a la función al iniciar
obtenerPeliculasPopulares();