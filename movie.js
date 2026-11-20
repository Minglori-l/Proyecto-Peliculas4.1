const API_KEY = '71d958f8c6e596bda98074635b045557'; 
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const parametrosUrl = new URLSearchParams(window.location.search);
const movieId = parametrosUrl.get('id');
const contenedorDetalles = document.getElementById('movie-details-container');

async function cargarDetallesCompletos() {
   
    if (!movieId) {
        window.location.href = 'index.html';
        return;
    }

    try {
        // 2. Promise.all ejecuta las 3 consultas a la API AL MISMO TIEMPO
        const [resDetalles, resCreditos, resVideos] = await Promise.all([
            fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=es-MX`),
            fetch(`${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}&language=es-MX`),
            fetch(`${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}&language=es-MX`)
        ]);


        const detalles = await resDetalles.json();
        const creditos = await resCreditos.json();
        const videos = await resVideos.json();
        const actores = creditos.cast.slice(0, 5).map(actor => actor.name).join(', ');
        const generos = detalles.genres.map(g => g.name).join(', ');
        const trailer = videos.results.find(vid => vid.site === 'YouTube' && vid.type === 'Trailer');
        mostrarEnPantalla(detalles, actores, generos, trailer);

    } catch (error) {
        console.error("Error al cargar los detalles de la película:", error);
        contenedorDetalles.innerHTML = "<p>Hubo un error al cargar la información.</p>";
    }
}

function mostrarEnPantalla(pelicula, actores, generos, trailer) {

    const htmlTrailer = trailer 
        ? `<div class="trailer-container">
               <h3>Tráiler Oficial</h3>
               <iframe width="560" height="315" src="https://www.youtube.com/embed/${trailer.key}" 
               title="YouTube video player" frameborder="0" allowfullscreen></iframe>
           </div>`
        : `<p><em>No hay tráiler disponible en español para esta película.</em></p>`;

    
    contenedorDetalles.innerHTML = `
        <article class="detail-card">
            <img src="${IMG_BASE_URL}${pelicula.poster_path}" alt="Póster de ${pelicula.title}">
            <div class="detail-info">
                <h1>${pelicula.title}</h1>
                <p><strong>Géneros:</strong> ${generos}</p>
                <p><strong>Fecha de estreno:</strong> ${pelicula.release_date}</p>
                <p><strong>Calificación:</strong>  ${pelicula.vote_average.toFixed(1)}</p>
                <p><strong>Actores principales:</strong> ${actores}</p>
                <h3>Sinopsis</h3>
                <p>${pelicula.overview || 'Sin descripción disponible en español.'}</p>
                ${htmlTrailer}
            </div>
        </article>
    `;
}

cargarDetallesCompletos();