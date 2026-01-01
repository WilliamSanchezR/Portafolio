// Navbar scroll effect y Scroll to top button (consolidado para mejor rendimiento)
const navbar = document.querySelector('.navbar');
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', function() {
    const scrollY = window.scrollY;
    
    // Navbar effect
    if (scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Scroll to top button
    if (scrollY > 300) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
});

scrollTopBtn.addEventListener('click', function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});


// JavaScript para el portafolio dinámico

// =================================================================
// Archivo: assets/js/main.js
// Objetivo: Cargar y mostrar proyectos específicos desde GitHub
// Desarrollador: Estudiante de Programación con 5 meses de estudio
// =================================================================

// 1. CONFIGURACIÓN DEL PERFIL Y PROYECTOS
// -----------------------------------------------------------------

// Tu nombre de usuario de GitHub (¡CÁMBIALO POR EL TUYO!)
const GITHUB_USERNAME = "WilliamSanchezR"; 
// El ID del contenedor en el HTML donde se pintarán las tarjetas
const PROJECTS_CONTAINER_ID = "projects-container";
// La URL de la API de GitHub. Pedimos hasta 100 repositorios
// para asegurarnos de encontrar los 8 que queremos, ordenados por fecha de creación.
const API_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=created&per_page=100`; 

// LISTA DE PROYECTOS CLAVE:
// Repositorios reales que se mostrarán en el portafolio
const REPOSITORIES_TO_SHOW = [
    "VETWILLING",
    "TALLER-PRACTICO-HTML-CSS-JAVASCRIPT-DRIVEWAYS-RESPONSIVE",
    "TALLER-PRACTICO-JAVASCIRPT-ALGORTIMOS-NIVEL-INTERMEDIO-AVANZADO",
    "Backend-guiado-del-proyecto-Formativo-Vetwilling",
    "Proyecto-Formativo-Vetwilling",
    "Proyecto-de-practica-Reproductor-de-musica",
    "Proyecto-de-practica-CINESCAPE",
    "Base-Vehiculos-Dinamicos-Proyecto-de-practica"
];


// 2. FUNCIÓN PARA CREAR EL HTML DE CADA TARJETA
// -----------------------------------------------------------------

/**
 * Genera la estructura HTML de una tarjeta de proyecto.
 * @param {object} repo - Objeto de repositorio devuelto por la API de GitHub.
 */
function createProjectCard(repo) {
    // Definimos el enlace al código en GitHub
    const repoLink = repo.html_url;
    // Creamos un título más limpio reemplazando los guiones
    const projectTitle = repo.name.replace(/-/g, ' ');

    // Si no hay descripción, ponemos un texto por defecto
    const projectDescription = repo.description || "Este es un proyecto importante desarrollado en mi proceso de formación.";
    
    // Lógica simple para seleccionar un icono basado en el lenguaje principal
    let langIcon = "bi bi-code-slash"; // Icono por defecto (Bootstrap Icons)
    if (repo.language === "JavaScript") {
        langIcon = "bi bi-filetype-js";
    } else if (repo.language === "HTML") {
        langIcon = "bi bi-filetype-html";
    } else if (repo.language === "CSS") {
        langIcon = "bi bi-filetype-css";
    } else if (repo.language === "PHP") {
        langIcon = "bi bi-filetype-php";
    } else if (repo.language === "Python") {
        langIcon = "bi bi-filetype-py";
    } 

    // Usamos backticks (``) para escribir el HTML de forma multilinea
    const cardHTML = `
        <div class="project-card">
            <div class="card-header">
                <div class="project-placeholder">
                    <i class="${langIcon}"></i>
                </div>
                <a href="${repoLink}" target="_blank" title="Ver Código en GitHub">
                    <i class="bi bi-github"></i>
                </a>
            </div>
            <div class="card-body">
                <p class="update-info">Actualizado: ${new Date(repo.updated_at).toLocaleDateString()}</p> 
                <h3>${projectTitle}</h3>
                <p class="project-description">${projectDescription}</p>
            </div>
            <div class="card-footer">
                <span class="language-tag">${repo.language || 'Sin especificar'}</span>
                <span class="stars"><i class="bi bi-star-fill"></i> ${repo.stargazers_count}</span>
            </div>
        </div>
    `;

    return cardHTML;
}

// 3. FUNCIÓN PRINCIPAL PARA CARGAR LOS PROYECTOS
// -----------------------------------------------------------------

function fetchGitHubProjects() {
    // Obtenemos el contenedor del HTML usando su ID
    const container = document.getElementById(PROJECTS_CONTAINER_ID);

    if (!container) {
        console.error("Error: El contenedor de proyectos no existe en el HTML.");
        return;
    }

    // Iniciamos la solicitud a la API de GitHub
    fetch(API_URL)
        .then(response => {
            // Si la respuesta no es exitosa (ej: error 404), lanzamos un error
            if (!response.ok) {
                throw new Error(`Error de red: ${response.status}`);
            }
            // Transformamos los datos recibidos a un formato que JavaScript entiende (JSON)
            return response.json();
        })
        .then(data => {
            // Limpiamos el mensaje de "cargando..."
            container.innerHTML = ''; 

            // Filtramos la lista de proyectos que GitHub nos dio
            const filteredProjects = data.filter(repo => {
                // 1. Verificamos si el nombre del repo está en nuestra lista de 8 deseados
                const isProjectToShow = REPOSITORIES_TO_SHOW.includes(repo.name);
                
                // 2. Además, aseguramos que no sea una copia (fork)
                const isNotFork = !repo.fork;

                return isProjectToShow && isNotFork;
            });
            
            // 🚀 OPCIONAL: Si queremos mostrar EXACTAMENTE 8, podríamos cortar la lista aquí,
            // pero con el filtro anterior ya solo tendremos los que queremos.
            
            if (filteredProjects.length > 0) {
                // Iteramos sobre los proyectos filtrados para crear y añadir las tarjetas
                filteredProjects.forEach(repo => {
                    const cardHTML = createProjectCard(repo);
                    // Agregamos el HTML al contenedor
                    container.innerHTML += cardHTML;
                });

            } else {
                // Mensaje si no se encuentra ninguno de los proyectos listados
                container.innerHTML = '<p>No se encontraron los proyectos específicos listados. Revisa que los nombres en el código (REPOSITORIES_TO_SHOW) coincidan exactamente con tu GitHub.</p>';
            }
        })
        .catch(error => {
            // Mensaje de error si la API falla
            console.error("Fallo al obtener los proyectos de GitHub:", error);
            container.innerHTML = `<p>Error al cargar los proyectos: ${error.message}</p>`;
        });
}

// 4. INICIO DE LA APLICACIÓN
// -----------------------------------------------------------------

// Cuando todo el documento HTML esté cargado, llamamos a la función principal
document.addEventListener('DOMContentLoaded', fetchGitHubProjects);


// 5. CÓDIGO DEL BOTÓN SCROLL TO TOP (Mantener si ya lo tienes)
// -----------------------------------------------------------------

const scrollTopButton = document.getElementById('scrollTop');
if (scrollTopButton) {
    window.addEventListener('scroll', () => {
        // Muestra el botón si el usuario se ha desplazado más de 300px
        if (window.scrollY > 300) {
            scrollTopButton.style.display = 'flex';
        } else {
            scrollTopButton.style.display = 'none';
        }
    });

    scrollTopButton.addEventListener('click', () => {
        // Desplaza la ventana al inicio con una animación suave
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}