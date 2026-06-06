package com.example.mapper;

import com.example.dto.recyclingcenterdto;
import com.example.entity.recyclingcenter;

public class recyclingcentermapper {
	public static recyclingcenterdto mapTorecyclingcenterdto(recyclingcenter recyclingcenter)
	{
		return new recyclingcenterdto(
				
				recyclingcenter.getManagerId(),
				recyclingcenter.getCenterName(),
				recyclingcenter.getCenterType(),
				recyclingcenter.getCapacity(),
				recyclingcenter.getProcessingMethod(),
				recyclingcenter.getLocation(),
				recyclingcenter.getCity(),
				recyclingcenter.getContactNumber(),
				recyclingcenter.getPhoto(),
				recyclingcenter.isActive()
				);
	}
	public static recyclingcenter mapTorecyclingcenter(recyclingcenterdto recyclingcenterdto)
	{
		return new recyclingcenter(
				
				recyclingcenterdto.getManagerId(),
				recyclingcenterdto.getCenterName(),
				recyclingcenterdto.getCenterType(),
				recyclingcenterdto.getCapacity(),
				recyclingcenterdto.getProcessingMethod(),
				recyclingcenterdto.getLocation(),
				recyclingcenterdto.getCity(),
				recyclingcenterdto.getContactNumber(),
				recyclingcenterdto.getPhoto(),
				recyclingcenterdto.isActive()
				);
	}

}
