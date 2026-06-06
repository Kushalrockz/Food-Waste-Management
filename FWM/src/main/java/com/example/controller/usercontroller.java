package com.example.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.dto.userregistrationdto;
import com.example.service.userregistrationservice;

@RestController
@CrossOrigin(origins = {"http://localhost:5173","http://localhost:5174"})
@RequestMapping("/api/users")
public class usercontroller {

    @Autowired
    private userregistrationservice service;

    @PostMapping
    public ResponseEntity<userregistrationdto> create(@RequestBody userregistrationdto dto) {
        return new ResponseEntity<>(service.createuser(dto), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<userregistrationdto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getUserregistrationById(id));
    }

    @GetMapping
    public ResponseEntity<List<userregistrationdto>> getAll() {
        return ResponseEntity.ok(service.getAlluser());
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<userregistrationdto> update(@PathVariable Long id, @RequestBody userregistrationdto dto) {
        return ResponseEntity.ok(service.updateuser(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        service.deleteuser(id);
        return ResponseEntity.ok("User deleted successfully");
    }
}
