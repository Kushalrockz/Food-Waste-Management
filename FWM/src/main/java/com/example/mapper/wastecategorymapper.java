package com.example.mapper;

import com.example.dto.wastecategorydto;
import com.example.entity.wastecategory;

public class wastecategorymapper {
	public static wastecategorydto mapTowastecategorydto(wastecategory wastecategory)
	{
		return new wastecategorydto(
				
				wastecategory.getCategoryName(),
				wastecategory.getDescription(),
				wastecategory.getParentCategory(),
				wastecategory.getImage(),
				wastecategory.isActive()
				);
	}
	public static wastecategory mapTowastecategory(wastecategorydto wastecategorydto)
	{
		return new wastecategory(
				
				wastecategorydto.getCategoryName(),
				wastecategorydto.getDescription(),
				wastecategorydto.getParentCategory(),
				wastecategorydto.getImage(),
				wastecategorydto.isActive()
				);

	}
}
