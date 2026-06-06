package com.example.mapper;
import com.example.dto.collectionrequestdto;
import com.example.entity.collectionrequest;
public class collectionrequestmapper {
	public static collectionrequestdto mapTocollectionrequestdto(collectionrequest collectionrequest)
	{
		return new collectionrequestdto(
				
				collectionrequest.getCollectorId(),
				collectionrequest.getFoodId(),
				collectionrequest.getRequestDate(),
				collectionrequest.getPickupDate(),
				collectionrequest.getCollectionStatus()
				);
	}
	public static collectionrequest mapTocollectionrequest(collectionrequestdto collectionrequestdto)
	{
		return new collectionrequest(
				
				collectionrequestdto.getCollectorId(),
				collectionrequestdto.getFoodId(),
				collectionrequestdto.getRequestDate(),
				collectionrequestdto.getPickupDate(),
				collectionrequestdto.getCollectionStatus()
				);
	}

}
