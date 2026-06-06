package com.example.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.dto.userregistrationdto;
import com.example.entity.userregistration;
import com.example.repository.userrepository;
import com.example.service.userregistrationservice;

import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

@RestController
@CrossOrigin(origins = {"http://localhost:5173","http://localhost:5174"})
@RequestMapping("/auth")
public class AuthController {

    private static final Set<String> ALLOWED_EMAIL_PROVIDERS = new HashSet<>(Arrays.asList(
            "gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "edu.in"
    ));

    @Autowired
    private userregistrationservice userService;

    @Autowired
    private userrepository userRepository;

    private boolean containsSpaces(String value) {
        return value != null && value.contains(" ");
    }

    private boolean isValidEmailFormat(String email) {
        if (email == null) return false;
        String trimmed = email.trim();
        if (trimmed.isEmpty() || containsSpaces(trimmed)) return false;
        String[] parts = trimmed.split("@", -1);
        if (parts.length != 2) return false;
        if (parts[0].isEmpty() || parts[1].isEmpty()) return false;
        if (parts[1].startsWith(".") || parts[1].endsWith(".")) return false;
        String[] domainParts = parts[1].split("\\.", -1);
        return domainParts.length == 2 && !domainParts[0].isEmpty() && !domainParts[1].isEmpty();
    }

    private boolean isAllowedEmailProvider(String email) {
        if (!isValidEmailFormat(email)) return false;
        String domain = email.trim().toLowerCase().split("@", -1)[1];
        return ALLOWED_EMAIL_PROVIDERS.contains(domain);
    }

    private String getProviderSuggestion(String email) {
        if (email == null) return "gmail.com";
        String domain = email.trim().toLowerCase();
        if (domain.contains("gmial") || domain.contains("gaiml") || domain.contains("gmaill")) return "gmail.com";
        if (domain.contains("gmail")) return "gmail.com";
        if (domain.contains("yahoo")) return "yahoo.com";
        if (domain.contains("outlook")) return "outlook.com";
        if (domain.contains("hotmail")) return "hotmail.com";
        if (domain.contains("edu")) return "edu.in";
        return "gmail.com";
    }

    private boolean isValidPassword(String password) {
        if (password == null) return false;
        if (password.length() < 8 || password.length() > 20) return false;
        boolean hasUpper = password.matches(".*[A-Z].*");
        boolean hasLower = password.matches(".*[a-z].*");
        boolean hasDigit = password.matches(".*\\d.*");
        boolean hasSpecial = password.matches(".*[^A-Za-z0-9].*");
        return hasUpper && hasLower && hasDigit && hasSpecial;
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody Map<String, String> userData) {
        Map<String, String> response = new HashMap<>();

        // Validate required fields
        String name = userData.get("name");
        String email = userData.get("email");
        String password = userData.get("password");
        String role = userData.get("role");

        if (name == null || name.trim().isEmpty()) {
            response.put("error", "Name is required");
            return ResponseEntity.badRequest().body(response);
        }

        if (email == null || email.trim().isEmpty()) {
            response.put("error", "Email is required");
            return ResponseEntity.badRequest().body(response);
        }

        if (containsSpaces(email)) {
            response.put("error", "Spaces are not allowed");
            return ResponseEntity.badRequest().body(response);
        }

        if (!isValidEmailFormat(email)) {
            response.put("error", "Invalid email format");
            return ResponseEntity.badRequest().body(response);
        }

        if (!isAllowedEmailProvider(email)) {
            response.put("error", "Invalid email provider. Did you mean " + getProviderSuggestion(email) + "?");
            return ResponseEntity.badRequest().body(response);
        }

        if (!isValidPassword(password)) {
            response.put("error", "Password must contain: Uppercase, Lowercase, Number, Special Character");
            return ResponseEntity.badRequest().body(response);
        }

        if (role == null || role.trim().isEmpty()) {
            response.put("error", "Role is required");
            return ResponseEntity.badRequest().body(response);
        }

        // Check if user already exists
        Optional<userregistration> existingUser = userRepository.findByEmailIgnoreCase(email.trim());
        if (existingUser.isPresent()) {
            response.put("error", "Email already registered");
            return ResponseEntity.badRequest().body(response);
        }

        try {
            // Create DTO and save
            userregistrationdto userDTO = new userregistrationdto();
            userDTO.setName(name);
            userDTO.setEmail(email);
            userDTO.setPassword(password);
            userDTO.setRole(role);
            userDTO.setContact(userData.getOrDefault("contact", ""));
            userDTO.setCity(userData.getOrDefault("city", ""));
            userDTO.setAddress(userData.getOrDefault("address", ""));

            userregistrationdto savedUser = userService.createuser(userDTO);

            response.put("message", "User registered successfully");
            response.put("userId", String.valueOf(savedUser.getId()));
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("error", "Registration failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        Map<String, Object> response = new HashMap<>();

        if (email == null || email.trim().isEmpty() || password == null || password.trim().isEmpty()) {
            response.put("error", "Invalid Email or Password");
            return ResponseEntity.badRequest().body(response);
        }

        if (containsSpaces(email) || !isValidEmailFormat(email) || !isAllowedEmailProvider(email)) {
            response.put("error", "Invalid Email");
            return ResponseEntity.badRequest().body(response);
        }

        try {
            Optional<userregistration> userOpt = userRepository.findByEmailIgnoreCase(email.trim());

            if (userOpt.isPresent()) {
                userregistration user = userOpt.get();
                if (password.equals(user.getPassword())) {
                    response.put("success", true);
                    response.put("name", user.getName());
                    response.put("email", user.getEmail());
                    response.put("role", user.getRole());
                    response.put("userId", user.getId());
                    return ResponseEntity.ok(response);
                }
            }

            response.put("error", "Invalid Email or Password");
            return ResponseEntity.badRequest().body(response);

        } catch (Exception e) {
            response.put("error", "Login failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
