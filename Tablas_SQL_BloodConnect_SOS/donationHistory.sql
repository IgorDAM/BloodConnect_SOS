CREATE TABLE DonationHistory (  
    donation_id NUMBER PRIMARY KEY,  
    donor_id NUMBER REFERENCES Donor(donor_id),  
    bank_id NUMBER REFERENCES BloodBank(bank_id),  
    emergency_id NUMBER REFERENCES Emergency(emergency_id),  
    donation_date DATE  
);  