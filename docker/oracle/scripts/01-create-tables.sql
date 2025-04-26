-- Tablas principales
CREATE TABLE donors (
    donor_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR2(100) NOT NULL,
    blood_type VARCHAR2(3) CHECK(blood_type IN ('A+','A-','B+','B-','O+','O-','AB+','AB-')),
    geo_location SDO_GEOMETRY NOT NULL,
    phone VARCHAR2(15),
    last_donation DATE,
    dengue_antibodies CHAR(1) DEFAULT 'N' CHECK(dengue_antibodies IN ('Y','N'))
;

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

-- Tablas de relación
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

