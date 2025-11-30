package com.ahmed.parking.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "parking_spots")
public class ParkingSpot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String spotNumber; // e.g., "A-101"

    private String floor; // e.g., "Level 1"

    private String imageUrl; // URL to the image (e.g., "https://example.com/spot1.jpg")

    private boolean isOccupied = false; // Default is free
}