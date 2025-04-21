CREATE TABLE DONOR (
 id_donor NUMBER PRIMARY KEY,
 name VARCHAR2(100) NOT NULL,
 email VARCHAR2(100) UNIQUE,
 blood_type VARCHAR2(3) CHECK (blood_type IN ('A+','A-','B+','B-','AB+','AB-','O+','O-')),
 last_donation DATE,
 latitude NUMBER(10,6),  --Ej: 19.432601
 longitude NUMBER(10,6), --Ej: 99.133209
 health_status VARCHAR2(50) --Ej: "Recuperado de dengue en 2023"
);

CREATE TABLE BLOODBANK (  
    bank_id NUMBER PRIMARY KEY,  
    name VARCHAR2(100) NOT NULL,  
    latitude NUMBER(10,6),  
    longitude NUMBER(10,6),  
    contact VARCHAR2(100)  
);  

CREATE TABLE DONATIONHISTORY (  
    donation_id NUMBER PRIMARY KEY,  
    donor_id NUMBER REFERENCES Donor(donor_id),  
    bank_id NUMBER REFERENCES BloodBank(bank_id),  
    emergency_id NUMBER REFERENCES Emergency(emergency_id),  
    donation_date DATE  
); 

CREATE TABLE BLOODINVENTORY (  
    inventory_id NUMBER PRIMARY KEY,  
    bank_id NUMBER REFERENCES BloodBank(bank_id),  
    blood_type VARCHAR2(3),  
    quantity NUMBER,  
    expiration_date DATE  
); 

CREATE TABLE REWARD (  
    reward_id NUMBER PRIMARY KEY,  
    name VARCHAR2(50),  -- Ej: "H�roe Mensual"  
    points_required NUMBER,  
    badge_image BLOB    -- Insignias en formato PNG  
); 

CREATE TABLE DONORREWARD (  
    donor_id NUMBER REFERENCES Donor(donor_id),  
    reward_id NUMBER REFERENCES Reward(reward_id),  
    PRIMARY KEY (donor_id, reward_id)  
); 

CREATE TABLE BLOCKCHAINTRANSACTION (  
    tx_hash VARCHAR2(66) PRIMARY KEY, -- Hash de transacci�n  
    donor_id NUMBER REFERENCES Donor(donor_id),  
    blood_unit_id VARCHAR2(100), -- ID �nico de la unidad de sangre  
    timestamp TIMESTAMP  
);  

CREATE TABLE CLIMATEDATA (  
    region_id NUMBER PRIMARY KEY,  
    temperature NUMBER(5,2),  
    humidity NUMBER(5,2),  
    precipitation NUMBER(5,2),  
    event_type VARCHAR2(50), -- Ej: "hurac�n", "sequ�a"  
    recorded_date DATE  
);  