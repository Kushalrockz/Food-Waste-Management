package com.example.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.dto.wastedisposaldto;
import com.example.service.wastedisposalservice;

@RestController
@CrossOrigin(origins = {"http://localhost:5173","http://localhost:5174"})
@RequestMapping("/api/wastedisposals")
public class wastedisposalcontroller {

    @Autowired
    private wastedisposalservice service;

    @PostMapping
    public ResponseEntity<wastedisposaldto> create(@RequestBody wastedisposaldto dto) {
        return new ResponseEntity<>(service.createwastedisposal(dto), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<wastedisposaldto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getwastedisposalById(id));
    }

    @GetMapping
    public ResponseEntity<List<wastedisposaldto>> getAll() {
        return ResponseEntity.ok(service.getAllwastedisposal());
    }

    @PutMapping("/{id}")
    public ResponseEntity<wastedisposaldto> update(@PathVariable Long id, @RequestBody wastedisposaldto dto) {
        return ResponseEntity.ok(service.updatewastedisposal(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        service.deletewastedisposal(id);
        return ResponseEntity.ok("WasteDisposal deleted successfully");
    }
}

