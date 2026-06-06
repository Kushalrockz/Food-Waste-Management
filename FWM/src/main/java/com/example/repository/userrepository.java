package com.example.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.entity.userregistration;
import java.util.Optional;

public interface userrepository extends JpaRepository<userregistration, Long> {
	Optional<userregistration> findByEmail(String email);
	Optional<userregistration> findByEmailIgnoreCase(String email);
}