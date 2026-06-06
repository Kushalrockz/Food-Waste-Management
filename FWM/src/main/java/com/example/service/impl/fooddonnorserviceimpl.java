package com.example.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.dto.fooddonnordto;
import com.example.entity.fooddonnor;
import com.example.mapper.fooddonnormapper;
import com.example.repository.fooddonnorrepository;
import com.example.service.fooddonnorservice;

@Service
public class fooddonnorserviceimpl implements fooddonnorservice {

    @Autowired
    private fooddonnorrepository repo;

    @Override
    public fooddonnordto createfooddonnor(fooddonnordto dto) {
        fooddonnor entity = fooddonnormapper.mapTofooddonnor(dto);
        fooddonnor saved = repo.save(entity);
        fooddonnordto result = fooddonnormapper.mapTofooddonnordto(saved);
        result.setId(saved.getId());
        return result;
    }

    @Override
    public fooddonnordto getfooddonnorById(Long id) {
        fooddonnor entity = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("FoodDonnor not found with id: " + id));
        fooddonnordto result = fooddonnormapper.mapTofooddonnordto(entity);
        result.setId(entity.getId());
        return result;
    }

    @Override
    public List<fooddonnordto> getAllfooddonnor() {
        return repo.findAll().stream().map(entity -> {
            fooddonnordto dto = fooddonnormapper.mapTofooddonnordto(entity);
            dto.setId(entity.getId());
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public fooddonnordto updatefooddonnor(Long id, fooddonnordto dto) {
        fooddonnor existing = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("FoodDonnor not found with id: " + id));
        existing.setUserId(dto.getUserId());
        existing.setOrganizationName(dto.getOrganizationName());
        existing.setDonorType(dto.getDonorType());
        existing.setExperienceYears(dto.getExperienceYears());
        existing.setBio(dto.getBio());
        existing.setRating(dto.getRating());
        existing.setLocation(dto.getLocation());
        existing.setProfilePhoto(dto.getProfilePhoto());
        fooddonnor updated = repo.save(existing);
        fooddonnordto result = fooddonnormapper.mapTofooddonnordto(updated);
        result.setId(updated.getId());
        return result;
    }

    @Override
    public void deletefooddonnor(Long id) {
        repo.findById(id).orElseThrow(() -> new RuntimeException("FoodDonnor not found with id: " + id));
        repo.deleteById(id);
    }
}
