CREATE TABLE Reward (  
    reward_id NUMBER PRIMARY KEY,  
    name VARCHAR2(50),  -- Ej: "H�roe Mensual"  
    points_required NUMBER,  
    badge_image BLOB    -- Insignias en formato PNG  
);  