CREATE TABLE BloodBank (  
    bank_id NUMBER PRIMARY KEY,  
    name VARCHAR2(100) NOT NULL,  
    latitude NUMBER(10,6),  
    longitude NUMBER(10,6),  
    contact VARCHAR2(100)  
);  