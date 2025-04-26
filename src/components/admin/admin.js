// Simulación de estadísticas dinámicas
document.addEventListener('DOMContentLoaded', () => {
    const updateStats = () => {
        document.getElementById('donacionesHoy').innerText = Math.floor(Math.random() * 50 + 10);
        document.getElementById('emergenciasActivas').innerText = Math.floor(Math.random() * 5 + 1);
        document.getElementById('hospitalesRegistrados').innerText = 12;
    };

    // Actualizar estadísticas cada 5 minutos
    updateStats();
    setInterval(updateStats, 300000);

    // Gestión del formulario de emergencia
    document.getElementById('formEmergencia')?.addEventListener('submit', function(e) {
        e.preventDefault();
        const tipo = document.getElementById('tipoSangre').value;
        const hospital = document.getElementById('hospital').value;
        const ciudad = document.getElementById('ubicacion').value;

        if (tipo && hospital && ciudad) {
            alert(`¡Emergencia activada!\nTipo: ${tipo}\nHospital: ${hospital}\nCiudad: ${ciudad}`);
            document.getElementById('formEmergencia').reset();
        }
    });
}); 