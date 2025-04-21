package com.tuproyecto.entity;  // ¡Paquete correcto!

import javax.persistence.*;

@Entity
@Table(name = "donor")  // Nombre de la tabla en Oracle
public class Donor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "DONOR_ID")
    private Long donorId;

    private String name;
    private String bloodType;
    private Double latitude;
    private Double longitude;

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public String getBloodType() {
        return bloodType;
    }

    public void setBloodType(String bloodType) {
        this.bloodType = bloodType;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getDonorId() {
        return donorId;
    }

    public void setDonorId(Long donorId) {
        this.donorId = donorId;
    }

    // Getters y Setters (genera automáticamente en IntelliJ: Click derecho > Generate)
}