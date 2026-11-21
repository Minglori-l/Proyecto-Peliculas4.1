# 🎬 Catálogo de Películas (TMDB API) - Opción #4

Aplicación web desarrollada en equipo que consume la API de **The Movie Database (TMDB)** para listar películas populares, realizar búsquedas optimizadas en tiempo real y visualizar información detallada junto con su tráiler oficial.

---

## 📽 Enlace EXPLICATIVO EN YOUTUBE
*https://youtu.be/zjT5DnzA5Vk?si=eJlYpgVn_-yd3d0p*

---

## ✨ Funcionalidades Principales

* **Catálogo de Películas Populares (`index.html`):** Carga dinámica de las películas más populares del momento mediante `Fetch` y `async/await`.
* **Paginación Integrada:** Navegación fluida (`Anterior` / `Siguiente`) tanto para el listado de películas populares como para los resultados de búsqueda.
* **Buscador con Debounce:** Barra de búsqueda que aplica un retraso de `500ms` (`debounce`) tras dejar de escribir para optimizar las consultas a la API y evitar peticiones innecesarias.
* **Vista de Detalles (`movie.html`):** Carga en paralelo mediante `Promise.all` para obtener simultáneamente la información general (título, sinopsis, fecha de estreno, géneros, calificación), el reparto principal y el tráiler oficial de YouTube.
* **Diseño Semántico y Responsivo:** Maquetación estructurada con etiquetas semánticas de HTML5 (`<header>`, `<main>`, `<section>`, `<article>`, `<nav>`) y diseño adaptable mediante CSS Grid/Flexbox.

---

## 🛠️ Tecnologías Utilizadas

* **HTML5** (Semántico y documentado)
* **CSS3** (CSS Grid / Flexbox / Responsive Design)
* **JavaScript (ES6+)** (`Fetch API`, `Async/Await`, `Promise.all`, `URLSearchParams`, `Debounce`)
* **API Externa:** [The Movie Database (TMDB) API v3](https://developers.themoviedb.org/3)

---

## 📂 Estructura del Proyecto

```text
├── index.html      # Vista principal: catálogo de populares, buscador y paginación
├── movie.html      # Vista de detalles de la película seleccionada
├── app.js          # Lógica de consumo de API, debounce, renderizado y paginación
├── movie.js        # Lógica de detalles con Promise.all y reproductor de tráiler
├── styles.css      # Estilos visuales y diseño responsivo
└── README.md       # Documentación del proyecto
