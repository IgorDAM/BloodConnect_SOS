public interface DonorRepository extends JpaRepository<Donor, Long> {
    // Consultas personalizadas (ejemplo para donantes cercanos)
    @Query(value = """  
        SELECT * FROM donor  
        WHERE BLOOD_TYPE = :bloodType  
        AND SQRT(POWER(LATITUDE - :latitude, 2) + POWER(LONGITUDE - :longitude, 2)) <= :radius  
        """, nativeQuery = true)
    List<Donor> findNearbyDonors(
            @Param("bloodType") String bloodType,
            @Param("latitude") Double latitude,
            @Param("longitude") Double longitude,
            @Param("radius") Double radius
    );
}