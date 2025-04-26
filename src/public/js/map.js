// Variables globales
let map;
let markers = [];
let userMarker = null;
let infoWindow = null;
let bounds;
let userPosition = null;
let allLocations = [];

// Configuración inicial
const mapSettings = {
    zoom: 13,
    defaultLocation: { lat: 40.416775, lng: -3.703790 }, // Madrid como ubicación predeterminada
    styles: [
        {
            "featureType": "administrative",
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#444444" }]
        },
        {
            "featureType": "landscape",
            "elementType": "all",
            "stylers": [{ "color": "#f2f2f2" }]
        },
        {
            "featureType": "poi",
            "elementType": "all",
            "stylers": [{ "visibility": "off" }]
        },
        {
            "featureType": "road",
            "elementType": "all",
            "stylers": [{ "saturation": -100 }, { "lightness": 45 }]
        },
        {
            "featureType": "road.highway",
            "elementType": "all",
            "stylers": [{ "visibility": "simplified" }]
        },
        {
            "featureType": "road.arterial",
            "elementType": "labels.icon",
            "stylers": [{ "visibility": "off" }]
        },
        {
            "featureType": "transit",
            "elementType": "all",
            "stylers": [{ "visibility": "off" }]
        },
        {
            "featureType": "water",
            "elementType": "all",
            "stylers": [{ "color": "#e9e9e9" }, { "visibility": "on" }]
        }
    ]
};

// Datos de muestra - En un entorno real, estos datos vendrían de una API
const sampleLocations = [
    {
        id: 1,
        name: "Hospital Universitario La Paz",
        address: "Paseo de la Castellana, 261, 28046 Madrid",
        position: { lat: 40.4815, lng: -3.6866 },
        urgencyLevel: "high",
        bloodTypes: ["A+", "O+", "AB-", "B-"],
        description: "Necesidad urgente de donantes de sangre para intervenciones quirúrgicas programadas.",
        phone: "91 727 70 00",
        openingHours: "24 horas, todos los días",
        distance: 2.5
    },
    {
        id: 2,
        name: "Centro de Transfusión",
        address: "Avda. de la Democracia s/n, 28032 Madrid",
        position: { lat: 40.4276, lng: -3.6237 },
        urgencyLevel: "medium",
        bloodTypes: ["A+", "A-", "O+", "O-"],
        description: "Centro principal de transfusión de la Comunidad de Madrid. Se necesitan donantes de todos los grupos.",
        phone: "91 301 72 45",
        openingHours: "Lun-Vie: 8:00-21:00, Sáb-Dom: 9:00-14:00",
        distance: 5.1
    },
    {
        id: 3,
        name: "Hospital Clínico San Carlos",
        address: "Calle del Prof Martín Lagos, s/n, 28040 Madrid",
        position: { lat: 40.4406, lng: -3.7174 },
        urgencyLevel: "low",
        bloodTypes: ["B+", "B-", "O+"],
        description: "Donaciones de sangre para mantenimiento de reservas de banco de sangre.",
        phone: "91 330 30 00",
        openingHours: "Lun-Vie: 8:30-20:00, Sáb: 9:00-14:00",
        distance: 3.7
    },
    {
        id: 4,
        name: "Hospital General Universitario Gregorio Marañón",
        address: "Calle del Dr. Esquerdo, 46, 28007 Madrid",
        position: { lat: 40.4185, lng: -3.6738 },
        urgencyLevel: "high",
        bloodTypes: ["AB+", "AB-", "B+", "O-"],
        description: "Necesidad crítica de donantes para el área de oncología y trasplantes.",
        phone: "91 586 80 00",
        openingHours: "Lun-Vie: 8:00-21:00, Sáb: 9:00-15:00",
        distance: 1.9
    },
    {
        id: 5,
        name: "Hospital Universitario 12 de Octubre",
        address: "Av. de Córdoba, s/n, 28041 Madrid",
        position: { lat: 40.3752, lng: -3.7025 },
        urgencyLevel: "medium",
        bloodTypes: ["A+", "O+", "O-"],
        description: "Se necesitan donaciones regulares para mantener los niveles del banco de sangre.",
        phone: "91 390 80 00",
        openingHours: "Lun-Dom: 8:00-21:00",
        distance: 6.2
    },
    {
        id: 6,
        name: "Unidad Móvil - Plaza Mayor",
        address: "Plaza Mayor, 28012 Madrid",
        position: { lat: 40.4155, lng: -3.7074 },
        urgencyLevel: "low",
        bloodTypes: ["Todos los grupos"],
        description: "Unidad móvil disponible este fin de semana. No es necesaria cita previa.",
        phone: "900 30 35 30",
        openingHours: "Sáb-Dom: 10:00-20:00",
        distance: 0.8
    }
];

