package com.restaurant.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.restaurant.model.Waiter;
import com.restaurant.model.datastructure.WaiterRotation;
import com.restaurant.model.pattern.UserFactory;
@Service 
public class WaiterService {
    private List<Waiter> waiters;
    private WaiterRotation<Waiter> waiterRotation;
    
    public WaiterService() {
        this.waiters = new ArrayList<>();
        this.waiterRotation = new WaiterRotation<>();
        initializeWaiters();
    }
    
    private void initializeWaiters() {
        Waiter waiter1 = (Waiter) UserFactory.createUser("waiter", "Carlos Rodríguez", 1);
        Waiter waiter2 = (Waiter) UserFactory.createUser("waiter", "María González", 2);
        Waiter waiter3 = (Waiter) UserFactory.createUser("waiter", "Juan Pérez", 3);
        
        waiter1.assignTable(1);
        waiter1.assignTable(2);
        waiter1.assignTable(3);
        waiter2.assignTable(4);
        waiter2.assignTable(5);
        waiter3.setActive(false);
        
        waiters.add(waiter1);
        waiters.add(waiter2);
        waiters.add(waiter3);
        
        waiterRotation.add(waiter1);
        waiterRotation.add(waiter2);
    }
    
    public List<Waiter> getAllWaiters() {
        return new ArrayList<>(waiters);
    }
    
    public Waiter getWaiterById(int id) {
        return waiters.stream()
            .filter(w -> w.getId() == id)
            .findFirst()
            .orElse(null);
    }
    
    public Waiter addWaiter(String name) {
        int id = waiters.size() + 1;
        Waiter waiter = (Waiter) UserFactory.createUser("waiter", name, id);
        waiters.add(waiter);
        
        if (waiter.isActive()) {
            waiterRotation.add(waiter);
        }
        
        return waiter;
    }
    
    public void updateWaiterStatus(int id, boolean active) {
        Waiter waiter = getWaiterById(id);
        if (waiter != null) {
            waiter.setActive(active);
            
            if (!active) {
                waiterRotation.remove(waiter);
            } else if (!waiterRotation.contains(waiter)) {
                waiterRotation.add(waiter);
            }
        }
    }
    
    public Waiter getNextWaiter() {
        return waiterRotation.rotate();
    }
    
    public List<Waiter> getRotationOrder() {
        return waiterRotation.getRotationOrder();
    }
    
    public void assignTable(int waiterId, int tableId) {
        Waiter waiter = getWaiterById(waiterId);
        if (waiter != null) {
            waiter.assignTable(tableId);
        }
    }
    
    public void unassignTable(int waiterId, int tableId) {
        Waiter waiter = getWaiterById(waiterId);
        if (waiter != null) {
            waiter.unassignTable(tableId);
        }
    }
    
    public void incrementOrdersCompleted(int waiterId) {
        Waiter waiter = getWaiterById(waiterId);
        if (waiter != null) {
            waiter.incrementOrdersCompleted();
        }
    }
}
