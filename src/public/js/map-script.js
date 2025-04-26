/**
 * BloodConnect - Mapa de Centros de Donación
 * Script para inicializar y gestionar el mapa de centros de donación usando Leaflet
 */

// Variables globales
let map;
let markers = [];
let userMarker = null;
let userLocation = null;
let donationCenters = [];
let filteredCenters = [];

// Elementos DOM
const mapElement = document.getElementById('map');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const resetFiltersBtn = document.getElementById('reset-filters');
const totalCountElement = document.getElementById('total-count');
const urgentCountElement = document.getElementById('urgent-count');
const nearbyCountElement = document.getElementById('nearby-count');

// Iconos personalizados para marcadores
const centerIcon = L.icon({
    iconUrl: '../images/marker-center.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});

const urgentIcon = L.icon({
    iconUrl: '../images/marker-urgent.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});

const mobileUnitIcon = L.icon({
    iconUrl: '../images/marker-mobile.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});

const userIcon = L.icon({
    iconUrl: '../images/marker-user.png',
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24]
});

// Datos simulados de centros de donación
// En una aplicación real, estos datos vendrían de una API
const simulatedCenters = [
    {
        id: 1,
        name: "Hospital Universitario La Paz",
        address: "Paseo de la Castellana, 261, 28046 Madrid",
        coords: [40.4806, -3.6873],
        phone: "914 56 78 90",
        website: "https://www.comunidad.madrid/hospital/lapaz",
        urgency: "high",
        bloodTypes: ["A+", "O-", "B+"],
        schedule: "Lun-Vie: 8:30 - 20:00, Sáb: 9:00 - 14:00",
        isMobileUnit: false
    },
    {
        id: 2,
        name: "Centro de Transfusión de la Comunidad de Madrid",
        address: "Avda. de la Democracia s/n, 28032 Madrid",
        coords: [40.4297, -3.6214],
        phone: "913 01 72 30",
        website: "http://www.madrid.org/cs/Satellite?pagename=CentroTransfusion/Page/CTRS_home",
        urgency: "medium",
        bloodTypes: ["O+", "A+", "AB-"],
        schedule: "Lun-Dom: 9:00 - 21:00",
        isMobileUnit: false
    },
    {
        id: 3,
        name: "Hospital Universitario 12 de Octubre",
        address: "Av. de Córdoba, s/n, 28041 Madrid",
        coords: [40.3753, -3.6968],
        phone: "913 90 80 00",
        website: "https://www.comunidad.madrid/hospital/12octubre/",
        urgency: "low",
        bloodTypes: ["B-", "AB+", "O+"],
        schedule: "Lun-Vie: 9:00 - 20:00",
        isMobileUnit: false
    },
    {
        id: 4,
        name: "Hospital Universitario Puerta de Hierro",
        address: "Calle Manuel de Falla, 1, 28222 Majadahonda, Madrid",
        coords: [40.4483, -3.8713],
        phone: "911 91 60 00",
        website: "https://www.comunidad.madrid/hospital/puertadehierro/",
        urgency: "high",
        bloodTypes: ["O-", "AB-"],
        schedule: "Lun-Vie: 8:00 - 21:00, Sáb: 10:00 - 14:00",
        isMobileUnit: false
    },
    {
        id: 5,
        name: "Hospital Clínico San Carlos",
        address: "Calle del Prof Martín Lagos, s/n, 28040 Madrid",
        coords: [40.4408, -3.7178],
        phone: "913 30 30 01",
        website: "https://www.comunidad.madrid/hospital/clinicosancarlos/",
        urgency: "medium",
        bloodTypes: ["A+", "O+", "B+"],
        schedule: "Lun-Vie: 9:00 - 20:00",
        isMobileUnit: false
    },
    {
        id: 6,
        name: "Unidad Móvil - Plaza Mayor",
        address: "Plaza Mayor, 28012 Madrid",
        coords: [40.4153, -3.7074],
        phone: "900 123 456",
        website: "https://www.bloodconnect.org/mobile",
        urgency: "high",
        bloodTypes: ["All"],
        schedule: "Hoy: 10:00 - 19:00",
        isMobileUnit: true
    },
    {
        id: 7,
        name: "Unidad Móvil - Universidad Complutense",
        address: "Av. Complutense, 28040 Madrid",
        coords: [40.4469, -3.7280],
        phone: "900 123 456",
        website: "https://www.bloodconnect.org/mobile",
        urgency: "medium",
        bloodTypes: ["All"],
        schedule: "Hoy: 9:30 - 14:30",
        isMobileUnit: true
    },
    {
        id: 8,
        name: "Hospital Universitario La Princesa",
        address: "Calle de Diego de León, 62, 28006 Madrid",
        coords: [40.4331, -3.6739],
        phone: "915 20 22 00",
        website: "https://www.comunidad.madrid/hospital/laprincesa/",
        urgency: "low",
        bloodTypes: ["A-", "B+", "AB+"],
        schedule: "Lun-Vie: 8:30 - 19:00",
        isMobileUnit: false
    }
];

// Inicializar el mapa
function initMap() {
    // Crear mapa centrado en España
    map = L.map('map').setView([40.416775, -3.703790], 10);
    
    // Añadir capa de mapa base (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Cargar datos de centros de donación
    loadDonationCenters();
    
    // Mostrar ubicación del usuario
    getUserLocation();
}

// Cargar datos de centros de donación
function loadDonationCenters() {
    // En una aplicación real, esto sería una llamada a una API
    donationCenters = simulatedCenters;
    filteredCenters = [...donationCenters];
    
    // Mostrar centros en el mapa
    displayCenters(donationCenters);
    
    // Actualizar contadores
    updateCounters();
}

// Obtener ubicación del usuario
function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                userLocation = [position.coords.latitude, position.coords.longitude];
                addUserMarker(userLocation);
                
                // Calcular distancias a los centros
                calculateDistances();
                
                // Actualizar contador de centros cercanos
                updateNearbyCounter();
            },
            (error) => {
                console.error("Error obteniendo la ubicación:", error);
            }
        );
    } else {
        console.log("Geolocalización no soportada por este navegador");
    }
}

// Añadir marcador de usuario
function addUserMarker(location) {
    // Eliminar marcador anterior si existe
    if (userMarker) {
        map.removeLayer(userMarker);
    }
    
    // Añadir nuevo marcador
    userMarker = L.marker(location, { icon: userIcon }).addTo(map);
    userMarker.bindPopup("<strong>Tu ubicación</strong>").openPopup();
    
    // Centrar mapa en la ubicación del usuario
    map.setView(location, 11);
}

// Calcular distancias a los centros
function calculateDistances() {
    if (!userLocation) return;
    
    donationCenters.forEach(center => {
        const distance = map.distance(userLocation, center.coords) / 1000; // en km
        center.distance = Math.round(distance * 10) / 10; // redondear a 1 decimal
    });
}

// Mostrar centros en el mapa
function displayCenters(centers) {
    // Limpiar marcadores anteriores
    clearMarkers();
    
    // Añadir nuevos marcadores
    centers.forEach(center => {
        // Seleccionar icono según urgencia y tipo
        let icon;
        if (center.isMobileUnit) {
            icon = mobileUnitIcon;
        } else if (center.urgency === 'high') {
            icon = urgentIcon;
        } else {
            icon = centerIcon;
        }
        
        // Crear marcador
        const marker = L.marker(center.coords, { icon: icon }).addTo(map);
        
        // Crear contenido del popup
        const popupContent = createPopupContent(center);
        
        // Añadir popup al marcador
        marker.bindPopup(popupContent);
        
        // Guardar referencia al marcador
        markers.push(marker);
    });
}

// Crear contenido del popup
function createPopupContent(center) {
    // Clase de urgencia para el estilo
    const urgencyClass = `urgency-${center.urgency}`;
    
    // Etiqueta de urgencia
    let urgencyLabel;
    switch(center.urgency) {
        case 'high':
            urgencyLabel = 'Alta urgencia';
            break;
        case 'medium':
            urgencyLabel = 'Urgencia media';
            break;
        case 'low':
            urgencyLabel = 'Baja urgencia';
            break;
        default:
            urgencyLabel = 'Urgencia no especificada';
    }
    
    // Texto de distancia (si está disponible)
    const distanceText = center.distance 
        ? `<p class="center-distance"><i class="fas fa-map-marker-alt"></i> A ${center.distance} km de ti</p>` 
        : '';
    
    // Texto de tipos de sangre necesarios
    const bloodTypesText = center.bloodTypes.map(type => 
        `<span class="blood-type-badge">${type}</span>`
    ).join(' ');
    
    // Crear HTML del popup
    return `
        <div class="center-popup">
            <h3>${center.name}</h3>
            <p class="center-address"><i class="fas fa-location-dot"></i> ${center.address}</p>
            ${distanceText}
            <div class="center-schedule">
                <i class="fas fa-clock"></i> ${center.schedule}
            </div>
            <div class="center-urgency ${urgencyClass}">
                <i class="fas fa-exclamation-circle"></i> ${urgencyLabel}
            </div>
            <div class="center-blood-types">
                <p>Tipos de sangre necesarios:</p>
                <div class="blood-types-badges">
                    ${bloodTypesText}
                </div>
            </div>
            <div class="center-contact">
                <p><i class="fas fa-phone"></i> <a href="tel:${center.phone}">${center.phone}</a></p>
                <p><i class="fas fa-globe"></i> <a href="${center.website}" target="_blank">Sitio web</a></p>
            </div>
            <div class="center-actions">
                <button class="btn-primary btn-sm" onclick="getDirections(${center.coords[0]}, ${center.coords[1]})">
                    <i class="fas fa-directions"></i> Cómo llegar
                </button>
                <button class="btn-secondary btn-sm" onclick="scheduleAppointment(${center.id})">
                    <i class="fas fa-calendar-alt"></i> Pedir cita
                </button>
            </div>
        </div>
    `;
}

// Limpiar marcadores
function clearMarkers() {
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];
}

