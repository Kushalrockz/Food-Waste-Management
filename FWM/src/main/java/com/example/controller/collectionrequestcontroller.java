package com.example.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.dto.collectionrequestdto;
import com.example.service.collectionrequestservice;

@RestController
@CrossOrigin(origins = {"http://localhost:5173","http://localhost:5174"})
@RequestMapping("/api/collectionrequests")
public class collectionrequestcontroller {

    @Autowired
    private collectionrequestservice service;

    @PostMapping
    public ResponseEntity<collectionrequestdto> create(@RequestBody collectionrequestdto dto) {
        return new ResponseEntity<>(service.createcollectionrequest(dto), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<collectionrequestdto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getcollectionrequestById(id));
    }

    @GetMapping
    public ResponseEntity<List<collectionrequestdto>> getAll() {
        return ResponseEntity.ok(service.getAllcollectionrequest());
    }

    @PutMapping("/{id}")
    public ResponseEntity<collectionrequestdto> update(@PathVariable Long id, @RequestBody collectionrequestdto dto) {
        return ResponseEntity.ok(service.updatecollectionrequest(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        service.deletecollectionrequest(id);
        return ResponseEntity.ok("CollectionRequest deleted successfully");
    }
}

