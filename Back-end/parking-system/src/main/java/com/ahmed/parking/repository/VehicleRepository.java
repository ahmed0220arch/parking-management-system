package com.ahmed.parking.repository;

import com.ahmed.parking.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    // Custom query: Find a car by its plate
    Optional<Vehicle> findByLicensePlate(String licensePlate);
}