CREATE TABLE BloodInventory (  
    inventory_id NUMBER PRIMARY KEY,  
    bank_id NUMBER REFERENCES BloodBank(bank_id),  
    blood_type VARCHAR2(3),  
    quantity NUMBER,  
    expiration_date DATE  
);  