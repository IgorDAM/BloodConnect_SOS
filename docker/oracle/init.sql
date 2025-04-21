CREATE TABLE DONOR (
    donor_id NUMBER PRIMARY KEY,
    name VARCHAR2(100),
    blood_type VARCHAR2(3),
    latitude NUMBER(10,6),
    longitude NUMBER(10,6)
);

-- Inserta datos de prueba
INSERT INTO DONOR VALUES (1, 'Ana Pérez', 'O+', 19.4326, -99.1332);