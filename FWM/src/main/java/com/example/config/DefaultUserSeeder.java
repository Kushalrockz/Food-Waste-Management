package com.example.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.example.dto.userregistrationdto;
import com.example.repository.userrepository;
import com.example.service.userregistrationservice;

@Component
public class DefaultUserSeeder implements CommandLineRunner {

    @Autowired
    private userrepository userRepository;

    @Autowired
    private userregistrationservice userService;

    @Override
    public void run(String... args) {
        // Delete old user accounts if they exist with old emails
        userRepository.findByEmail("admin@example.com").ifPresent(userRepository::delete);
        userRepository.findByEmail("recycler@example.com").ifPresent(userRepository::delete);
        userRepository.findByEmail("donor@example.com").ifPresent(userRepository::delete);
        userRepository.findByEmail("donor@gmail.com").ifPresent(userRepository::delete); // Also delete new one if it exists
        
        // Seed updated credentials
        seedUser("admin@gmail.com", "Admin123", "admin", "Admin User", "0000000000", "Mumbai", "Head Office");
        seedUser("recycler@gmail.com", "Recycler123", "recycler", "Recycler User", "0000000000", "Mumbai", "Recycler Hub");
        seedUser("donor@gmail.com", "Donor123", "donor", "Donor User", "0000000000", "Mumbai", "Donor Address");
    }

    private void seedUser(String email, String password, String role, String name, String contact, String city, String address) {
        // Always try to create/update the user
        try {
            userregistrationdto dto = new userregistrationdto();
            dto.setName(name);
            dto.setEmail(email);
            dto.setPassword(password);
            dto.setRole(role);
            dto.setContact(contact);
            dto.setCity(city);
            dto.setAddress(address);
            userService.createuser(dto);
            System.out.println("Seeded default user: " + email + " / " + password + " (" + role + ")");
        } catch (Exception e) {
            System.out.println("Failed to seed user " + email + ": " + e.getMessage());
        }
    }
}
