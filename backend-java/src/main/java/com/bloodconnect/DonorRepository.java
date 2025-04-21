package com.bloodconnect.repository;

import com.bloodconnect.model.Donor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface DonorRepository extends JpaRepository<Donor, Long> {

    @Query(value = """
        SELECT * FROM donors d
        WHERE d.blood_type = :bloodType
        AND SDO_WITHIN_DISTANCE(
            d.geo_location,
            SDO_GEOMETRY(2001, 4326, SDO_POINT_TYPE(:lng, :lat, NULL), 
            'distance=:radius unit=KM'
        ) = 'TRUE'
    """, nativeQuery = true)
    List<Donor> findNearbyDonors(
        @Param("bloodType") String bloodType,
        @Param("lat") Double latitude,
        @Param("lng") Double longitude,
        @Param("radius") Double radius
    );
}