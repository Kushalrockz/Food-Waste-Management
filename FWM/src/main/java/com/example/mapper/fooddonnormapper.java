package com.example.mapper;

import com.example.dto.fooddonnordto;

import com.example.entity.fooddonnor;

public class fooddonnormapper {
	public static fooddonnordto mapTofooddonnordto(fooddonnor fooddonnor)
	{
		return new fooddonnordto(
				
				fooddonnor.getUserId(),
				fooddonnor.getOrganizationName(),
				fooddonnor.getDonorType(),
				fooddonnor.getExperienceYears(),
				fooddonnor.getBio(),
				fooddonnor.getRating(),
				fooddonnor.getLocation(),
				fooddonnor.getProfilePhoto()
				);
	}
	public static fooddonnor mapTofooddonnor(fooddonnordto fooddonnordto)
	{
		return new fooddonnor(
				
				fooddonnordto.getUserId(),
				fooddonnordto.getOrganizationName(),
				fooddonnordto.getDonorType(),
				fooddonnordto.getExperienceYears(),
				fooddonnordto.getBio(),
				fooddonnordto.getRating(),
				fooddonnordto.getLocation(),
				fooddonnordto.getProfilePhoto()
				);
	}

}
