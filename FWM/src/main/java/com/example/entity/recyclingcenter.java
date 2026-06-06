package com.example.entity;

import javax.persistence.*;

@Entity
@Table(name = "recycling_center")
public class recyclingcenter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Reference to User (Manager)
    private Long managerId;

    private String centerName;

    private String centerType;

    private int capacity;

    private String processingMethod;

    private String location;

    private String city;

    private String contactNumber;

    private String photo;

    private boolean isActive;

    // Default Constructor
    public recyclingcenter() {
    }

    // Parameterized Constructor
    public recyclingcenter(Long managerId, String centerName, String centerType,
                           int capacity, String processingMethod,
                           String location, String city,
                           String contactNumber, String photo,
                           boolean isActive) {
        this.managerId = managerId;
        this.centerName = centerName;
        this.centerType = centerType;
        this.capacity = capacity;
        this.processingMethod = processingMethod;
        this.location = location;
        this.city = city;
        this.contactNumber = contactNumber;
        this.photo = photo;
        this.isActive = isActive;
    }

    // Getters & Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getManagerId() {
        return managerId;
    }

    public void setManagerId(Long managerId) {
        this.managerId = managerId;
    }

    public String getCenterName() {
        return centerName;
    }

    public void setCenterName(String centerName) {
        this.centerName = centerName;
    }

    public String getCenterType() {
        return centerType;
    }

    public void setCenterType(String centerType) {
        this.centerType = centerType;
    }

    public int getCapacity() {
        return capacity;
    }

    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }

    public String getProcessingMethod() {
        return processingMethod;
    }

    public void setProcessingMethod(String processingMethod) {
        this.processingMethod = processingMethod;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getContactNumber() {
        return contactNumber;
    }

    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }

    public String getPhoto() {
        return photo;
    }

    public void setPhoto(String photo) {
        this.photo = photo;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }
}