// Iniciar el mapa de Google
function initMap() {
    // Crear el mapa
    map = new google.maps.Map(document.getElementById('map'), {
        center: mapSettings.defaultLocation,
        zoom: mapSettings.zoom,
        styles: mapSettings.styles,
        mapTypeControl: false,
        fullscreenControl: true,
        streetViewControl: false,
        zoomControl: true,
        zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_CENTER
        }
    });

    // Crear ventana de información
    infoWindow = new google.maps.InfoWindow();

    // Obtener ubicación del usuario
    getUserLocation();

    // Cargar todos los puntos de donación (en un entorno real, estos se obtendrían de una API)
    loadDonationLocations(sampleLocations);

    // Configurar filtros y eventos
    setupFilterEvents();
    setupSearchEvent();
    updateStats();

    // Inicializar la interfaz responsive
    initializeResponsiveUI();
}

// Obtener ubicación del usuario
function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                userPosition = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                // Crear marcador del usuario
                addUserMarker(userPosition);

                // Centrar mapa en la posición del usuario
                map.setCenter(userPosition);

                // Actualizar distancias a los puntos de donación
                updateDistances();

                // Actualizar estadísticas
                updateStats();
            },
            () => {
                // Error o permiso denegado
                console.log("Error al obtener la ubicación del usuario");
            }
        );
    } else {
        console.log("Geolocalización no soportada por este navegador");
    }
}

// Añadir marcador de usuario
function addUserMarker(position) {
    // Eliminar marcador anterior si existe
    if (userMarker) {
        userMarker.setMap(null);
    }

    // Crear nuevo marcador
    userMarker = new google.maps.Marker({
        position: position,
        map: map,
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: "#3498db",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 2
        },
        title: "Tu ubicación",
        zIndex: 999
    });

    // Añadir evento click
    userMarker.addListener("click", () => {
        infoWindow.setContent("<div class='custom-info-window'><strong>Tu ubicación actual</strong></div>");
        infoWindow.open(map, userMarker);
    });
}

// Cargar ubicaciones de donación
function loadDonationLocations(locations) {
    // Guardar todas las ubicaciones
    allLocations = locations;

    // Límites del mapa para ajustarlo
    bounds = new google.maps.LatLngBounds();

    // Añadir las ubicaciones al mapa
    locations.forEach(location => {
        addMarker(location);
        bounds.extend(location.position);
    });

    // Si hay ubicación de usuario, añadirla a los límites
    if (userPosition) {
        bounds.extend(userPosition);
    }

    // Ajustar el mapa a los límites
    map.fitBounds(bounds);
}

// Añadir un marcador al mapa
function addMarker(location) {
    // Determinar ícono según nivel de urgencia
    const markerIcon = {
        path: "M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z",
        fillColor: getUrgencyColor(location.urgencyLevel),
        fillOpacity: 1,
        strokeWeight: 1,
        strokeColor: "#FFFFFF",
        scale: 2,
        anchor: new google.maps.Point(12, 22)
    };

    // Crear marcador
    const marker = new google.maps.Marker({
        position: location.position,
        map: map,
        icon: markerIcon,
        title: location.name,
        animation: google.maps.Animation.DROP
    });

    // Almacenar datos del marcador para filtrado
    marker.locationData = location;

    // Añadir evento click
    marker.addListener("click", () => {
        // Construir contenido de la ventana de información
        const content = createInfoWindowContent(location);
        infoWindow.setContent(content);
        infoWindow.open(map, marker);
    });

    // Añadir a array de marcadores
    markers.push(marker);
}

