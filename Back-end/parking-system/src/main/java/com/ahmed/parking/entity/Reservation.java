package com.ahmed.parking.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "reservations")
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Many reservations can belong to ONE vehicle
    @ManyToOne
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;

    // Many reservations can be for ONE spot (at different times)
    @ManyToOne
    @JoinColumn(name = "spot_id", nullable = false)
    private ParkingSpot parkingSpot;

    private LocalDateTime startTime;
    private LocalDateTime endTime;
    
    // Status: PENDING, ACTIVE, COMPLETED, CANCELLED
    private String status; 
}