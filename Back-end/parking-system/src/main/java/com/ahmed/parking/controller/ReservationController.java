package com.ahmed.parking.controller;

import com.ahmed.parking.entity.Reservation;
import com.ahmed.parking.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = "*")
public class ReservationController {

    @Autowired
    private ReservationService reservationService;

    // URL: POST http://localhost:8081/api/reservations?vehicleId=1&spotId=5&startTime=...&endTime=...
    @PostMapping
    public ResponseEntity<?> createReservation(
            @RequestParam Long vehicleId, 
            @RequestParam Long spotId,
            @RequestParam String startTime,
            @RequestParam String endTime) {
        
        Reservation reservation = reservationService.createReservation(vehicleId, spotId, startTime, endTime);

        if (reservation != null) {
            return ResponseEntity.ok(reservation);
        } else {
            return ResponseEntity.badRequest().body("Booking failed: Spot might be taken or Vehicle invalid.");
        }
    }

    // NEW URL: GET http://localhost:8081/api/reservations
    @GetMapping
    public List<Reservation> getAllReservations() {
        return reservationService.getAllReservations();
    }

    // DELETE URL: DELETE http://localhost:8081/api/reservations/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReservation(@PathVariable Long id) {
        boolean deleted = reservationService.deleteReservation(id);
        if (deleted) {
            return ResponseEntity.ok("Reservation deleted successfully");
        } else {
            return ResponseEntity.badRequest().body("Reservation not found or already deleted");
        }
    }
}