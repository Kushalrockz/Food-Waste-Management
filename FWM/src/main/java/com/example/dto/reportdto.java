package com.example.dto;

public class reportdto {
	private Long id;

    // References
    private Long generatedBy;
    private Long donorId;
    private Long recyclingCenterId;

    private String reportType;

    private String periodFrom;

    private String periodTo;

    private String totalWasteCollected;

    private String totalWasteRecycled;

    private String generatedDate;

    private String reportFile;

    // Default Constructor
    public reportdto() {
    }

    // Parameterized Constructor
    public reportdto(Long generatedBy, Long donorId, Long recyclingCenterId,
                  String reportType, String periodFrom, String periodTo,
                  String totalWasteCollected, String totalWasteRecycled,
                  String generatedDate, String reportFile) {
        this.generatedBy = generatedBy;
        this.donorId = donorId;
        this.recyclingCenterId = recyclingCenterId;
        this.reportType = reportType;
        this.periodFrom = periodFrom;
        this.periodTo = periodTo;
        this.totalWasteCollected = totalWasteCollected;
        this.totalWasteRecycled = totalWasteRecycled;
        this.generatedDate = generatedDate;
        this.reportFile = reportFile;
    }

    // Getters & Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getGeneratedBy() {
        return generatedBy;
    }

    public void setGeneratedBy(Long generatedBy) {
        this.generatedBy = generatedBy;
    }

    public Long getDonorId() {
        return donorId;
    }

    public void setDonorId(Long donorId) {
        this.donorId = donorId;
    }

    public Long getRecyclingCenterId() {
        return recyclingCenterId;
    }

    public void setRecyclingCenterId(Long recyclingCenterId) {
        this.recyclingCenterId = recyclingCenterId;
    }

    public String getReportType() {
        return reportType;
    }

    public void setReportType(String reportType) {
        this.reportType = reportType;
    }

    public String getPeriodFrom() {
        return periodFrom;
    }

    public void setPeriodFrom(String periodFrom) {
        this.periodFrom = periodFrom;
    }

    public String getPeriodTo() {
        return periodTo;
    }

    public void setPeriodTo(String periodTo) {
        this.periodTo = periodTo;
    }

    public String getTotalWasteCollected() {
        return totalWasteCollected;
    }

    public void setTotalWasteCollected(String totalWasteCollected) {
        this.totalWasteCollected = totalWasteCollected;
    }

    public String getTotalWasteRecycled() {
        return totalWasteRecycled;
    }

    public void setTotalWasteRecycled(String totalWasteRecycled) {
        this.totalWasteRecycled = totalWasteRecycled;
    }

    public String getGeneratedDate() {
        return generatedDate;
    }

    public void setGeneratedDate(String generatedDate) {
        this.generatedDate = generatedDate;
    }

    public String getReportFile() {
        return reportFile;
    }

    public void setReportFile(String reportFile) {
        this.reportFile = reportFile;
    }

}
