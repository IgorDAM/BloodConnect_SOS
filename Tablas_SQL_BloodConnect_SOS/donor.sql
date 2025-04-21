CREATE TABLE Donor (
 id_donor NUMBER PRIMARY KEY,
 name VARCHAR2(100) NOT NULL,
 email VARCHAR2(100) UNIQUE,
 blood_type VARCHAR2(3) CHECK (blood_type IN ('A+','A-','B+','B-','AB+','AB-','O+','O-')),
 last_donation DATE,
 latitude NUMBER(10,6),  --Ej: 19.432601
 longitude NUMBER(10,6), --Ej: 99.133209
 health_status VARCHAR2(50) --Ej: "Recuperado de dengue en 2023"
);