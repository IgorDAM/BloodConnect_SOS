CREATE TABLE Reward (  
    reward_id NUMBER PRIMARY KEY,  
    name VARCHAR2(50),  -- Ej: "Héroe Mensual"  
    points_required NUMBER,  
    badge_image BLOB    -- Insignias en formato PNG  
);  