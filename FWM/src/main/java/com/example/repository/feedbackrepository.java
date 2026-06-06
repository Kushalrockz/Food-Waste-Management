package com.example.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.entity.feedback;


public interface feedbackrepository extends JpaRepository<feedback , Long>{

}
