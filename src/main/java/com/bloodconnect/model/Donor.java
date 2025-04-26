package com.tuproyecto.model;  // ¡Paquete correcto!

import javax.persistence.*;

import org.locationtech.jts.geom.Point;

@Entity
@Table(name = "donor")  // Asegúrate que coincida con tu tabla
public class Donor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long donorId;

    private String name;
    private String bloodType;

    @Column(columnDefinition = "sdo_geometry")  // Tipo espacial de Oracle
    private Point geoLocation;

    // Elimina latitude/longitude
    // Mantén getters/setters (genera nuevos para geoLocation)
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