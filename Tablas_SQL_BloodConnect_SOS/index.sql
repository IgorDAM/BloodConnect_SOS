-- Búsqueda rápida de donantes por tipo de sangre y ubicación  
CREATE INDEX idx_donor_blood_location ON Donor(blood_type, latitude, longitude);  

-- Predicciones climáticas por región y fecha  
CREATE INDEX idx_climate_region_date ON ClimateData(region_id, recorded_date);  

-- Inventario crítico (sangre próxima a expirar)  
CREATE INDEX idx_inventory_expiry ON BloodInventory(expiration_date);  