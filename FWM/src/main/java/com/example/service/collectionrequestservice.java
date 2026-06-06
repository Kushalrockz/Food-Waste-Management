package com.example.service;

import java.util.List;

import com.example.dto.collectionrequestdto;

public interface collectionrequestservice {
	collectionrequestdto createcollectionrequest(collectionrequestdto collection);
	collectionrequestdto getcollectionrequestById(Long id);
	List<collectionrequestdto> getAllcollectionrequest();
	collectionrequestdto updatecollectionrequest(Long id, collectionrequestdto collection);
	void deletecollectionrequest(Long id);
}
