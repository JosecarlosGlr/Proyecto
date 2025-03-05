document.addEventListener("DOMContentLoaded", () => {
    const agentsContainer = document.getElementById("agents-container");
    const agentModal = document.getElementById("agentModal");
    const agentName = document.getElementById("agentName");
    const agentImage = document.getElementById("agentImage");
    const agentDescription = document.getElementById("agentDescription");
    const abilitiesList = document.getElementById("abilitiesList");
    const closeBtn = document.querySelector(".close-btn");
    const searchBar = document.getElementById("searchBar");
    const roleSelector = document.getElementById("roleSelector");

    let agentsData = [];

    // Obtener los agentes desde la API
    fetch("https://valorant-api.com/v1/agents?isPlayableCharacter=true")
        .then(response => response.json())
        .then(data => {
            agentsData = data.data; // Guardar los datos de los agentes
            displayAgents(agentsData); // Mostrar los agentes en la página
        })
        .catch(error => console.error("Error al obtener los agentes:", error));

    // Función para mostrar los agentes en la página
    function displayAgents(agents) {
        agentsContainer.innerHTML = ""; // Limpiar el contenedor
        agents.forEach(agent => {
            const agentCard = document.createElement("div");
            agentCard.classList.add("agent-card");

            agentCard.innerHTML = `
                <img src="${agent.displayIcon}" alt="${agent.displayName}">
                <h3>${agent.displayName}</h3>
            `;

            // Agregar el evento click para abrir el modal
            agentCard.addEventListener("click", () => openModal(agent));

            agentsContainer.appendChild(agentCard);
        });
    }

    // Función para abrir el modal con la información del agente
    function openModal(agent) {
        agentName.textContent = agent.displayName;
        agentImage.src = agent.fullPortrait;
        agentDescription.textContent = agent.description;

        // Mostrar las habilidades del agente
        abilitiesList.innerHTML = "";
        agent.abilities.forEach(ability => {
            const abilityItem = document.createElement("li");
            abilityItem.textContent = `${ability.displayName}: ${ability.description}`;
            abilitiesList.appendChild(abilityItem);
        });

        // Mostrar el modal
        agentModal.style.display = "block";
    }

    // Cerrar el modal cuando se hace clic en la 'X'
    closeBtn.addEventListener("click", () => {
        agentModal.style.display = "none";
    });

    // Cerrar el modal si se hace clic fuera del contenido del modal
    window.addEventListener("click", (event) => {
        if (event.target === agentModal) {
            agentModal.style.display = "none";
        }
    });

    // Función para filtrar agentes
    function filterAgents() {
        const searchTerm = searchBar.value.toLowerCase();
        const selectedRole = roleSelector.value;

        const filteredAgents = agentsData.filter(agent => {
            const matchesName = agent.displayName.toLowerCase().includes(searchTerm);
            const matchesRole = selectedRole ? agent.role.displayName === selectedRole : true;
            return matchesName && matchesRole;
        });

        displayAgents(filteredAgents); // Mostrar los agentes filtrados
    }

    // Filtrar cuando el usuario escribe en la barra de búsqueda
    searchBar.addEventListener("input", filterAgents);

    // Filtrar cuando el usuario selecciona un rol
    roleSelector.addEventListener("change", filterAgents);
});