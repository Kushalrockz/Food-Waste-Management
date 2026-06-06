package com.example.service;

import java.util.List;

import com.example.dto.userregistrationdto;

public interface userregistrationservice {
	userregistrationdto createuser(userregistrationdto user);
	userregistrationdto getUserregistrationById(Long id);
	List<userregistrationdto> getAlluser();
	userregistrationdto updateuser(Long id, userregistrationdto user);
	void deleteuser(Long id);
}
