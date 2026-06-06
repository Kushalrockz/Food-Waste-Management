package com.example.service;

import java.util.List;

import com.example.dto.recyclingcenterdto;

public interface recyclingcenterservice {
	recyclingcenterdto createrecyclingcenter(recyclingcenterdto recyclingcenter);
	recyclingcenterdto getrecyclingcenterById(Long id);
	List<recyclingcenterdto> getAllrecyclingcenter();
	recyclingcenterdto updaterecyclingcenter(Long id, recyclingcenterdto recyclingcenter);
	void deleterecyclingcenter(Long id);
}
