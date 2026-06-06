package com.example.mapper;

import com.example.dto.reportdto;
import com.example.entity.report;

public class reportmapper {
	public static reportdto mapToreportdto(report report)
	{
		return new reportdto(
				
				report.getGeneratedBy(),
				report.getDonorId(),
				report.getRecyclingCenterId(),
				report.getReportType(),
				report.getPeriodFrom(),
				report.getPeriodTo(),
				report.getTotalWasteCollected(),
				report.getTotalWasteRecycled(),
				report.getGeneratedDate(),
				report.getReportFile()
				);
	}
	public static report mapToreport(reportdto reportdto)
	{
		return new report(
				
				reportdto.getGeneratedBy(),
				reportdto.getDonorId(),
				reportdto.getRecyclingCenterId(),
				reportdto.getReportType(),
				reportdto.getPeriodFrom(),
				reportdto.getPeriodTo(),
				reportdto.getTotalWasteCollected(),
				reportdto.getTotalWasteRecycled(),
				reportdto.getGeneratedDate(),
				reportdto.getReportFile()
				);
	}

}
