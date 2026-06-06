package com.example.entity;

import javax.persistence.*;

@Entity
@Table(name = "waste_category")
public class wastecategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String categoryName;

    private String description;

    // Self-referencing (Parent Category)
    private Long parentCategory;

    private String image;

    private boolean isActive;

    // Default Constructor
    public wastecategory() {
    }

    // Parameterized Constructor
    public wastecategory(String categoryName, String description,
                         Long parentCategory, String image, boolean isActive) {
        this.categoryName = categoryName;
        this.description = description;
        this.parentCategory = parentCategory;
        this.image = image;
        this.isActive = isActive;
    }

    // Getters & Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getParentCategory() {
        return parentCategory;
    }

    public void setParentCategory(Long parentCategory) {
        this.parentCategory = parentCategory;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }
}