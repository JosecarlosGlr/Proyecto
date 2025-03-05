document.addEventListener("DOMContentLoaded", () => {
    const weaponsContainer = document.getElementById("weapons-container");
    const weaponModal = document.getElementById("weaponModal");
    const weaponName = document.getElementById("weaponName");
    const weaponImage = document.getElementById("weaponImage");
    const weaponCategory = document.getElementById("weaponCategory");
    const weaponDamage = document.getElementById("weaponDamage");
    const closeBtn = document.querySelector(".close-btn");
    const searchBar = document.getElementById("searchBar");

    let weaponsData = [];

    // Obtener las armas desde la API
    fetch("https://valorant-api.com/v1/weapons")
        .then(response => response.json())
        .then(data => {
            weaponsData = data.data; // Guardar los datos de las armas
            displayWeapons(weaponsData); // Mostrar armas en la página
        })
        .catch(error => console.error("Error al obtener las armas:", error));

    // Función para mostrar las armas en cajas dentro de la página
    function displayWeapons(weapons) {
        weaponsContainer.innerHTML = ""; // Limpiar contenedor

        weapons.forEach(weapon => {
            const weaponCard = document.createElement("div");
            weaponCard.classList.add("weapon-card");

            weaponCard.innerHTML = `
                <img src="${weapon.displayIcon}" alt="${weapon.displayName}">
                <h3>${weapon.displayName}</h3>
            `;

            // Agregar evento click para abrir el modal con detalles
            weaponCard.addEventListener("click", () => openModal(weapon));

            weaponsContainer.appendChild(weaponCard);
        });
    }

    // Función para abrir el modal con la información del arma seleccionada
    function openModal(weapon) {
        weaponName.textContent = weapon.displayName;
        weaponImage.src = weapon.displayIcon;
        weaponCategory.textContent = `Categoría: ${weapon.shopData ? weapon.shopData.category : "No disponible"}`;
        
        // Obtener el daño si está disponible
        if (weapon.weaponStats && weapon.weaponStats.damageRanges.length > 0) {
            let damage = weapon.weaponStats.damageRanges[0];
            weaponDamage.textContent = `Daño: ${damage.headDamage} (cabeza), ${damage.bodyDamage} (cuerpo), ${damage.legDamage} (piernas)`;
        } else {
            weaponDamage.textContent = "No hay información de daño disponible.";
        }

        // Mostrar modal
        weaponModal.style.display = "block";
    }

    // Cerrar modal cuando se haga clic en 'X'
    closeBtn.addEventListener("click", () => {
        weaponModal.style.display = "none";
    });

    // Cerrar modal si se hace clic fuera de él
    window.addEventListener("click", (event) => {
        if (event.target === weaponModal) {
            weaponModal.style.display = "none";
        }
    });

    // Filtrar armas por nombre
    function filterWeapons() {
        const searchTerm = searchBar.value.toLowerCase();
        const filteredWeapons = weaponsData.filter(weapon => 
            weapon.displayName.toLowerCase().includes(searchTerm)
        );
        displayWeapons(filteredWeapons);
    }

    // Evento de búsqueda en tiempo real
    searchBar.addEventListener("input", filterWeapons);
});