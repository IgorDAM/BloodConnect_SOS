// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar el mapa en la página de inicio
    const map = L.map('map').setView([40.416775, -3.703790], 6); // Centro en España

    // Añadir capa de mapa base
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Datos de emergencias activas (ejemplo)
    const emergencias = [
        {
            hospital: 'Hospital Universitario La Paz',
            coords: [40.481700, -3.686500],
            ciudad: 'Madrid',
            tipoSangre: 'O+',
            urgencia: 'Alta'
        },
        {
            hospital: 'Hospital Clínico San Carlos',
            coords: [40.440900, -3.717300],
            ciudad: 'Madrid',
            tipoSangre: 'AB-',
            urgencia: 'Media'
        },
        {
            hospital: 'Hospital Virgen del Rocío',
            coords: [37.360800, -5.981200],
            ciudad: 'Sevilla',
            tipoSangre: 'A-',
            urgencia: 'Alta'
        },
        {
            hospital: 'Hospital Universitario Central de Asturias',
            coords: [43.366200, -5.822000],
            ciudad: 'Oviedo',
            tipoSangre: 'B+',
            urgencia: 'Media'
        },
        {
            hospital: 'Hospital Universitario de Valencia',
            coords: [39.478600, -0.366000],
            ciudad: 'Valencia',
            tipoSangre: 'O-',
            urgencia: 'Alta'
        }
    ];

    // Añadir marcadores para cada emergencia
    emergencias.forEach(emergencia => {
        // Crear icono personalizado con color según urgencia
        const iconColor = emergencia.urgencia === 'Alta' ? 'red' : 'orange';
        const icon = L.divIcon({
            className: 'custom-div-icon',
            html: `<div style="background-color: ${iconColor}; width: 10px; height: 10px; border-radius: 50%; border: 2px solid white;"></div>`,
            iconSize: [15, 15],
            iconAnchor: [7, 7]
        });

        // Añadir marcador al mapa
        const marker = L.marker(emergencia.coords, { icon }).addTo(map);
        
        // Definir contenido del popup
        const popupContent = `
            <div style="min-width: 200px">
                <h5>${emergencia.hospital}</h5>
                <p><strong>Ciudad:</strong> ${emergencia.ciudad}</p>
                <p><strong>Tipo de sangre necesaria:</strong> ${emergencia.tipoSangre}</p>
                <p><strong>Urgencia:</strong> <span style="color: ${iconColor}; font-weight: bold">${emergencia.urgencia}</span></p>
                <a href="login.html" class="btn btn-sm btn-danger">Responder a esta emergencia</a>
            </div>
        `;
        
        // Vincular popup al marcador
        marker.bindPopup(popupContent);
    });

    // Añadir círculos de radio para emergencias de alta urgencia
    emergencias.filter(e => e.urgencia === 'Alta').forEach(emergencia => {
        L.circle(emergencia.coords, {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.1,
            radius: 25000 // 25km
        }).addTo(map);
    });

    // Intentar obtener ubicación del usuario
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const userLatLng = [position.coords.latitude, position.coords.longitude];
                L.marker(userLatLng, {
                    icon: L.divIcon({
                        className: 'custom-div-icon',
                        html: `<div style="background-color: blue; width: 10px; height: 10px; border-radius: 50%; border: 2px solid white;"></div>`,
                        iconSize: [15, 15],
                        iconAnchor: [7, 7]
                    })
                }).addTo(map)
                    .bindPopup("Tu ubicación actual")
                    .openPopup();
            },
            error => {
                console.warn("No se pudo obtener la ubicación del usuario:", error);
            }
        );
    }
}); 