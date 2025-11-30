package com.ahmed.parking.service;

import com.ahmed.parking.entity.ParkingSpot;
import com.ahmed.parking.entity.Reservation;
import com.ahmed.parking.entity.Vehicle;
import com.ahmed.parking.repository.ParkingSpotRepository;
import com.ahmed.parking.repository.ReservationRepository;
import com.ahmed.parking.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReservationService {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private ParkingSpotRepository parkingSpotRepository;
    
    @Autowired
    private VehicleRepository vehicleRepository;

    public Reservation createReservation(Long vehicleId, Long spotId, String startTimeStr, String endTimeStr) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId).orElse(null);
        ParkingSpot spot = parkingSpotRepository.findById(spotId).orElse(null);

        if (vehicle != null && spot != null && !spot.isOccupied()) {
            Reservation reservation = new Reservation();
            reservation.setVehicle(vehicle);
            reservation.setParkingSpot(spot);
            
            // Set Start and End Time from Inputs
            reservation.setStartTime(LocalDateTime.parse(startTimeStr));
            reservation.setEndTime(LocalDateTime.parse(endTimeStr));
            
            reservation.setStatus("ACTIVE");

            spot.setOccupied(true);
            parkingSpotRepository.save(spot);

            return reservationRepository.save(reservation);
        }
        return null;
    }

    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    @Transactional
    public boolean deleteReservation(Long reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId).orElse(null);
        if (reservation != null) {
            // Free up the parking spot
            ParkingSpot spot = reservation.getParkingSpot();
            if (spot != null) {
                spot.setOccupied(false);
                parkingSpotRepository.save(spot);
            }
            
            // Delete the reservation
            reservationRepository.delete(reservation);
            return true;
        }
        return false;
    }
}