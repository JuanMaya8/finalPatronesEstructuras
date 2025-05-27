package com.restaurant.model;

import java.util.ArrayList;
import java.util.List;

public class Waiter extends User {
    private boolean active;
    private List<Integer> assignedTables;
    private int ordersCompleted;
    
    public Waiter(int id, String name) {
        super(id, name);
        this.active = true;
        this.assignedTables = new ArrayList<>();
        this.ordersCompleted = 0;
    }
    
    public boolean isActive() {
        return active;
    }
    
    public void setActive(boolean active) {
        this.active = active;
    }
    
    public List<Integer> getAssignedTables() {
        return assignedTables;
    }
    
    public void assignTable(int tableId) {
        if (!assignedTables.contains(tableId)) {
            assignedTables.add(tableId);
        }
    }
    
    public void unassignTable(int tableId) {
        assignedTables.remove(Integer.valueOf(tableId));
    }
    
    public int getOrdersCompleted() {
        return ordersCompleted;
    }
    
    public void incrementOrdersCompleted() {
        this.ordersCompleted++;
    }
}
