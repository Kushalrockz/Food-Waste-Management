package com.example.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.entity.wastecategory;

public interface wastecategoryrepository extends JpaRepository<wastecategory,Long> {

}
