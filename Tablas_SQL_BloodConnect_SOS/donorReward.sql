CREATE TABLE DonorReward (  
    donor_id NUMBER REFERENCES Donor(donor_id),  
    reward_id NUMBER REFERENCES Reward(reward_id),  
    PRIMARY KEY (donor_id, reward_id)  
);  