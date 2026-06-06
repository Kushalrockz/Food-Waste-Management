package com.example.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.dto.recyclingcenterdto;
import com.example.service.recyclingcenterservice;

@RestController
@CrossOrigin(origins = {"http://localhost:5173","http://localhost:5174"})
@RequestMapping("/api/recyclingcenters")
public class recyclingcentercontroller {

    @Autowired
    private recyclingcenterservice service;

    @PostMapping
    public ResponseEntity<recyclingcenterdto> create(@RequestBody recyclingcenterdto dto) {
        return new ResponseEntity<>(service.createrecyclingcenter(dto), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<recyclingcenterdto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getrecyclingcenterById(id));
    }

    @GetMapping
    public ResponseEntity<List<recyclingcenterdto>> getAll() {
        return ResponseEntity.ok(service.getAllrecyclingcenter());
    }

    @PutMapping("/{id}")
    public ResponseEntity<recyclingcenterdto> update(@PathVariable Long id, @RequestBody recyclingcenterdto dto) {
        return ResponseEntity.ok(service.updaterecyclingcenter(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        service.deleterecyclingcenter(id);
        return ResponseEntity.ok("RecyclingCenter deleted successfully");
    }
}

