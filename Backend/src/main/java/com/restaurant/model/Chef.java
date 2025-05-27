package com.restaurant.model;

public class Chef extends User {
    private String specialization;
    
    public Chef(int id, String name) {
        super(id, name);
        this.specialization = "General";
    }
    
    public String getSpecialization() {
        return specialization;
    }
    
    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }
}