// Crear contenido para la ventana de información
function createInfoWindowContent(location) {
    // Formatear tipos de sangre
    let bloodTypesHtml = '';
    if (Array.isArray(location.bloodTypes)) {
        bloodTypesHtml = location.bloodTypes.map(type => 
            `<span class="badge blood-type">${type}</span>`
        ).join('');
    } else {
        bloodTypesHtml = `<span class="badge blood-type">${location.bloodTypes}</span>`;
    }

    // Determinar clase y texto según urgencia
    const urgencyClass = `urgency-${location.urgencyLevel}`;
    const urgencyText = location.urgencyLevel === 'high' 
        ? 'Alta urgencia' 
        : location.urgencyLevel === 'medium' 
            ? 'Urgencia media' 
            : 'Baja urgencia';

    // Crear el HTML
    return `
        <div class="custom-info-window">
            <h3>${location.name}</h3>
            <p class="address"><i class="fas fa-map-marker-alt"></i> ${location.address}</p>
            <p class="phone"><i class="fas fa-phone"></i> ${location.phone}</p>
            <p class="hours"><i class="far fa-clock"></i> ${location.openingHours}</p>
            <div class="urgency ${urgencyClass}">${urgencyText}</div>
            <div class="blood-types-needed">
                <p>Tipos de sangre necesarios:</p>
                <div class="blood-type-badges">${bloodTypesHtml}</div>
            </div>
            <p class="description">${location.description}</p>
            <div class="actions">
                <button class="btn-primary directions-btn" onclick="getDirections(${location.position.lat}, ${location.position.lng})">
                    <i class="fas fa-directions"></i> Cómo llegar
                </button>
                <button class="btn-secondary schedule-btn" onclick="scheduleAppointment(${location.id})">
                    <i class="far fa-calendar-alt"></i> Cita previa
                </button>
            </div>
        </div>
    `;
}

// Obtener color según nivel de urgencia
function getUrgencyColor(level) {
    switch(level) {
        case 'high':
            return '#e74c3c'; // Rojo
        case 'medium':
            return '#f39c12'; // Naranja
        case 'low':
            return '#2ecc71'; // Verde
        default:
            return '#3498db'; // Azul
    }
}

// Actualizar distancias desde la ubicación del usuario
function updateDistances() {
    if (!userPosition) return;

    allLocations.forEach(location => {
        location.distance = calculateDistance(
            userPosition.lat, userPosition.lng,
            location.position.lat, location.position.lng
        );
    });

    // Ordenar localizaciones por distancia
    allLocations.sort((a, b) => a.distance - b.distance);
}

// Calcular distancia entre dos puntos (fórmula de Haversine)
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return parseFloat(distance.toFixed(1));
}

// Configurar eventos de filtros
function setupFilterEvents() {
    // Filtros de urgencia
    document.querySelectorAll('.urgency-filter input').forEach(checkbox => {
        checkbox.addEventListener('change', filterMarkers);
    });

    // Filtros de tipo de sangre
    document.querySelectorAll('.blood-type-filter input').forEach(checkbox => {
        checkbox.addEventListener('change', filterMarkers);
    });

    // Botón de reseteo
    document.getElementById('reset-filters').addEventListener('click', resetFilters);
}

// Configurar evento de búsqueda
function setupSearchEvent() {
    const searchForm = document.getElementById('search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const searchTerm = document.getElementById('search-input').value.toLowerCase();
            filterBySearchTerm(searchTerm);
        });
    }
}

// Filtrar marcadores según los filtros seleccionados
function filterMarkers() {
    // Obtener valores de los filtros
    const selectedUrgencies = Array.from(document.querySelectorAll('.urgency-filter input:checked')).map(cb => cb.value);
    const selectedBloodTypes = Array.from(document.querySelectorAll('.blood-type-filter input:checked')).map(cb => cb.value);

    // Mostrar u ocultar marcadores según los filtros
    markers.forEach(marker => {
        const location = marker.locationData;
        let showMarker = true;

        // Filtrar por urgencia
        if (selectedUrgencies.length > 0 && !selectedUrgencies.includes(location.urgencyLevel)) {
            showMarker = false;
        }

        // Filtrar por tipo de sangre
        if (showMarker && selectedBloodTypes.length > 0) {
            let hasMatchingBloodType = false;
            
            // Comprobar si alguno de los tipos de sangre seleccionados está en la localización
            if (Array.isArray(location.bloodTypes)) {
                hasMatchingBloodType = location.bloodTypes.some(type => selectedBloodTypes.includes(type));
            } else if (location.bloodTypes === "Todos los grupos") {
                hasMatchingBloodType = true;
            }
            
            if (!hasMatchingBloodType) {
                showMarker = false;
            }
        }

        // Aplicar visibilidad
        marker.setVisible(showMarker);
    });

    // Actualizar estadísticas
    updateStats();
}

