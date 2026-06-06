package com.example.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.entity.fooddonnor;

public interface fooddonnorrepository extends JpaRepository<fooddonnor , Long> {

}
