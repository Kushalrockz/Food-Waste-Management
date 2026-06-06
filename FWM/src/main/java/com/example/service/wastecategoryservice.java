package com.example.service;

import java.util.List;

import com.example.dto.wastecategorydto;

public interface wastecategoryservice {
	wastecategorydto createwastecategory(wastecategorydto wastecategory);
	wastecategorydto getwastecategoryById(Long id);
	List<wastecategorydto> getAllwastecategory();
	wastecategorydto updatewastecategory(Long id, wastecategorydto wastecategory);
	void deletewastecategory(Long id);
}
