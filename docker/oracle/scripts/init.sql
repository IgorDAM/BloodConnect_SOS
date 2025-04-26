CREATE -- docker/oracle/scripts/init.sql
-- Elimina tablas si existen (con manejo de errores)
BEGIN
  EXECUTE IMMEDIATE 'DROP TABLE hospital_emergency CASCADE CONSTRAINTS';
EXCEPTION
  WHEN OTHERS THEN
    IF SQLCODE != -942 THEN
      RAISE;
    END IF;
END;
/

BEGIN
  EXECUTE IMMEDIATE 'DROP TABLE donations CASCADE CONSTRAINTS';
EXCEPTION
  WHEN OTHERS THEN
    IF SQLCODE != -942 THEN
      RAISE;
    END IF;
END;
/

BEGIN
  EXECUTE IMMEDIATE 'DROP TABLE emergencies CASCADE CONSTRAINTS';
EXCEPTION
  WHEN OTHERS THEN
    IF SQLCODE != -942 THEN
      RAISE;
    END IF;
END;
/

BEGIN
  EXECUTE IMMEDIATE 'DROP TABLE hospitals CASCADE CONSTRAINTS';
EXCEPTION
  WHEN OTHERS THEN
    IF SQLCODE != -942 THEN
      RAISE;
    END IF;
END;
/

BEGIN
  EXECUTE IMMEDIATE 'DROP TABLE donors CASCADE CONSTRAINTS';
EXCEPTION
  WHEN OTHERS THEN
    IF SQLCODE != -942 THEN
      RAISE;
    END IF;
END;
/

-- Crear tablas
CREATE TABLE donors (
    donor_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR2(100) NOT NULL,
    blood_type VARCHAR2(3) CHECK(blood_type IN ('A+','A-','B+','B-','O+','O-','AB+','AB-')),
    geo_location SDO_GEOMETRY NOT NULL,
    phone VARCHAR2(15),
    last_donation DATE,
    dengue_antibodies CHAR(1) DEFAULT 'N' CHECK(dengue_antibodies IN ('Y','N'))
);

CREATE TABLE hospitals (
    hospital_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR2(100) NOT NULL,
    address VARCHAR2(200),
    emergency_phone VARCHAR2(15) NOT NULL
);

CREATE TABLE emergencies (
    emergency_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    type VARCHAR2(20) CHECK(type IN ('HURRICANE','EARTHQUAKE','DENGUE_OUTBREAK')),
    radius_km NUMBER(5,2) NOT NULL,
    start_time TIMESTAMP DEFAULT SYSTIMESTAMP
);

CREATE TABLE donations (
    donation_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    donor_id NUMBER NOT NULL REFERENCES donors(donor_id),
    hospital_id NUMBER NOT NULL REFERENCES hospitals(hospital_id),
    donation_date DATE DEFAULT SYSDATE,
    amount_ml NUMBER(5) NOT NULL
);

CREATE TABLE hospital_emergency (
    hospital_id NUMBER NOT NULL REFERENCES hospitals(hospital_id),
    emergency_id NUMBER NOT NULL REFERENCES emergencies(emergency_id),
    PRIMARY KEY (hospital_id, emergency_id)
);

-- Metadata e índices espaciales
INSERT INTO USER_SDO_GEOM_METADATA VALUES (
  'DONORS',
  'GEO_LOCATION',
  SDO_DIM_ARRAY(
    SDO_DIM_ELEMENT('X', -180, 180, 0.005),
    SDO_DIM_ELEMENT('Y', -90, 90, 0.005)
  ),
  4326
);

CREATE INDEX donors_geo_idx ON donors(geo_location)
INDEXTYPE IS MDSYS.SPATIAL_INDEX;

-- Datos iniciales
INSERT INTO hospitals (name, address, emergency_phone) VALUES 
('Hospital San José', 'Calle Central, San José Centro', '+506 2222-5555'),
('Clínica La Católica', 'Sabanilla, San José', '+506 2246-3000');

INSERT INTO donors (name, blood_type, geo_location, phone) VALUES 
(
  'María Rodríguez',
  'O+',
  SDO_GEOMETRY(
    2001,
    4326,
    SDO_POINT_TYPE(-84.0867, 9.9325, NULL),
    NULL,
    NULL
  ),
  '8888-0001'
),
(
  'Carlos Vargas',
  'A-',
  SDO_GEOMETRY(
    2001,
    4326,
    SDO_POINT_TYPE(-84.0512, 9.9367, NULL),
    NULL,
    NULL
  ),
  '8888-0002'
);

INSERT INTO emergencies (type, radius_km) VALUES 
('HURRICANE', 50.75),
('DENGUE_OUTBREAK', 15.00);

COMMIT;