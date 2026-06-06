package com.example.entity;

import javax.persistence.*;

@Entity
@Table(name = "collection_request")
public class collectionrequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long collectorId;   // User (Collector)
    private Long foodId;        // Food Entry

    private String requestDate;
    private String pickupDate;

    private String collectionStatus; // PENDING / APPROVED / REJECTED

    // Default Constructor
    public collectionrequest() {
    }

    // Parameterized Constructor
    public collectionrequest(Long collectorId, Long foodId,
                             String requestDate, String pickupDate,
                             String collectionStatus) {
        this.collectorId = collectorId;
        this.foodId = foodId;
        this.requestDate = requestDate;
        this.pickupDate = pickupDate;
        this.collectionStatus = collectionStatus;
    }

    // Getters & Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getCollectorId() {
        return collectorId;
    }

    public void setCollectorId(Long collectorId) {
        this.collectorId = collectorId;
    }

    public Long getFoodId() {
        return foodId;
    }

    public void setFoodId(Long foodId) {
        this.foodId = foodId;
    }

    public String getRequestDate() {
        return requestDate;
    }

    public void setRequestDate(String requestDate) {
        this.requestDate = requestDate;
    }

    public String getPickupDate() {
        return pickupDate;
    }

    public void setPickupDate(String pickupDate) {
        this.pickupDate = pickupDate;
    }

    public String getCollectionStatus() {
        return collectionStatus;
    }

    public void setCollectionStatus(String collectionStatus) {
        this.collectionStatus = collectionStatus;
    }
}