// Filtrar por término de búsqueda
function filterBySearchTerm(term) {
    let foundAny = false;
    
    markers.forEach(marker => {
        const location = marker.locationData;
        const matchesSearch = 
            location.name.toLowerCase().includes(term) || 
            location.address.toLowerCase().includes(term) ||
            location.description.toLowerCase().includes(term);
        
        marker.setVisible(matchesSearch);
        
        if (matchesSearch) {
            foundAny = true;
            // Si es la primera coincidencia, centramos el mapa allí
            if (!foundAny) {
                map.panTo(marker.getPosition());
                map.setZoom(14);
            }
        }
    });
    
    // Si no se encuentra ninguna coincidencia, mostrar mensaje
    if (!foundAny) {
        alert("No se encontraron resultados para: " + term);
        resetFilters(); // Restaurar todos los marcadores
    }

    // Actualizar estadísticas
    updateStats();
}

// Reiniciar todos los filtros
function resetFilters() {
    // Desmarcar todos los checkboxes
    document.querySelectorAll('.filter-group input').forEach(checkbox => {
        checkbox.checked = false;
    });

    // Limpiar campo de búsqueda
    if (document.getElementById('search-input')) {
        document.getElementById('search-input').value = '';
    }

    // Mostrar todos los marcadores
    markers.forEach(marker => {
        marker.setVisible(true);
    });

    // Ajustar el mapa para mostrar todos los marcadores
    if (bounds) {
        map.fitBounds(bounds);
    }

    // Actualizar estadísticas
    updateStats();
}

// Actualizar estadísticas en la parte superior
function updateStats() {
    // Contar marcadores visibles
    const visibleMarkers = markers.filter(marker => marker.getVisible());
    
    // Contar por nivel de urgencia
    const urgentCount = visibleMarkers.filter(marker => 
        marker.locationData.urgencyLevel === 'high'
    ).length;
    
    // Actualizar contadores en la UI
    document.getElementById('total-count').textContent = visibleMarkers.length;
    document.getElementById('urgent-count').textContent = urgentCount;
    
    // Si tenemos ubicación de usuario, actualizar los centros cercanos
    if (userPosition) {
        // Filtrar centros visibles a menos de 5km
        const nearbyCount = visibleMarkers.filter(marker => 
            marker.locationData.distance < 5
        ).length;
        document.getElementById('nearby-count').textContent = nearbyCount;
    }
}

// Abrir direcciones en Google Maps
function getDirections(lat, lng) {
    const destination = `${lat},${lng}`;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
    window.open(url, '_blank');
}

// Programar una cita (función de ejemplo)
function scheduleAppointment(locationId) {
    // En una aplicación real, esto redirigiría a un formulario de cita
    alert(`Redirección a formulario de cita para el centro ID: ${locationId}`);
}

// Inicializar la UI responsiva
function initializeResponsiveUI() {
    // Toggle para el menú en móvil
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
        });
    }
}

// Event listeners que se ejecutan cuando el DOM está completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // El mapa se inicializa a través de la callback de la API de Google Maps
    
    // Puedes añadir aquí otros inicializadores que no dependan del mapa
    
    // Por ejemplo, eventos para el menú responsivo
    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            document.querySelector('nav').classList.toggle('active');
        });
    }
});

