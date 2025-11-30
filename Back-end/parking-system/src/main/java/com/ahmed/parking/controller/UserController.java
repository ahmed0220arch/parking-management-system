package com.ahmed.parking.controller;

import com.ahmed.parking.entity.User;
import com.ahmed.parking.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // Admin wants to see who is registered
    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}