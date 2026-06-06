package com.example.mapper;

import com.example.dto.foodwasteentrydto;
import com.example.entity.foodwasteentry;

public class foodwasteentrymapper {
	public static foodwasteentrydto mapTofoodwasteentrydto(foodwasteentry foodwasteentry)
	{
		return new foodwasteentrydto(
				
				foodwasteentry.getDonorId(),
				foodwasteentry.getFoodItemName(),
				foodwasteentry.getDescription(),
				foodwasteentry.getQuantity(),
				foodwasteentry.getExpiryDate(),
				foodwasteentry.getPickupAddress(),
				foodwasteentry.getPickupCity(),
				foodwasteentry.isAvailable()
				);
	}
	public static foodwasteentry mapTofoodwasteentry(foodwasteentrydto foodwasteentrydto)
	{
		return new foodwasteentry(
				
				foodwasteentrydto.getDonorId(),
				foodwasteentrydto.getFoodItemName(),
				foodwasteentrydto.getDescription(),
				foodwasteentrydto.getQuantity(),
				foodwasteentrydto.getExpiryDate(),
				foodwasteentrydto.getPickupAddress(),
				foodwasteentrydto.getPickupCity(),
				foodwasteentrydto.isAvailable()
				);
	}

}
