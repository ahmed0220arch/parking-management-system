package com.ahmed.parking.repository;

import com.ahmed.parking.entity.ParkingSpot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ParkingSpotRepository extends JpaRepository<ParkingSpot, Long> {
    // Custom query: Find all free spots
    List<ParkingSpot> findByIsOccupiedFalse();
    
    // Find spot by specific number (e.g. "A1")
    ParkingSpot findBySpotNumber(String spotNumber);
}