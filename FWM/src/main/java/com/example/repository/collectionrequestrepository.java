package com.example.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.entity.collectionrequest;
	
	public interface collectionrequestrepository extends JpaRepository<collectionrequest, Long> {
		
	}

