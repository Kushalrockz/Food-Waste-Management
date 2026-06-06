package com.example.entity;

import javax.persistence.*;

@Entity
@Table(name = "food_waste_entry")
public class foodwasteentry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long donorId;   // Reference to User (Donor)

    private String foodItemName;
    private String description;
    private String quantity;
    private String expiryDate;

    private String pickupAddress;
    private String pickupCity;

    private boolean isAvailable;

    // Default Constructor
    public foodwasteentry() {
    }

    // Parameterized Constructor
    public foodwasteentry(Long donorId, String foodItemName, String description,
                          String quantity, String expiryDate,
                          String pickupAddress, String pickupCity,
                          boolean isAvailable) {
        this.donorId = donorId;
        this.foodItemName = foodItemName;
        this.description = description;
        this.quantity = quantity;
        this.expiryDate = expiryDate;
        this.pickupAddress = pickupAddress;
        this.pickupCity = pickupCity;
        this.isAvailable = isAvailable;
    }

    // Getters & Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getDonorId() {
        return donorId;
    }

    public void setDonorId(Long donorId) {
        this.donorId = donorId;
    }

    public String getFoodItemName() {
        return foodItemName;
    }

    public void setFoodItemName(String foodItemName) {
        this.foodItemName = foodItemName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getQuantity() {
        return quantity;
    }

    public void setQuantity(String quantity) {
        this.quantity = quantity;
    }

    public String getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(String expiryDate) {
        this.expiryDate = expiryDate;
    }

    public String getPickupAddress() {
        return pickupAddress;
    }

    public void setPickupAddress(String pickupAddress) {
        this.pickupAddress = pickupAddress;
    }

    public String getPickupCity() {
        return pickupCity;
    }

    public void setPickupCity(String pickupCity) {
        this.pickupCity = pickupCity;
    }

    public boolean isAvailable() {
        return isAvailable;
    }

    public void setAvailable(boolean available) {
        isAvailable = available;
    }
}