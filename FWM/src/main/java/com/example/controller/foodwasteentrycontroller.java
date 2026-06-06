package com.example.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.dto.foodwasteentrydto;
import com.example.service.foodwasteentryservice;

@RestController
@CrossOrigin(origins = {"http://localhost:5173","http://localhost:5174"})
@RequestMapping("/api/foodwasteentries")
public class foodwasteentrycontroller {

    @Autowired
    private foodwasteentryservice service;

    @PostMapping
    public ResponseEntity<foodwasteentrydto> create(@RequestBody foodwasteentrydto dto) {
        return new ResponseEntity<>(service.createfoodwasteentry(dto), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<foodwasteentrydto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getfoodwasteentryById(id));
    }

    @GetMapping
    public ResponseEntity<List<foodwasteentrydto>> getAll() {
        return ResponseEntity.ok(service.getAllfoodwasteentry());
    }

    @PutMapping("/{id}")
    public ResponseEntity<foodwasteentrydto> update(@PathVariable Long id, @RequestBody foodwasteentrydto dto) {
        return ResponseEntity.ok(service.updatefoodwasteentry(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        service.deletefoodwasteentry(id);
        return ResponseEntity.ok("FoodWasteEntry deleted successfully");
    }
}