// Mapa de donaciones con Leaflet
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar mapa
    const map = L.map('map').setView([40.416775, -3.70379], 6); // Centro en España

    // Añadir capa de mapa base (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
    }).addTo(map);

    // Datos de ejemplo de centros de donación
    const donationCenters = [
        {
            id: 1,
            name: "Hospital Universitario La Paz",
            address: "Paseo de la Castellana, 261, 28046 Madrid",
            coordinates: [40.4819, -3.6877],
            phone: "914 56 78 90",
            schedule: "Lunes a Viernes: 9:00 - 20:00, Sábados: 10:00 - 14:00",
            urgency: "high",
            bloodTypes: ["O+", "O-", "A-"],
            website: "https://www.comunidad.madrid/hospital/lapaz/"
        },
        {
            id: 2,
            name: "Hospital Clínic de Barcelona",
            address: "Carrer de Villarroel, 170, 08036 Barcelona",
            coordinates: [41.3892, 2.1507],
            phone: "932 27 54 00",
            schedule: "Lunes a Viernes: 8:30 - 21:00, Sábados: 9:00 - 15:00",
            urgency: "medium",
            bloodTypes: ["A+", "AB+", "B+"],
            website: "https://www.hospitalclinic.org/"
        },
        {
            id: 3,
            name: "Centro de Transfusión de la Comunidad de Madrid",
            address: "Avda. de la Democracia s/n, 28032 Madrid",
            coordinates: [40.4267, -3.6158],
            phone: "913 01 72 00",
            schedule: "Todos los días: 10:00 - 21:00",
            urgency: "high",
            bloodTypes: ["O-", "AB-", "B-"],
            website: "https://www.comunidad.madrid/centros/centro-transfusion"
        },
        {
            id: 4,
            name: "Hospital Universitario Virgen del Rocío",
            address: "Av. Manuel Siurot, s/n, 41013 Sevilla",
            coordinates: [37.3616, -5.9766],
            phone: "955 01 20 00",
            schedule: "Lunes a Viernes: 9:00 - 21:00, Sábados: 10:00 - 14:00",
            urgency: "low",
            bloodTypes: ["A+", "O+"],
            website: "https://www.hospitaluvrocio.es/"
        },
        {
            id: 5,
            name: "Hospital Universitario Central de Asturias",
            address: "Av. Roma, s/n, 33011 Oviedo, Asturias",
            coordinates: [43.3672, -5.8502],
            phone: "985 10 80 00",
            schedule: "Lunes a Viernes: 8:00 - 20:00",
            urgency: "medium",
            bloodTypes: ["B+", "AB+"],
            website: "http://www.hca.es/"
        },
        {
            id: 6,
            name: "Hospital Universitario de Gran Canaria Dr. Negrín",
            address: "Barranco de la Ballena, s/n, 35010 Las Palmas de Gran Canaria",
            coordinates: [28.1173, -15.4578],
            phone: "928 45 00 00",
            schedule: "Lunes a Viernes: 8:30 - 21:00, Sábados: 9:00 - 13:00",
            urgency: "high",
            bloodTypes: ["O-", "O+", "AB-"],
            website: "https://www.gobiernodecanarias.org/sanidad/scs/hospitalnegrin"
        },
        {
            id: 7,
            name: "Centro de Transfusión de Valencia",
            address: "Av. del Cid, 65, 46014 Valencia",
            coordinates: [39.4665, -0.4001],
            phone: "963 86 81 00",
            schedule: "Lunes a Domingo: 8:30 - 21:30",
            urgency: "medium",
            bloodTypes: ["A-", "B-"],
            website: "http://www.centrodetransfusion.san.gva.es/"
        },
        {
            id: 8,
            name: "Centro de Transfusión Sanguínea de Sevilla",
            address: "Av. Manuel Siurot, s/n, 41013 Sevilla",
            coordinates: [37.3600, -5.9780],
            phone: "955 00 99 00",
            schedule: "Lunes a Viernes: 9:00 - 21:00, Fines de semana: 10:00 - 14:00",
            urgency: "low",
            bloodTypes: ["O+", "A+"],
            website: "https://www.sspa.juntadeandalucia.es/servicioandaluzdesalud/centros-y-servicios/centro-regional-de-transfusion-sanguinea-de-sevilla"
        }
    ];

    // Variable para almacenar los marcadores
    const markers = [];
    
    // Iconos personalizados según urgencia
    const icons = {
        high: L.divIcon({
            className: 'custom-marker-icon high',
            html: '<i class="fas fa-tint" style="color: #FF3B30;"></i>',
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        }),
        medium: L.divIcon({
            className: 'custom-marker-icon medium',
            html: '<i class="fas fa-tint" style="color: #FF9500;"></i>',
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        }),
        low: L.divIcon({
            className: 'custom-marker-icon low',
            html: '<i class="fas fa-tint" style="color: #4CD964;"></i>',
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        })
    };

    // Función para mostrar los centros en el mapa
    function displayCenters(centers) {
        // Limpiar marcadores existentes
        markers.forEach(marker => map.removeLayer(marker));
        markers.length = 0;
        
        // Añadir nuevos marcadores
        centers.forEach(center => {
            const marker = L.marker(center.coordinates, {
                icon: icons[center.urgency] || L.divIcon({
                    className: 'custom-marker-icon',
                    html: '<i class="fas fa-tint" style="color: #E3000F;"></i>',
                    iconSize: [30, 30],
                    iconAnchor: [15, 15]
                })
            });
            
            // Crear popup personalizado
            const popupContent = createPopupContent(center);
            marker.bindPopup(popupContent);
            
            marker.addTo(map);
            markers.push(marker);
        });
        
        // Actualizar contadores estadísticos
        updateStats(centers);
    }
    
    // Función para crear el contenido del popup
    function createPopupContent(center) {
        // Obtener los tipos de sangre necesarios
        const neededBloodTypes = Object.entries(center.bloodTypes)
            .filter(([_, needed]) => needed)
            .map(([type, _]) => type);
            
        // Convertir la urgencia a texto
        const urgencyText = {
            'high': 'Alta',
            'medium': 'Media',
            'low': 'Baja'
        };
        
        // Crear el contenido HTML del popup
        return `
            <div class="map-popup">
                <div class="map-popup-header ${center.urgency}">
                    <h3>${center.name}</h3>
                    <p>Urgencia: ${urgencyText[center.urgency]}</p>
                </div>
                <div class="map-popup-body">
                    <div class="map-popup-info">
                        <div class="map-popup-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <p>${center.address}</p>
                        </div>
                        <div class="map-popup-item">
                            <i class="fas fa-phone"></i>
                            <p>${center.phone}</p>
                        </div>
                        <div class="map-popup-item">
                            <i class="fas fa-clock"></i>
                            <p>${center.schedule}</p>
                        </div>
                        <div class="map-popup-item">
                            <i class="fas fa-tint"></i>
                            <p>Tipos de sangre necesarios:
                                <div class="map-popup-blood-types">
                                    ${neededBloodTypes.map(type => `<span class="blood-type-badge needed">${type}</span>`).join('')}
                                </div>
                            </p>
                        </div>
                    </div>
                    <div class="map-popup-actions">
                        <button class="btn-primary" onclick="requestAppointment(${center.id})">
                            <i class="fas fa-calendar-alt"></i>
                            Pedir cita
                        </button>
                        <button class="btn-secondary" onclick="getDirections(${center.coordinates[0]}, ${center.coordinates[1]})">
                            <i class="fas fa-directions"></i>
                            Cómo llegar
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // Función para actualizar las estadísticas
    function updateStats(centers) {
        const totalCenters = centers.length;
        const urgentCenters = centers.filter(c => c.urgency === 'high').length;
        
        // Calcular centros cercanos (simulado)
        let nearbyCenters = 0;
        if (navigator.geolocation) {
            nearbyCenters = Math.floor(Math.random() * 3) + 1; // Simulación
        }
        
        // Actualizar DOM
        document.getElementById('total-centers').textContent = totalCenters;
        document.getElementById('urgent-centers').textContent = urgentCenters;
        document.getElementById('nearby-centers').textContent = nearbyCenters;
    }

    // Función para filtrar centros según criterios
    function filterCenters() {
        // Obtener filtros seleccionados
        const urgencyFilters = {
            high: document.getElementById('filter-high').checked,
            medium: document.getElementById('filter-medium').checked,
            low: document.getElementById('filter-low').checked
        };
        
        const bloodTypeFilters = {
            'O+': document.getElementById('filter-opos').checked,
            'O-': document.getElementById('filter-oneg').checked,
            'A+': document.getElementById('filter-apos').checked,
            'A-': document.getElementById('filter-aneg').checked,
            'B+': document.getElementById('filter-bpos').checked,
            'B-': document.getElementById('filter-bneg').checked,
            'AB+': document.getElementById('filter-abpos').checked,
            'AB-': document.getElementById('filter-abneg').checked
        };
        
        // Si no hay filtros seleccionados, mostrar todos
        const anyUrgencySelected = Object.values(urgencyFilters).some(v => v);
        const anyBloodTypeSelected = Object.values(bloodTypeFilters).some(v => v);
        
        // Aplicar filtros
        let filtered = donationCenters;
        
        if (anyUrgencySelected) {
            filtered = filtered.filter(center => urgencyFilters[center.urgency]);
        }
        
        if (anyBloodTypeSelected) {
            filtered = filtered.filter(center => {
                // Verificar si el centro tiene al menos uno de los tipos de sangre seleccionados
                return Object.entries(bloodTypeFilters)
                    .filter(([_, selected]) => selected)
                    .some(([type, _]) => center.bloodTypes[type]);
            });
        }
        
        // Mostrar centros filtrados
        displayCenters(filtered);
    }
    
    // Función de búsqueda por dirección
    function searchLocation() {
        const searchInput = document.getElementById('search-input').value.trim();
        
        if (!searchInput) return;
        
        // Simulación: normalmente aquí iría una llamada a una API de geocodificación
        alert(`Búsqueda simulada para: ${searchInput}`);
        
        // En una implementación real, usaríamos un servicio como OpenStreetMap Nominatim
        // Ejemplo (no funcional en este simulador):
        // fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchInput)}`)
        //    .then(response => response.json())
        //    .then(data => {
        //        if (data.length > 0) {
        //            map.setView([data[0].lat, data[0].lon], 13);
        //        }
        //    });
    }
    
    // Función para obtener ubicación del usuario
    function getUserLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userLat = position.coords.latitude;
                    const userLng = position.coords.longitude;
                    
                    // Centrar mapa en ubicación del usuario
                    map.setView([userLat, userLng], 13);
                    
                    // Añadir marcador de ubicación del usuario
                    L.marker([userLat, userLng], {
                        icon: L.divIcon({
                            className: 'user-location-marker',
                            html: '<i class="fas fa-user-circle" style="color: #0056B3;"></i>',
                            iconSize: [30, 30],
                            iconAnchor: [15, 15]
                        })
                    }).addTo(map)
                    .bindPopup('Tu ubicación actual')
                    .openPopup();
                },
                (error) => {
                    console.error("Error obteniendo ubicación: ", error);
                    alert("No se pudo acceder a tu ubicación. Por favor, permite el acceso o busca manualmente.");
                }
            );
        } else {
            alert("Tu navegador no soporta geolocalización");
        }
    }

    // Función para solicitar cita (simulada)
    window.requestAppointment = function(centerId) {
        const center = donationCenters.find(c => c.id === centerId);
        if (center) {
            alert(`Redirigiendo a formulario de cita para: ${center.name}`);
            // En una implementación real, redirigir a página de citas:
            // window.location.href = `/cita?center=${centerId}`;
        }
    };
    
    // Función para obtener direcciones (simulada)
    window.getDirections = function(lat, lng) {
        // En una implementación real, redirigiríamos a Google Maps o similar
        window.open(`https://www.google.com/maps/dir/Current+Location/${lat},${lng}`, '_blank');
    };

    // Inicialización: mostrar todos los centros al cargar
    displayCenters(donationCenters);
    
    // Event listeners
    document.getElementById('search-button').addEventListener('click', searchLocation);
    document.getElementById('location-button').addEventListener('click', getUserLocation);
    
    // Event listeners para filtros
    document.querySelectorAll('.filter-option input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', filterCenters);
    });
});

// Estilos CSS para los marcadores del mapa
const style = document.createElement('style');
style.textContent = `
    .custom-marker-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 30px;
        height: 30px;
        background-color: white;
        border-radius: 50%;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    }
    
    .custom-marker-icon i {
        font-size: 18px;
    }
    
    .user-location-marker {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 26px;
    }
`;
document.head.appendChild(style); 