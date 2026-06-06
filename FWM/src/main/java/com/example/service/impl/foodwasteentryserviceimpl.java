package com.example.service.impl;

import java.util.List;
import java.util.stream.Collectors;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.dto.foodwasteentrydto;
import com.example.dto.collectionrequestdto;
import com.example.entity.foodwasteentry;
import com.example.entity.collectionrequest;
import com.example.mapper.foodwasteentrymapper;
import com.example.mapper.collectionrequestmapper;
import com.example.repository.foodwasteentryrepository;
import com.example.repository.collectionrequestrepository;
import com.example.service.foodwasteentryservice;

@Service
public class foodwasteentryserviceimpl implements foodwasteentryservice {

    @Autowired
    private foodwasteentryrepository repo;

    @Autowired
    private collectionrequestrepository collectionrequestrepository;

    @Override
    public foodwasteentrydto createfoodwasteentry(foodwasteentrydto dto) {
        foodwasteentry entity = foodwasteentrymapper.mapTofoodwasteentry(dto);
        foodwasteentry saved = repo.save(entity);
        foodwasteentrydto result = foodwasteentrymapper.mapTofoodwasteentrydto(saved);
        result.setId(saved.getId());

        // Auto-create a collection request for this food waste entry
        try {
            String now = LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME);
            collectionrequest collectionReq = new collectionrequest(
                null,  // collectorId is null (unassigned)
                saved.getId(),  // foodId = this food waste entry
                now,  // requestDate
                dto.getExpiryDate() != null ? dto.getExpiryDate() : now,  // pickupDate
                "PENDING"  // collectionStatus
            );
            collectionrequestrepository.save(collectionReq);
            System.out.println("Collection request auto-created for food waste entry " + saved.getId());
        } catch (Exception e) {
            // Log but don't fail the food waste entry creation
            e.printStackTrace();
            System.err.println("Warning: Failed to create collection request for food waste entry: " + e.getMessage());
        }

        return result;
    }

    @Override
    public foodwasteentrydto getfoodwasteentryById(Long id) {
        foodwasteentry entity = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("FoodWasteEntry not found with id: " + id));
        foodwasteentrydto result = foodwasteentrymapper.mapTofoodwasteentrydto(entity);
        result.setId(entity.getId());
        return result;
    }

    @Override
    public List<foodwasteentrydto> getAllfoodwasteentry() {
        return repo.findAll().stream().map(entity -> {
            foodwasteentrydto dto = foodwasteentrymapper.mapTofoodwasteentrydto(entity);
            dto.setId(entity.getId());
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public foodwasteentrydto updatefoodwasteentry(Long id, foodwasteentrydto dto) {
        foodwasteentry existing = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("FoodWasteEntry not found with id: " + id));
        existing.setDonorId(dto.getDonorId());
        existing.setFoodItemName(dto.getFoodItemName());
        existing.setDescription(dto.getDescription());
        existing.setQuantity(dto.getQuantity());
        existing.setExpiryDate(dto.getExpiryDate());
        existing.setPickupAddress(dto.getPickupAddress());
        existing.setPickupCity(dto.getPickupCity());
        existing.setAvailable(dto.isAvailable());
        foodwasteentry updated = repo.save(existing);
        foodwasteentrydto result = foodwasteentrymapper.mapTofoodwasteentrydto(updated);
        result.setId(updated.getId());
        return result;
    }

    @Override
    public void deletefoodwasteentry(Long id) {
        repo.findById(id).orElseThrow(() -> new RuntimeException("FoodWasteEntry not found with id: " + id));
        repo.deleteById(id);
    }
}
