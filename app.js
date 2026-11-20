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

// Llamamos a la función al iniciar
obtenerPeliculasPopulares();