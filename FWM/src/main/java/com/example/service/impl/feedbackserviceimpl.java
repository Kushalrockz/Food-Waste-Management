package com.example.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.dto.feedbackdto;
import com.example.entity.feedback;
import com.example.mapper.feedbackmapper;
import com.example.repository.feedbackrepository;
import com.example.service.feedbackservice;

@Service
public class feedbackserviceimpl implements feedbackservice {

    @Autowired
    private feedbackrepository repo;

    @Override
    public feedbackdto createfeedback(feedbackdto dto) {
        feedback entity = feedbackmapper.mapTofeedback(dto);
        feedback saved = repo.save(entity);
        feedbackdto result = feedbackmapper.mapTofeedbackdto(saved);
        result.setId(saved.getId());
        return result;
    }

    @Override
    public feedbackdto getfeedbackById(Long id) {
        feedback entity = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Feedback not found with id: " + id));
        feedbackdto result = feedbackmapper.mapTofeedbackdto(entity);
        result.setId(entity.getId());
        return result;
    }

    @Override
    public List<feedbackdto> getAllfeedback() {
        return repo.findAll().stream().map(entity -> {
            feedbackdto dto = feedbackmapper.mapTofeedbackdto(entity);
            dto.setId(entity.getId());
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public feedbackdto updatefeedback(Long id, feedbackdto dto) {
        feedback existing = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Feedback not found with id: " + id));
        existing.setReviewerId(dto.getReviewerId());
        existing.setDonorId(dto.getDonorId());
        existing.setRecyclingCenterId(dto.getRecyclingCenterId());
        existing.setRating(dto.getRating());
        existing.setComments(dto.getComments());
        existing.setReviewDate(dto.getReviewDate());
        existing.setPhoto(dto.getPhoto());
        feedback updated = repo.save(existing);
        feedbackdto result = feedbackmapper.mapTofeedbackdto(updated);
        result.setId(updated.getId());
        return result;
    }

    @Override
    public void deletefeedback(Long id) {
        repo.findById(id).orElseThrow(() -> new RuntimeException("Feedback not found with id: " + id));
        repo.deleteById(id);
    }
}
