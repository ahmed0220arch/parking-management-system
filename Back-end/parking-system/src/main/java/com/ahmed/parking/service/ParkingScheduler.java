package com.ahmed.parking.service;

import com.ahmed.parking.entity.ParkingSpot;
import com.ahmed.parking.entity.Reservation;
import com.ahmed.parking.repository.ParkingSpotRepository;
import com.ahmed.parking.repository.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ParkingScheduler {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private ParkingSpotRepository parkingSpotRepository;

    // Runs every 30 seconds (30000 milliseconds)
    @Scheduled(fixedRate = 30000)
    public void checkExpiredReservations() {
        // 1. Find all active reservations where time has passed
        List<Reservation> activeReservations = reservationRepository.findAll();
        LocalDateTime now = LocalDateTime.now();

        for (Reservation res : activeReservations) {
            // If status is ACTIVE and End Time is in the past
            if ("ACTIVE".equals(res.getStatus()) && res.getEndTime() != null && res.getEndTime().isBefore(now)) {
                
                // 2. Mark reservation as COMPLETED
                res.setStatus("COMPLETED");
                reservationRepository.save(res);

                // 3. Free up the Parking Spot
                ParkingSpot spot = res.getParkingSpot();
                if (spot != null) {
                    spot.setOccupied(false);
                    parkingSpotRepository.save(spot);
                    System.out.println("Time up! Spot " + spot.getSpotNumber() + " is now FREE.");
                }
            }
        }
    }
}
