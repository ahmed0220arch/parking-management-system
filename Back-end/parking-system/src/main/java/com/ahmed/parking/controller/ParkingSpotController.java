package com.ahmed.parking.controller;

import com.ahmed.parking.entity.ParkingSpot;
import com.ahmed.parking.service.ParkingSpotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/spots")
@CrossOrigin(origins = "*")
public class ParkingSpotController {

    @Autowired
    private ParkingSpotService parkingSpotService;

    // URL: GET http://localhost:8080/api/spots/available
    @GetMapping("/available")
    public List<ParkingSpot> getAvailableSpots() {
        return parkingSpotService.getAvailableSpots();
    }

    // URL: GET http://localhost:8080/api/spots
    @GetMapping
    public List<ParkingSpot> getAllSpots() {
        return parkingSpotService.getAllSpots();
    }

    // URL: POST http://localhost:8080/api/spots
    @PostMapping
    public ParkingSpot addSpot(@RequestBody ParkingSpot spot) {
        return parkingSpotService.addSpot(spot);
    }

    @Autowired
    private com.ahmed.parking.repository.ParkingSpotRepository parkingSpotRepository; // Ensure Repo is injected

    // URL: DELETE http://localhost:8081/api/spots/{id}
    @DeleteMapping("/{id}")
    public void deleteSpot(@PathVariable Long id) {
        parkingSpotRepository.deleteById(id);
    }

    // NEW URL: PUT http://localhost:8081/api/spots/{id}
    @PutMapping("/{id}")
    public ParkingSpot updateSpot(@PathVariable Long id, @RequestBody ParkingSpot spotDetails) {
        return parkingSpotService.updateSpot(id, spotDetails);
    }
}