// Actualizar contadores
function updateCounters() {
    totalCountElement.textContent = donationCenters.length;
    
    const urgentCenters = donationCenters.filter(center => center.urgency === 'high');
    urgentCountElement.textContent = urgentCenters.length;
    
    updateNearbyCounter();
}

// Actualizar contador de centros cercanos
function updateNearbyCounter() {
    if (userLocation) {
        const nearbyCenters = donationCenters.filter(center => center.distance && center.distance <= 5);
        nearbyCountElement.textContent = nearbyCenters.length;
    } else {
        nearbyCountElement.textContent = '—';
    }
}

// Buscar centros
function searchCenters(query) {
    if (!query) {
        resetFilters();
        return;
    }
    
    query = query.toLowerCase();
    
    filteredCenters = donationCenters.filter(center => 
        center.name.toLowerCase().includes(query) || 
        center.address.toLowerCase().includes(query)
    );
    
    displayCenters(filteredCenters);
}

// Aplicar filtros
function applyFilters() {
    // Obtener filtros de urgencia seleccionados
    const urgencyFilters = Array.from(document.querySelectorAll('.urgency-filter input:checked'))
        .map(input => input.value);
    
    // Obtener filtros de tipos de sangre seleccionados
    const bloodTypeFilters = Array.from(document.querySelectorAll('.blood-type-filter input:checked'))
        .map(input => input.value);
    
    // Resetear a todos los centros si no hay filtros
    if (urgencyFilters.length === 0 && bloodTypeFilters.length === 0) {
        filteredCenters = [...donationCenters];
        displayCenters(filteredCenters);
        return;
    }
    
    // Filtrar por urgencia y tipo de sangre
    filteredCenters = donationCenters.filter(center => {
        // Si hay filtros de urgencia y el centro no coincide, filtrar
        if (urgencyFilters.length > 0 && !urgencyFilters.includes(center.urgency)) {
            return false;
        }
        
        // Si hay filtros de tipo de sangre y el centro no tiene ninguno, filtrar
        if (bloodTypeFilters.length > 0) {
            // Centros que necesitan todos los tipos de sangre siempre coinciden
            if (center.bloodTypes.includes('All')) {
                return true;
            }
            
            // Verificar si el centro necesita alguno de los tipos filtrados
            const hasMatchingBloodType = bloodTypeFilters.some(type => 
                center.bloodTypes.includes(type)
            );
            
            if (!hasMatchingBloodType) {
                return false;
            }
        }
        
        return true;
    });
    
    displayCenters(filteredCenters);
}

