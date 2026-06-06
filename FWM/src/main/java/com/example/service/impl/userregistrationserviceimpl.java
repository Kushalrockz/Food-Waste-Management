package com.example.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.dto.userregistrationdto;
import com.example.entity.userregistration;
import com.example.mapper.userregistrationmapper;
import com.example.repository.userrepository;
import com.example.service.userregistrationservice;

@Service
public class userregistrationserviceimpl implements userregistrationservice {

    @Autowired
    private userrepository repo;

    @Override
    public userregistrationdto createuser(userregistrationdto userdto) {
        userregistration user = userregistrationmapper.mapTouserregitration(userdto);
        userregistration saved = repo.save(user);
        userregistrationdto result = userregistrationmapper.mapTouserregsitrationdto(saved);
        result.setId(saved.getId());
        return result;
    }

    @Override
    public userregistrationdto getUserregistrationById(Long id) {
        userregistration user = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        userregistrationdto result = userregistrationmapper.mapTouserregsitrationdto(user);
        result.setId(user.getId());
        return result;
    }

    @Override
    public List<userregistrationdto> getAlluser() {
        return repo.findAll().stream().map(user -> {
            userregistrationdto dto = userregistrationmapper.mapTouserregsitrationdto(user);
            dto.setId(user.getId());
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public userregistrationdto updateuser(Long id, userregistrationdto userdto) {
        userregistration existing = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        existing.setName(userdto.getName());
        existing.setEmail(userdto.getEmail());
        existing.setPassword(userdto.getPassword());
        existing.setContact(userdto.getContact());
        existing.setCity(userdto.getCity());
        existing.setAddress(userdto.getAddress());
        existing.setRole(userdto.getRole());
        userregistration updated = repo.save(existing);
        userregistrationdto result = userregistrationmapper.mapTouserregsitrationdto(updated);
        result.setId(updated.getId());
        return result;
    }

    @Override
    public void deleteuser(Long id) {
        repo.findById(id).orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        repo.deleteById(id);
    }
}
