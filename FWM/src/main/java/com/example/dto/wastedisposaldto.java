package com.example.dto;

public class wastedisposaldto {
	private Long id;

    // References
    private Long collectionRequestId;
    private Long recyclingCenterId;

    private String disposalMethod;

    private String disposalDate;

    private String quantityProcessed;

    private String compostedOutput;

    private String status;

    private String remarks;

    // Default Constructor
    public wastedisposaldto() {
    }

    // Parameterized Constructor
    public wastedisposaldto(Long collectionRequestId, Long recyclingCenterId,
                         String disposalMethod, String disposalDate,
                         String quantityProcessed, String compostedOutput,
                         String status, String remarks) {
        this.collectionRequestId = collectionRequestId;
        this.recyclingCenterId = recyclingCenterId;
        this.disposalMethod = disposalMethod;
        this.disposalDate = disposalDate;
        this.quantityProcessed = quantityProcessed;
        this.compostedOutput = compostedOutput;
        this.status = status;
        this.remarks = remarks;
    }

    // Getters & Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getCollectionRequestId() {
        return collectionRequestId;
    }

    public void setCollectionRequestId(Long collectionRequestId) {
        this.collectionRequestId = collectionRequestId;
    }

    public Long getRecyclingCenterId() {
        return recyclingCenterId;
    }

    public void setRecyclingCenterId(Long recyclingCenterId) {
        this.recyclingCenterId = recyclingCenterId;
    }

    public String getDisposalMethod() {
        return disposalMethod;
    }

    public void setDisposalMethod(String disposalMethod) {
        this.disposalMethod = disposalMethod;
    }

    public String getDisposalDate() {
        return disposalDate;
    }

    public void setDisposalDate(String disposalDate) {
        this.disposalDate = disposalDate;
    }

    public String getQuantityProcessed() {
        return quantityProcessed;
    }

    public void setQuantityProcessed(String quantityProcessed) {
        this.quantityProcessed = quantityProcessed;
    }

    public String getCompostedOutput() {
        return compostedOutput;
    }

    public void setCompostedOutput(String compostedOutput) {
        this.compostedOutput = compostedOutput;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

}
