package com.example.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.dto.wastecategorydto;
import com.example.entity.wastecategory;
import com.example.mapper.wastecategorymapper;
import com.example.repository.wastecategoryrepository;
import com.example.service.wastecategoryservice;

@Service
public class wastecategoryserviceimpl implements wastecategoryservice {

    @Autowired
    private wastecategoryrepository repo;

    @Override
    public wastecategorydto createwastecategory(wastecategorydto dto) {
        wastecategory entity = wastecategorymapper.mapTowastecategory(dto);
        wastecategory saved = repo.save(entity);
        wastecategorydto result = wastecategorymapper.mapTowastecategorydto(saved);
        result.setId(saved.getId());
        return result;
    }

    @Override
    public wastecategorydto getwastecategoryById(Long id) {
        wastecategory entity = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("WasteCategory not found with id: " + id));
        wastecategorydto result = wastecategorymapper.mapTowastecategorydto(entity);
        result.setId(entity.getId());
        return result;
    }

    @Override
    public List<wastecategorydto> getAllwastecategory() {
        return repo.findAll().stream().map(entity -> {
            wastecategorydto dto = wastecategorymapper.mapTowastecategorydto(entity);
            dto.setId(entity.getId());
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public wastecategorydto updatewastecategory(Long id, wastecategorydto dto) {
        wastecategory existing = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("WasteCategory not found with id: " + id));
        existing.setCategoryName(dto.getCategoryName());
        existing.setDescription(dto.getDescription());
        existing.setParentCategory(dto.getParentCategory());
        existing.setImage(dto.getImage());
        existing.setActive(dto.isActive());
        wastecategory updated = repo.save(existing);
        wastecategorydto result = wastecategorymapper.mapTowastecategorydto(updated);
        result.setId(updated.getId());
        return result;
    }

    @Override
    public void deletewastecategory(Long id) {
        repo.findById(id).orElseThrow(() -> new RuntimeException("WasteCategory not found with id: " + id));
        repo.deleteById(id);
    }
}
