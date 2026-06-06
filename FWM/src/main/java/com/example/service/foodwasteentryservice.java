package com.example.service;

import java.util.List;

import com.example.dto.foodwasteentrydto;

public interface foodwasteentryservice {
	foodwasteentrydto createfoodwasteentry(foodwasteentrydto foodwasteentry);
	foodwasteentrydto getfoodwasteentryById(Long id);
	List<foodwasteentrydto> getAllfoodwasteentry();
	foodwasteentrydto updatefoodwasteentry(Long id, foodwasteentrydto foodwasteentry);
	void deletefoodwasteentry(Long id);
}
