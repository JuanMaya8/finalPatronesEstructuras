package com.restaurant.model;

import java.util.Date;

public class OrderUpdate {
    private String action;
    private Date timestamp;
    
    public OrderUpdate(String action, Date timestamp) {
        this.action = action;
        this.timestamp = timestamp;
    }
    
    public String getAction() {
        return action;
    }
    
    public Date getTimestamp() {
        return timestamp;
    }
}
