package com.example.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.dto.recyclingcenterdto;
import com.example.entity.recyclingcenter;
import com.example.mapper.recyclingcentermapper;
import com.example.repository.recyclingcenterrepository;
import com.example.service.recyclingcenterservice;

@Service
public class recyclingcenterserviceimpl implements recyclingcenterservice {

    @Autowired
    private recyclingcenterrepository repo;

    @Override
    public recyclingcenterdto createrecyclingcenter(recyclingcenterdto dto) {
        recyclingcenter entity = recyclingcentermapper.mapTorecyclingcenter(dto);
        recyclingcenter saved = repo.save(entity);
        recyclingcenterdto result = recyclingcentermapper.mapTorecyclingcenterdto(saved);
        result.setId(saved.getId());
        return result;
    }

    @Override
    public recyclingcenterdto getrecyclingcenterById(Long id) {
        recyclingcenter entity = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("RecyclingCenter not found with id: " + id));
        recyclingcenterdto result = recyclingcentermapper.mapTorecyclingcenterdto(entity);
        result.setId(entity.getId());
        return result;
    }

    @Override
    public List<recyclingcenterdto> getAllrecyclingcenter() {
        return repo.findAll().stream().map(entity -> {
            recyclingcenterdto dto = recyclingcentermapper.mapTorecyclingcenterdto(entity);
            dto.setId(entity.getId());
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public recyclingcenterdto updaterecyclingcenter(Long id, recyclingcenterdto dto) {
        recyclingcenter existing = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("RecyclingCenter not found with id: " + id));
        existing.setManagerId(dto.getManagerId());
        existing.setCenterName(dto.getCenterName());
        existing.setCenterType(dto.getCenterType());
        existing.setCapacity(dto.getCapacity());
        existing.setProcessingMethod(dto.getProcessingMethod());
        existing.setLocation(dto.getLocation());
        existing.setCity(dto.getCity());
        existing.setContactNumber(dto.getContactNumber());
        existing.setPhoto(dto.getPhoto());
        existing.setActive(dto.isActive());
        recyclingcenter updated = repo.save(existing);
        recyclingcenterdto result = recyclingcentermapper.mapTorecyclingcenterdto(updated);
        result.setId(updated.getId());
        return result;
    }

    @Override
    public void deleterecyclingcenter(Long id) {
        repo.findById(id).orElseThrow(() -> new RuntimeException("RecyclingCenter not found with id: " + id));
        repo.deleteById(id);
    }
}
