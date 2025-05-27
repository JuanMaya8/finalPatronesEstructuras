package com.restaurant.model;

public class Table {
    private int id;
    private int number;
    private int capacity;
    private String status;
    
    public Table(int id, int number, int capacity) {
        this.id = id;
        this.number = number;
        this.capacity = capacity;
        this.status = "available";
    }
    
    public int getId() {
        return id;
    }
    
    public int getNumber() {
        return number;
    }
    
    public int getCapacity() {
        return capacity;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
}
