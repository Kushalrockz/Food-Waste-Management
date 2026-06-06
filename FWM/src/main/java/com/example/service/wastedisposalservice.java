package com.example.service;

import java.util.List;

import com.example.dto.wastedisposaldto;

public interface wastedisposalservice {
	wastedisposaldto createwastedisposal(wastedisposaldto wastedisposal);
	wastedisposaldto getwastedisposalById(Long id);
	List<wastedisposaldto> getAllwastedisposal();
	wastedisposaldto updatewastedisposal(Long id, wastedisposaldto wastedisposal);
	void deletewastedisposal(Long id);
}
