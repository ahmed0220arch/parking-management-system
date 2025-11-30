package com.ahmed.parking.controller;

import com.ahmed.parking.config.JwtUtil;
import com.ahmed.parking.entity.User;
import com.ahmed.parking.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody User loginRequest) {
        // 1. Find the user
        User user = userRepository.findByUsername(loginRequest.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 2. Check Password
        if (passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            // 3. Generate Token
            String token = jwtUtil.generateToken(user.getUsername());
            
            // 4. Return Token
            Map<String, String> response = new HashMap<>();
            response.put("token", token);
            response.put("role", user.getRole());
            return response;
        } else {
            throw new RuntimeException("Invalid password");
        }
    }

    // URL: POST http://localhost:8081/api/auth/register
    @PostMapping("/register")
    public org.springframework.http.ResponseEntity<?> register(@RequestBody User user) {
        // 1. Check if username exists
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            return org.springframework.http.ResponseEntity
                .badRequest()
                .body("Error: Username is already taken!");
        }

        // 2. Encrypt the password (Security)
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // 3. Set default role
        user.setRole("ROLE_USER");

        // 4. Save to DB
        userRepository.save(user);

        return org.springframework.http.ResponseEntity.ok("User registered successfully!");
    }
}