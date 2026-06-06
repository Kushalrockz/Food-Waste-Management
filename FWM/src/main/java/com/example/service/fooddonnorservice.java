package com.example.service;

import java.util.List;

import com.example.dto.fooddonnordto;

public interface fooddonnorservice {
	fooddonnordto createfooddonnor(fooddonnordto fooddonnor);
	fooddonnordto getfooddonnorById(Long id);
	List<fooddonnordto> getAllfooddonnor();
	fooddonnordto updatefooddonnor(Long id, fooddonnordto fooddonnor);
	void deletefooddonnor(Long id);
}
