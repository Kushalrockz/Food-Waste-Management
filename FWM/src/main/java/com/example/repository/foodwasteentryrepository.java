package com.example.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.entity.foodwasteentry;

public interface foodwasteentryrepository extends JpaRepository<foodwasteentry , Long> {

}
