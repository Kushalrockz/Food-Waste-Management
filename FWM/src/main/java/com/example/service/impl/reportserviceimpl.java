package com.example.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.dto.reportdto;
import com.example.entity.report;
import com.example.mapper.reportmapper;
import com.example.repository.reportrepository;
import com.example.service.reportservice;

@Service
public class reportserviceimpl implements reportservice {

    @Autowired
    private reportrepository repo;

    @Override
    public reportdto createreport(reportdto dto) {
        report entity = reportmapper.mapToreport(dto);
        report saved = repo.save(entity);
        reportdto result = reportmapper.mapToreportdto(saved);
        result.setId(saved.getId());
        return result;
    }

    @Override
    public reportdto getreportById(Long id) {
        report entity = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Report not found with id: " + id));
        reportdto result = reportmapper.mapToreportdto(entity);
        result.setId(entity.getId());
        return result;
    }

    @Override
    public List<reportdto> getAllreport() {
        return repo.findAll().stream().map(entity -> {
            reportdto dto = reportmapper.mapToreportdto(entity);
            dto.setId(entity.getId());
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public reportdto updatereport(Long id, reportdto dto) {
        report existing = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Report not found with id: " + id));
        existing.setGeneratedBy(dto.getGeneratedBy());
        existing.setDonorId(dto.getDonorId());
        existing.setRecyclingCenterId(dto.getRecyclingCenterId());
        existing.setReportType(dto.getReportType());
        existing.setPeriodFrom(dto.getPeriodFrom());
        existing.setPeriodTo(dto.getPeriodTo());
        existing.setTotalWasteCollected(dto.getTotalWasteCollected());
        existing.setTotalWasteRecycled(dto.getTotalWasteRecycled());
        existing.setGeneratedDate(dto.getGeneratedDate());
        existing.setReportFile(dto.getReportFile());
        report updated = repo.save(existing);
        reportdto result = reportmapper.mapToreportdto(updated);
        result.setId(updated.getId());
        return result;
    }

    @Override
    public void deletereport(Long id) {
        repo.findById(id).orElseThrow(() -> new RuntimeException("Report not found with id: " + id));
        repo.deleteById(id);
    }
}
