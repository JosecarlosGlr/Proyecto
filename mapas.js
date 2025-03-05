document.addEventListener("DOMContentLoaded", () => {
    const mapsContainer = document.getElementById("maps-container");
    const mapModal = document.getElementById("mapModal");
    const mapName = document.getElementById("mapName");
    const mapImage = document.getElementById("mapImage");
    const mapDescription = document.getElementById("mapDescription");
    const closeBtn = document.querySelector(".close-btn");
    const searchBar = document.getElementById("searchBar");

    let mapsData = [];

    // Lista de mapas a excluir por nombre (puedes agregar más aquí)
    const excludedMaps = ["The Range", "Basic Training"];

    // Obtener los mapas desde la API
    fetch("https://valorant-api.com/v1/maps")
        .then(response => response.json())
        .then(data => {
            mapsData = data.data;

            // Filtrar los mapas para excluir los que están en la lista de excluidos
            mapsData = mapsData.filter(map => !excludedMaps.includes(map.displayName));

            displayMaps(mapsData); // Mostrar los mapas filtrados
        })
        .catch(error => console.error("Error al obtener los mapas:", error));

    // Función para mostrar los mapas en la página
    function displayMaps(maps) {
        mapsContainer.innerHTML = ""; // Limpiar el contenedor
        maps.forEach(map => {
            const mapCard = document.createElement("div");
            mapCard.classList.add("map-card");

            mapCard.innerHTML = `
                <img src="${map.splash}" alt="${map.displayName}">
                <h3>${map.displayName}</h3>
            `;

            // Agregar el evento click para abrir el modal
            mapCard.addEventListener("click", () => openModal(map));

            mapsContainer.appendChild(mapCard);
        });
    }

    // Función para abrir el modal con la información del mapa
    function openModal(map) {
        mapName.textContent = map.displayName;
        mapImage.src = map.displayIcon;
        mapDescription.textContent = map.description;

        // Mostrar el modal
        mapModal.style.display = "block";
    }

    // Cerrar el modal cuando se hace clic en la 'X'
    closeBtn.addEventListener("click", () => {
        mapModal.style.display = "none";
    });

    // Cerrar el modal si se hace clic fuera del contenido del modal
    window.addEventListener("click", (event) => {
        if (event.target === mapModal) {
            mapModal.style.display = "none";
        }
    });

    // Función para filtrar mapas
    function filterMaps() {
        const searchTerm = searchBar.value.toLowerCase();

        const filteredMaps = mapsData.filter(map => map.displayName.toLowerCase().includes(searchTerm));

        displayMaps(filteredMaps); // Mostrar los mapas filtrados
    }

    // Filtrar cuando el usuario escribe en la barra de búsqueda
    searchBar.addEventListener("input", filterMaps);
});