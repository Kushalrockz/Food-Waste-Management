package com.example.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.dto.fooddonnordto;
import com.example.service.fooddonnorservice;

@RestController
@CrossOrigin(origins = {"http://localhost:5173","http://localhost:5174"})
@RequestMapping("/api/fooddonnors")
public class fooddonnorcontroller {

    @Autowired
    private fooddonnorservice service;

    @PostMapping
    public ResponseEntity<fooddonnordto> create(@RequestBody fooddonnordto dto) {
        return new ResponseEntity<>(service.createfooddonnor(dto), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<fooddonnordto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getfooddonnorById(id));
    }

    @GetMapping
    public ResponseEntity<List<fooddonnordto>> getAll() {
        return ResponseEntity.ok(service.getAllfooddonnor());
    }

    @PutMapping("/{id}")
    public ResponseEntity<fooddonnordto> update(@PathVariable Long id, @RequestBody fooddonnordto dto) {
        return ResponseEntity.ok(service.updatefooddonnor(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        service.deletefooddonnor(id);
        return ResponseEntity.ok("FoodDonnor deleted successfully");
    }
}

