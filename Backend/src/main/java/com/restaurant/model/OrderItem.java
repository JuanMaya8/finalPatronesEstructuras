package com.restaurant.model;

public class OrderItem {
    private int menuItemId;
    private String name;
    private double price;
    private int quantity;
    private String notes;
    
    public OrderItem(int menuItemId, String name, double price, int quantity, String notes) {
        this.menuItemId = menuItemId;
        this.name = name;
        this.price = price;
        this.quantity = quantity;
        this.notes = notes;
    }
    
    public int getMenuItemId() {
        return menuItemId;
    }
    
    public String getName() {
        return name;
    }
    
    public double getPrice() {
        return price;
    }
    
    public int getQuantity() {
        return quantity;
    }
    
    public String getNotes() {
        return notes;
    }
    
    public double getTotal() {
        return price * quantity;
    }
}
