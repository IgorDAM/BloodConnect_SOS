-- Crear tabla de autenticación  
CREATE TABLE UserAuthentication (  
    user_id NUMBER PRIMARY KEY,  
    donor_id NUMBER REFERENCES Donor(donor_id),  
    password_hash VARCHAR2(64) NOT NULL, -- SHA-256  
    salt VARCHAR2(32) NOT NULL  
);  

-- Consulta: Donantes O- disponibles cerca de una emergencia  
SELECT d.name, d.latitude, d.longitude  
FROM donor d  
WHERE d.blood_type = 'O-'  
  AND SQRT(POWER(d.latitude - 19.432601, 2) + POWER(d.longitude - (-99.133209), 2)) <= 0.1; -- Radio ~11 km  