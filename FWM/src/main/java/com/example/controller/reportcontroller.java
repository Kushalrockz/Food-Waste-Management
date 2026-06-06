package com.example.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.dto.reportdto;
import com.example.service.reportservice;

@RestController
@CrossOrigin(origins = {"http://localhost:5173","http://localhost:5174"})
@RequestMapping("/api/reports")
public class reportcontroller {

    @Autowired
    private reportservice service;

    @PostMapping
    public ResponseEntity<reportdto> create(@RequestBody reportdto dto) {
        return new ResponseEntity<>(service.createreport(dto), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<reportdto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getreportById(id));
    }

    @GetMapping
    public ResponseEntity<List<reportdto>> getAll() {
        return ResponseEntity.ok(service.getAllreport());
    }

    @PutMapping("/{id}")
    public ResponseEntity<reportdto> update(@PathVariable Long id, @RequestBody reportdto dto) {
        return ResponseEntity.ok(service.updatereport(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        service.deletereport(id);
        return ResponseEntity.ok("Report deleted successfully");
    }
}

