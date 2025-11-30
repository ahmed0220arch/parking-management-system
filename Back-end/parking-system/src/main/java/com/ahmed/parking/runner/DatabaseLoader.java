package com.ahmed.parking.runner;

import com.ahmed.parking.entity.ParkingSpot;
import com.ahmed.parking.entity.User;
import com.ahmed.parking.repository.ParkingSpotRepository;
import com.ahmed.parking.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DatabaseLoader implements CommandLineRunner {

    private final ParkingSpotRepository parkingSpotRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public DatabaseLoader(ParkingSpotRepository parkingSpotRepository, 
                          UserRepository userRepository, 
                          PasswordEncoder passwordEncoder) {
        this.parkingSpotRepository = parkingSpotRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // 1. Create Default Admin User if none exists
        if (userRepository.count() == 0) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole("ROLE_ADMIN");
            userRepository.save(admin);
            System.out.println("Created Default Admin: username='admin', password='admin123'");
        }

        // 2. Create Dummy Parking Spots if none exist
        if (parkingSpotRepository.count() == 0) {
            System.out.println("No spots found. Creating 10 dummy parking spots...");

            String[] images = {
                "/spot1.jpg",
                "/spot2.jpg",
                "/spot3.avif"
            };

            for (int i = 1; i <= 10; i++) {
                ParkingSpot spot = new ParkingSpot();
                spot.setSpotNumber("A-" + i);
                spot.setFloor("Floor 1");
                spot.setOccupied(false);
                
                // Cycle through local images
                spot.setImageUrl(images[(i - 1) % images.length]); 
                
                parkingSpotRepository.save(spot);
            }
            
            System.out.println("Finished creating spots!");
        } else {
            System.out.println("Spots already exist. Skipping setup.");
        }
    }
}