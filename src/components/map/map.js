// Inicializar el mapa
const map = L.map('map').setView([40.4168, -3.7038], 6); // Centro: Madrid

// Cargar capa base de OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Datos © OpenStreetMap',
}).addTo(map);

// Iconos personalizados
const emergenciaIcon = L.icon({
    iconUrl: '/assets/icons/emergency.png',
    iconSize: [35, 35],
});

const hospitalIcon = L.icon({
    iconUrl: '/assets/icons/hospital.png',
    iconSize: [30, 30],
});

// Clase para manejar emergencias
class EmergencyManager {
    constructor() {
        this.emergencias = [];
        this.hospitales = [];
        this.userMarker = null;
    }

    addEmergency(lat, lon, nombre) {
        this.emergencias.push({ lat, lon, nombre });
        this.updateMap();
    }

    addHospital(lat, lon, nombre) {
        this.hospitales.push({ lat, lon, nombre });
        this.updateMap();
    }

    updateMap() {
        // Limpiar marcadores existentes
        map.eachLayer((layer) => {
            if (layer instanceof L.Marker) {
                map.removeLayer(layer);
            }
        });

        // Mostrar Emergencias
        this.emergencias.forEach(e => {
            L.marker([e.lat, e.lon], { icon: emergenciaIcon })
                .addTo(map)
                .bindPopup(`<b>${e.nombre}</b>`);
        });

        // Mostrar Hospitales
        this.hospitales.forEach(h => {
            L.marker([h.lat, h.lon], { icon: hospitalIcon })
                .addTo(map)
                .bindPopup(`<b>${h.nombre}</b>`);
        });

        // Restaurar marcador de usuario si existe
        if (this.userMarker) {
            this.userMarker.addTo(map);
        }
    }

    locateUser() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                this.userMarker = L.marker([lat, lon]).addTo(map)
                    .bindPopup('¡Tú estás aquí!').openPopup();
                map.setView([lat, lon], 12);
            });
        }
    }

    findNearestHospital() {
        if (!this.userMarker) {
            alert('No hemos podido determinar tu ubicación.');
            return;
        }

        const userLatLng = this.userMarker.getLatLng();
        let hospitalCercano = null;
        let distanciaMinima = Infinity;

        this.hospitales.forEach(hospital => {
            const distancia = map.distance(userLatLng, L.latLng(hospital.lat, hospital.lon));
            if (distancia < distanciaMinima) {
                distanciaMinima = distancia;
                hospitalCercano = hospital;
            }
        });

        if (hospitalCercano) {
            alert(`Hospital más cercano: ${hospitalCercano.nombre} (${(distanciaMinima/1000).toFixed(2)} km)`);
            map.setView([hospitalCercano.lat, hospitalCercano.lon], 14);
        }
    }
}

// Inicializar el gestor de emergencias
const emergencyManager = new EmergencyManager();

// Cargar datos iniciales
emergencyManager.addEmergency(40.4168, -3.7038, 'Emergencia - Madrid');
emergencyManager.addEmergency(41.3851, 2.1734, 'Emergencia - Barcelona');
emergencyManager.addHospital(40.4447, -3.7238, 'Hospital de La Paz');
emergencyManager.addHospital(41.4036, 2.1744, 'Hospital Vall d\'Hebron');

// Localizar usuario al cargar la página
emergencyManager.locateUser(); 