package com.example.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.dto.wastedisposaldto;
import com.example.entity.wastedisposal;
import com.example.mapper.wastedisposalmapper;
import com.example.repository.wastedisposalrepository;
import com.example.service.wastedisposalservice;

@Service
public class wastedisposalserviceimpl implements wastedisposalservice {

    @Autowired
    private wastedisposalrepository repo;

    @Override
    public wastedisposaldto createwastedisposal(wastedisposaldto dto) {
        wastedisposal entity = wastedisposalmapper.mapTowastecategory(dto);
        wastedisposal saved = repo.save(entity);
        wastedisposaldto result = wastedisposalmapper.mapTowastecategorydto(saved);
        result.setId(saved.getId());
        return result;
    }

    @Override
    public wastedisposaldto getwastedisposalById(Long id) {
        wastedisposal entity = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("WasteDisposal not found with id: " + id));
        wastedisposaldto result = wastedisposalmapper.mapTowastecategorydto(entity);
        result.setId(entity.getId());
        return result;
    }

    @Override
    public List<wastedisposaldto> getAllwastedisposal() {
        return repo.findAll().stream().map(entity -> {
            wastedisposaldto dto = wastedisposalmapper.mapTowastecategorydto(entity);
            dto.setId(entity.getId());
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public wastedisposaldto updatewastedisposal(Long id, wastedisposaldto dto) {
        wastedisposal existing = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("WasteDisposal not found with id: " + id));
        existing.setCollectionRequestId(dto.getCollectionRequestId());
        existing.setRecyclingCenterId(dto.getRecyclingCenterId());
        existing.setDisposalMethod(dto.getDisposalMethod());
        existing.setDisposalDate(dto.getDisposalDate());
        existing.setQuantityProcessed(dto.getQuantityProcessed());
        existing.setCompostedOutput(dto.getCompostedOutput());
        existing.setStatus(dto.getStatus());
        existing.setRemarks(dto.getRemarks());
        wastedisposal updated = repo.save(existing);
        wastedisposaldto result = wastedisposalmapper.mapTowastecategorydto(updated);
        result.setId(updated.getId());
        return result;
    }

    @Override
    public void deletewastedisposal(Long id) {
        repo.findById(id).orElseThrow(() -> new RuntimeException("WasteDisposal not found with id: " + id));
        repo.deleteById(id);
    }
}
