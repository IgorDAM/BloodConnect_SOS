CREATE TABLE ClimateData (  
    region_id NUMBER PRIMARY KEY,  
    temperature NUMBER(5,2),  
    humidity NUMBER(5,2),  
    precipitation NUMBER(5,2),  
    event_type VARCHAR2(50), -- Ej: "huracán", "sequía"  
    recorded_date DATE  
);  