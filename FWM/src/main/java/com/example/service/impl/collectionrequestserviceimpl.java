package com.example.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.dto.collectionrequestdto;
import com.example.entity.collectionrequest;
import com.example.mapper.collectionrequestmapper;
import com.example.repository.collectionrequestrepository;
import com.example.service.collectionrequestservice;

@Service
public class collectionrequestserviceimpl implements collectionrequestservice {

    @Autowired
    private collectionrequestrepository repo;

    @Override
    public collectionrequestdto createcollectionrequest(collectionrequestdto dto) {
        collectionrequest entity = collectionrequestmapper.mapTocollectionrequest(dto);
        collectionrequest saved = repo.save(entity);
        collectionrequestdto result = collectionrequestmapper.mapTocollectionrequestdto(saved);
        result.setId(saved.getId());
        return result;
    }

    @Override
    public collectionrequestdto getcollectionrequestById(Long id) {
        collectionrequest entity = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("CollectionRequest not found with id: " + id));
        collectionrequestdto result = collectionrequestmapper.mapTocollectionrequestdto(entity);
        result.setId(entity.getId());
        return result;
    }

    @Override
    public List<collectionrequestdto> getAllcollectionrequest() {
        return repo.findAll().stream().map(entity -> {
            collectionrequestdto dto = collectionrequestmapper.mapTocollectionrequestdto(entity);
            dto.setId(entity.getId());
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public collectionrequestdto updatecollectionrequest(Long id, collectionrequestdto dto) {
        collectionrequest existing = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("CollectionRequest not found with id: " + id));
        existing.setCollectorId(dto.getCollectorId());
        existing.setFoodId(dto.getFoodId());
        existing.setRequestDate(dto.getRequestDate());
        existing.setPickupDate(dto.getPickupDate());
        existing.setCollectionStatus(dto.getCollectionStatus());
        collectionrequest updated = repo.save(existing);
        collectionrequestdto result = collectionrequestmapper.mapTocollectionrequestdto(updated);
        result.setId(updated.getId());
        return result;
    }

    @Override
    public void deletecollectionrequest(Long id) {
        repo.findById(id).orElseThrow(() -> new RuntimeException("CollectionRequest not found with id: " + id));
        repo.deleteById(id);
    }
}
