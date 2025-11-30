package com.ahmed.parking.service;

import com.ahmed.parking.entity.ParkingSpot;
import com.ahmed.parking.repository.ParkingSpotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ParkingSpotService {

    @Autowired
    private ParkingSpotRepository parkingSpotRepository;

    // 1. Get only FREE spots
    public List<ParkingSpot> getAvailableSpots() {
        return parkingSpotRepository.findByIsOccupiedFalse();
    }

    // 2. Add a new spot (e.g., Administrator adds "B-2")
    public ParkingSpot addSpot(ParkingSpot spot) {
        return parkingSpotRepository.save(spot);
    }
    
    // 3. Get all spots (Occupied and Free)
    public List<ParkingSpot> getAllSpots() {
        return parkingSpotRepository.findAll();
    }

    // NEW: Update an existing spot
    public ParkingSpot updateSpot(Long id, ParkingSpot spotDetails) {
        ParkingSpot spot = parkingSpotRepository.findById(id).orElse(null);
        if (spot != null) {
            spot.setSpotNumber(spotDetails.getSpotNumber());
            spot.setFloor(spotDetails.getFloor());
            spot.setImageUrl(spotDetails.getImageUrl());
            return parkingSpotRepository.save(spot);
        }
        return null;
    }
}