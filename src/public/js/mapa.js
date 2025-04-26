// Mapa de donaciones - BloodConnect
// Script para la gestión del mapa interactivo de centros de donación

document.addEventListener('DOMContentLoaded', function() {
    // Inicialización de variables
    let map;
    let markers = [];
    let infoWindow;
    let currentInfoWindow;
    let allCenters = [];
    let filteredCenters = [];

    // Elementos DOM
    const mapElement = document.getElementById('map');
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const resetFiltersBtn = document.getElementById('reset-filters');
    const urgencyCheckboxes = document.querySelectorAll('.urgency-filter input[type="checkbox"]');
    const bloodTypeCheckboxes = document.querySelectorAll('.blood-type-filter input[type="checkbox"]');
    const totalCountElement = document.getElementById('total-count');
    const urgentCountElement = document.getElementById('urgent-count');
    const nearbyCountElement = document.getElementById('nearby-count');

    // Configuración del mapa
    function initMap() {
        // Coordenadas iniciales (España)
        const initialPosition = [40.416775, -3.703790];
        
        // Crear el mapa
        map = L.map('map').setView(initialPosition, 6);
        
        // Añadir capa de mapa base (OpenStreetMap)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19
        }).addTo(map);
        
        // Cargar los datos de centros
        loadCentersData();
        
        // Intentar obtener la posición del usuario
        getUserLocation();
        
        // Configurar eventos
        setupEventListeners();
    }

    // Cargar datos de centros desde JSON
    function loadCentersData() {
        fetch('data/donation-centers.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al cargar los datos de centros');
                }
                return response.json();
            })
            .then(data => {
                allCenters = data;
                filteredCenters = [...allCenters];
                
                // Actualizar contadores
                updateCounters();
                
                // Mostrar los centros en el mapa
                displayCenters(allCenters);
            })
            .catch(error => {
                console.error('Error:', error);
                // En caso de error, cargar datos de ejemplo
                loadMockData();
            });
    }

    // Cargar datos de prueba en caso de error
    function loadMockData() {
        allCenters = [
            {
                id: 1,
                name: "Hospital Universitario La Paz",
                address: "Paseo de la Castellana, 261, 28046 Madrid",
                phone: "917 27 70 00",
                website: "http://www.madrid.org/hospitallapaz",
                hours: "Lunes a Viernes: 8:00 - 21:00, Sábados: 9:00 - 14:00",
                position: [40.4807, -3.6883],
                urgencyLevel: "high",
                bloodTypesNeeded: ["O-", "AB+", "B-"],
                lastUpdated: "2023-06-15T10:30:00"
            },
            {
                id: 2,
                name: "Centro de Transfusión de Madrid",
                address: "Avda. de la Democracia, s/n, 28032 Madrid",
                phone: "913 01 72 00",
                website: "http://www.madrid.org/cs/Satellite?pagename=CentroDonacionSangre/Page/Home_CDS",
                hours: "Lunes a Domingo: 10:00 - 20:00",
                position: [40.4211, -3.6128],
                urgencyLevel: "medium",
                bloodTypesNeeded: ["A+", "O+", "B+"],
                lastUpdated: "2023-06-14T16:45:00"
            },
            {
                id: 3,
                name: "Hospital Clínic de Barcelona",
                address: "Carrer de Villarroel, 170, 08036 Barcelona",
                phone: "932 27 54 00",
                website: "https://www.hospitalclinic.org/",
                hours: "Lunes a Viernes: 8:30 - 20:00, Sábados: 9:00 - 13:00",
                position: [41.3895, 2.1529],
                urgencyLevel: "low",
                bloodTypesNeeded: ["A-", "B+", "AB-"],
                lastUpdated: "2023-06-15T08:15:00"
            },
            {
                id: 4,
                name: "Hospital Universitario Virgen del Rocío",
                address: "Av. Manuel Siurot, s/n, 41013 Sevilla",
                phone: "955 01 20 00",
                website: "https://www.hospitaluvrocio.es/",
                hours: "Lunes a Viernes: 9:00 - 21:00",
                position: [37.3616, -5.9781],
                urgencyLevel: "high",
                bloodTypesNeeded: ["O-", "O+", "AB+"],
                lastUpdated: "2023-06-14T12:30:00"
            },
            {
                id: 5,
                name: "Hospital Universitario de Valencia",
                address: "Av. de Blasco Ibáñez, 17, 46010 València",
                phone: "961 97 35 00",
                website: "http://clinicomalvarrosa.san.gva.es/",
                hours: "Lunes a Viernes: 8:00 - 20:00, Sábados: 9:00 - 15:00",
                position: [39.4783, -0.3666],
                urgencyLevel: "medium",
                bloodTypesNeeded: ["A+", "B-", "O+"],
                lastUpdated: "2023-06-13T14:20:00"
            }
        ];
        
        filteredCenters = [...allCenters];
        
        // Actualizar contadores
        updateCounters();
        
        // Mostrar los centros en el mapa
        displayCenters(allCenters);
    }

    // Mostrar los centros en el mapa
    function displayCenters(centers) {
        // Limpiar marcadores existentes
        clearMarkers();
        
        // Añadir nuevos marcadores
        centers.forEach(center => {
            addMarker(center);
        });
    }

    // Añadir un marcador al mapa
    function addMarker(center) {
        // Determinar el icono según el nivel de urgencia
        const markerIcon = L.divIcon({
            className: `custom-marker urgency-${center.urgencyLevel}`,
            html: '<i class="fas fa-tint"></i>',
            iconSize: [30, 30]
        });
        
        // Crear marcador
        const marker = L.marker(center.position, {
            icon: markerIcon,
            title: center.name
        }).addTo(map);
        
        // Crear contenido del popup
        const popupContent = createPopupContent(center);
        
        // Asociar popup al marcador
        marker.bindPopup(popupContent);
        
        // Almacenar marcador
        markers.push(marker);
    }

    // Crear contenido HTML para el popup
    function createPopupContent(center) {
        const urgencyClass = `urgency-${center.urgencyLevel}`;
        const urgencyText = getUrgencyText(center.urgencyLevel);
        
        // Formatear los tipos de sangre necesarios
        const bloodTypesHTML = center.bloodTypesNeeded.map(type => 
            `<span class="blood-badge">${type}</span>`
        ).join('');
        
        // Formatear la fecha de última actualización
        const lastUpdated = new Date(center.lastUpdated);
        const formattedDate = lastUpdated.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        
        const formattedTime = lastUpdated.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
        });
        
        // Devolver HTML del popup
        return `
            <div class="map-popup">
                <h3>${center.name}</h3>
                <div class="popup-urgency ${urgencyClass}">
                    <i class="fas fa-exclamation-circle"></i>
                    <span>${urgencyText}</span>
                </div>
                <div class="popup-info">
                    <p><i class="fas fa-map-marker-alt"></i> ${center.address}</p>
                    <p><i class="fas fa-phone"></i> ${center.phone}</p>
                    <p><i class="fas fa-clock"></i> ${center.hours}</p>
                    <p><i class="fas fa-globe"></i> <a href="${center.website}" target="_blank">Sitio web</a></p>
                </div>
                <div class="popup-blood-types">
                    <h4>Tipos de sangre necesarios:</h4>
                    <div class="blood-types-list">
                        ${bloodTypesHTML}
                    </div>
                </div>
                <div class="popup-footer">
                    <p class="last-updated">Actualizado: ${formattedDate} ${formattedTime}</p>
                    <button class="btn-primary popup-btn">
                        <i class="fas fa-calendar-alt"></i> Reservar cita
                    </button>
                </div>
            </div>
        `;
    }

    // Obtener texto de urgencia basado en el nivel
    function getUrgencyText(level) {
        switch(level) {
            case 'high':
                return 'Urgencia alta';
            case 'medium':
                return 'Urgencia media';
            case 'low':
                return 'Urgencia baja';
            default:
                return 'Nivel de urgencia desconocido';
        }
    }

    // Limpiar todos los marcadores del mapa
    function clearMarkers() {
        markers.forEach(marker => {
            map.removeLayer(marker);
        });
        markers = [];
    }

    // Configurar los eventos
    function setupEventListeners() {
        // Evento de búsqueda
        if (searchForm) {
            searchForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const searchValue = searchInput.value.trim().toLowerCase();
                if (searchValue) {
                    searchCenters(searchValue);
                }
            });
        }
        
        // Evento para reiniciar filtros
        if (resetFiltersBtn) {
            resetFiltersBtn.addEventListener('click', resetFilters);
        }
        
        // Eventos para los filtros de urgencia
        urgencyCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', applyFilters);
        });
        
        // Eventos para los filtros de tipo de sangre
        bloodTypeCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', applyFilters);
        });
    }

    // Buscar centros por nombre o dirección
    function searchCenters(searchValue) {
        const results = allCenters.filter(center => {
            return center.name.toLowerCase().includes(searchValue) || 
                   center.address.toLowerCase().includes(searchValue);
        });
        
        filteredCenters = results;
        updateCounters();
        displayCenters(results);
        
        // Si hay resultados, hacer zoom al primer resultado
        if (results.length > 0) {
            map.setView(results[0].position, 12);
        }
    }

    // Aplicar filtros seleccionados
    function applyFilters() {
        // Obtener valores de filtros de urgencia seleccionados
        const selectedUrgencies = Array.from(urgencyCheckboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);
        
        // Obtener valores de filtros de tipo de sangre seleccionados
        const selectedBloodTypes = Array.from(bloodTypeCheckboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);
        
        // Filtrar centros
        let results = [...allCenters];
        
        // Aplicar filtro de urgencia si hay seleccionados
        if (selectedUrgencies.length > 0) {
            results = results.filter(center => selectedUrgencies.includes(center.urgencyLevel));
        }
        
        // Aplicar filtro de tipo de sangre si hay seleccionados
        if (selectedBloodTypes.length > 0) {
            results = results.filter(center => {
                return center.bloodTypesNeeded.some(type => selectedBloodTypes.includes(type));
            });
        }
        
        filteredCenters = results;
        updateCounters();
        displayCenters(results);
    }

    // Resetear todos los filtros
    function resetFilters() {
        // Limpiar campo de búsqueda
        if (searchInput) {
            searchInput.value = '';
        }
        
        // Desmarcar todos los checkboxes
        urgencyCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        
        bloodTypeCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // Mostrar todos los centros
        filteredCenters = [...allCenters];
        updateCounters();
        displayCenters(allCenters);
        
        // Resetear vista del mapa
        map.setView([40.416775, -3.703790], 6);
    }

    // Obtener la ubicación del usuario
    function getUserLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userLocation = [
                        position.coords.latitude,
                        position.coords.longitude
                    ];
                    
                    // Centrar mapa en ubicación del usuario
                    map.setView(userLocation, 10);
                    
                    // Añadir marcador de ubicación del usuario
                    const userMarker = L.marker(userLocation, {
                        icon: L.divIcon({
                            className: 'user-location-marker',
                            html: '<i class="fas fa-user-circle"></i>',
                            iconSize: [30, 30]
                        })
                    }).addTo(map);
                    
                    userMarker.bindPopup('<div class="user-popup"><strong>Tu ubicación</strong></div>').openPopup();
                    
                    // Calcular centros cercanos
                    calculateNearbyCenters(userLocation);
                },
                () => {
                    console.log('Error al obtener la ubicación del usuario');
                    // Mantener la vista predeterminada
                }
            );
        }
    }

    // Calcular centros cercanos al usuario
    function calculateNearbyCenters(userLocation) {
        // Determinar centros en un radio de 20km
        const nearbyCenters = allCenters.filter(center => {
            const distance = calculateDistance(
                userLocation[0], userLocation[1],
                center.position[0], center.position[1]
            );
            return distance <= 20; // 20 km
        });
        
        // Actualizar contador de centros cercanos
        if (nearbyCountElement) {
            nearbyCountElement.textContent = nearbyCenters.length;
        }
    }

    // Calcular distancia entre dos puntos (fórmula de Haversine)
    function calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Radio de la Tierra en km
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a = 
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c;
        return d;
    }

    // Convertir grados a radianes
    function toRad(value) {
        return value * Math.PI / 180;
    }

    // Actualizar contadores
    function updateCounters() {
        if (totalCountElement) {
            totalCountElement.textContent = allCenters.length;
        }
        
        if (urgentCountElement) {
            const urgentCount = allCenters.filter(center => center.urgencyLevel === 'high').length;
            urgentCountElement.textContent = urgentCount;
        }
    }

    // Inicializar el mapa
    initMap();
});