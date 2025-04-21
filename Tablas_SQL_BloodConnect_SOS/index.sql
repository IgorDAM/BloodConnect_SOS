-- B�squeda r�pida de donantes por tipo de sangre y ubicaci�n  
CREATE INDEX idx_donor_blood_location ON Donor(blood_type, latitude, longitude);  

-- Predicciones clim�ticas por regi�n y fecha  
CREATE INDEX idx_climate_region_date ON ClimateData(region_id, recorded_date);  

-- Inventario cr�tico (sangre pr�xima a expirar)  
CREATE INDEX idx_inventory_expiry ON BloodInventory(expiration_date);  