// Resetear filtros
function resetFilters() {
    // Desmarcar todos los checkboxes
    document.querySelectorAll('.filter-group input[type="checkbox"]').forEach(
        checkbox => checkbox.checked = false
    );
    
    // Limpiar campo de búsqueda
    searchInput.value = '';
    
    // Mostrar todos los centros
    filteredCenters = [...donationCenters];
    displayCenters(filteredCenters);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar mapa cuando se cargue la página
    initMap();
    
    // Listener para formulario de búsqueda
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            searchCenters(searchInput.value.trim());
        });
    }
    
    // Listener para botón de reset
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', resetFilters);
    }
    
    // Listeners para checkboxes de filtros
    document.querySelectorAll('.filter-group input[type="checkbox"]').forEach(
        checkbox => checkbox.addEventListener('change', applyFilters)
    );
});

// Función global para obtener direcciones (para usar desde el popup)
function getDirections(lat, lng) {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
}

// Función global para programar una cita (para usar desde el popup)
function scheduleAppointment(centerId) {
    // En una aplicación real, esto podría abrir un modal o redirigir a una página de citas
    const center = donationCenters.find(c => c.id === centerId);
    if (center) {
        alert(`Redirigiendo al sistema de citas para ${center.name}. Esta funcionalidad estaría conectada con el sistema de gestión de citas.`);
    }
}