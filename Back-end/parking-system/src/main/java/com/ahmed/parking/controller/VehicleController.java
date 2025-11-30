package com.ahmed.parking.controller;

import com.ahmed.parking.entity.Vehicle;
import com.ahmed.parking.service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController // Tells Spring "This is an API"
@RequestMapping("/api/vehicles") // All URLs start with /api/vehicles
@CrossOrigin(origins = "*") // Allows Next.js to talk to this
public class VehicleController {

    @Autowired
    private VehicleService vehicleService;

    // URL: GET http://localhost:8080/api/vehicles
    @GetMapping
    public List<Vehicle> getAllVehicles() {
        return vehicleService.getAllVehicles();
    }

    // URL: POST http://localhost:8080/api/vehicles
    @PostMapping
    public Vehicle addVehicle(@RequestBody Vehicle vehicle) {
        return vehicleService.addVehicle(vehicle);
    }
}