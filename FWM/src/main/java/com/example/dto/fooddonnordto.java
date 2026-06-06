package com.example.dto;

public class fooddonnordto {
	private Long id;

    // Reference to User (Donor)
    private Long userId;

    private String organizationName;

    private String donorType;

    private int experienceYears;

    private String bio;

    private double rating;

    private String location;

    private String profilePhoto;

    // Default Constructor
    public fooddonnordto() {
    }

    // Parameterized Constructor
    public fooddonnordto(Long userId, String organizationName, String donorType,
                     int experienceYears, String bio, double rating,
                     String location, String profilePhoto) {
        this.userId = userId;
        this.organizationName = organizationName;
        this.donorType = donorType;
        this.experienceYears = experienceYears;
        this.bio = bio;
        this.rating = rating;
        this.location = location;
        this.profilePhoto = profilePhoto;
    }

    // Getters & Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getOrganizationName() {
        return organizationName;
    }

    public void setOrganizationName(String organizationName) {
        this.organizationName = organizationName;
    }

    public String getDonorType() {
        return donorType;
    }

    public void setDonorType(String donorType) {
        this.donorType = donorType;
    }

    public int getExperienceYears() {
        return experienceYears;
    }

    public void setExperienceYears(int experienceYears) {
        this.experienceYears = experienceYears;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public double getRating() {
        return rating;
    }

    public void setRating(double rating) {
        this.rating = rating;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getProfilePhoto() {
        return profilePhoto;
    }

    public void setProfilePhoto(String profilePhoto) {
        this.profilePhoto = profilePhoto;
    }

}
