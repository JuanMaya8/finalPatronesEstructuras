package com.restaurant.model;

public class Manager extends User {
    private String role;
    
    public Manager(int id, String name) {
        super(id, name);
        this.role = "General Manager";
    }
    
    public String getRole() {
        return role;
    }
    
    public void setRole(String role) {
        this.role = role;
    }
}
