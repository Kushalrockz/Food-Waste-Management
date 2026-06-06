package com.example.service;

import java.util.List;

import com.example.dto.reportdto;

public interface reportservice {
	reportdto createreport(reportdto report);
	reportdto getreportById(Long id);
	List<reportdto> getAllreport();
	reportdto updatereport(Long id, reportdto report);
	void deletereport(Long id);
}
