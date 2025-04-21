CREATE TABLE BlockchainTransaction (  
    tx_hash VARCHAR2(66) PRIMARY KEY, -- Hash de transacción  
    donor_id NUMBER REFERENCES Donor(donor_id),  
    blood_unit_id VARCHAR2(100), -- ID único de la unidad de sangre  
    timestamp TIMESTAMP  
);  