package com.example.entity;

import javax.persistence.*;

@Entity
@Table(name = "feedback")
public class feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // References
    private Long reviewerId;
    private Long donorId;
    private Long recyclingCenterId;

    private int rating;

    private String comments;

    private String reviewDate;

    private String photo;

    // Default Constructor
    public feedback() {
    }

    // Parameterized Constructor
    public feedback(Long reviewerId, Long donorId, Long recyclingCenterId,
                    int rating, String comments, String reviewDate, String photo) {
        this.reviewerId = reviewerId;
        this.donorId = donorId;
        this.recyclingCenterId = recyclingCenterId;
        this.rating = rating;
        this.comments = comments;
        this.reviewDate = reviewDate;
        this.photo = photo;
    }

    // Getters & Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getReviewerId() {
        return reviewerId;
    }

    public void setReviewerId(Long reviewerId) {
        this.reviewerId = reviewerId;
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

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public String getComments() {
        return comments;
    }

    public void setComments(String comments) {
        this.comments = comments;
    }

    public String getReviewDate() {
        return reviewDate;
    }

    public void setReviewDate(String reviewDate) {
        this.reviewDate = reviewDate;
    }

    public String getPhoto() {
        return photo;
    }

    public void setPhoto(String photo) {
        this.photo = photo;
    }
}