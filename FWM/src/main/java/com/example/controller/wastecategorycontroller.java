package com.example.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.dto.wastecategorydto;
import com.example.service.wastecategoryservice;

@RestController
@CrossOrigin(origins = {"http://localhost:5173","http://localhost:5174"})
@RequestMapping("/api/wastecategories")
public class wastecategorycontroller {

    @Autowired
    private wastecategoryservice service;

    @PostMapping
    public ResponseEntity<wastecategorydto> create(@RequestBody wastecategorydto dto) {
        return new ResponseEntity<>(service.createwastecategory(dto), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<wastecategorydto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getwastecategoryById(id));
    }

    @GetMapping
    public ResponseEntity<List<wastecategorydto>> getAll() {
        return ResponseEntity.ok(service.getAllwastecategory());
    }

    @PutMapping("/{id}")
    public ResponseEntity<wastecategorydto> update(@PathVariable Long id, @RequestBody wastecategorydto dto) {
        return ResponseEntity.ok(service.updatewastecategory(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        service.deletewastecategory(id);
        return ResponseEntity.ok("WasteCategory deleted successfully");
    }
}

