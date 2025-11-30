package com.ahmed.parking.repository;

import com.ahmed.parking.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    // Find all reservations for a specific user's car
    List<Reservation> findByVehicleId(Long vehicleId);
}