package com.example.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.dto.feedbackdto;
import com.example.service.feedbackservice;

@RestController
@CrossOrigin(origins = {"http://localhost:5173","http://localhost:5174"})
@RequestMapping("/api/feedbacks")
public class feedbackcontroller {

    @Autowired
    private feedbackservice service;

    @PostMapping
    public ResponseEntity<feedbackdto> create(@RequestBody feedbackdto dto) {
        return new ResponseEntity<>(service.createfeedback(dto), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<feedbackdto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getfeedbackById(id));
    }

    @GetMapping
    public ResponseEntity<List<feedbackdto>> getAll() {
        return ResponseEntity.ok(service.getAllfeedback());
    }

    @PutMapping("/{id}")
    public ResponseEntity<feedbackdto> update(@PathVariable Long id, @RequestBody feedbackdto dto) {
        return ResponseEntity.ok(service.updatefeedback(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        service.deletefeedback(id);
        return ResponseEntity.ok("Feedback deleted successfully");
    }
}

