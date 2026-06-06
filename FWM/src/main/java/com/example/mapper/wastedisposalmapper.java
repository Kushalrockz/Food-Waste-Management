package com.example.mapper;

import com.example.dto.wastedisposaldto;
import com.example.entity.wastedisposal;

public class wastedisposalmapper {
	public static wastedisposaldto mapTowastecategorydto(wastedisposal wastedisposal)
	{
		return new wastedisposaldto(
				
				wastedisposal.getCollectionRequestId(),
				wastedisposal.getRecyclingCenterId(),
				wastedisposal.getDisposalMethod(),
				wastedisposal.getDisposalDate(),
				wastedisposal.getQuantityProcessed(),
				wastedisposal.getCompostedOutput(),
				wastedisposal.getStatus(),
				wastedisposal.getRemarks()
				);
	}
	public static wastedisposal mapTowastecategory(wastedisposaldto wastedisposaldto)
	{
		return new wastedisposal(
				
				wastedisposaldto.getCollectionRequestId(),
				wastedisposaldto.getRecyclingCenterId(),
				wastedisposaldto.getDisposalMethod(),
				wastedisposaldto.getDisposalDate(),
				wastedisposaldto.getQuantityProcessed(),
				wastedisposaldto.getCompostedOutput(),
				wastedisposaldto.getStatus(),
				wastedisposaldto.getRemarks()
				);

	}

}
