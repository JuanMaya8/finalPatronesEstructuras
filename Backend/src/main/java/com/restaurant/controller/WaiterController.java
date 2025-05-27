package com.restaurant.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.restaurant.model.Waiter;
import com.restaurant.service.WaiterService;

@RestController
@RequestMapping("/api/waiters")
public class WaiterController {
    private WaiterService waiterService;
    
    public WaiterController(WaiterService waiterService) {
        this.waiterService = waiterService;
    }
    
    @GetMapping
    public List<Waiter> getAllWaiters() {
        return waiterService.getAllWaiters();
    }
    
    @GetMapping("/{id}")
    public Waiter getWaiterById(@PathVariable int id) {
        return waiterService.getWaiterById(id);
    }
    
    @PostMapping
    public Waiter addWaiter(@RequestBody Map<String, String> waiterData) {
        String name = waiterData.get("name");
        return waiterService.addWaiter(name);
    }
    
    @PutMapping("/{id}/status")
    public void updateWaiterStatus(@PathVariable int id, @RequestBody Map<String, Boolean> statusData) {
        boolean active = statusData.get("active");
        waiterService.updateWaiterStatus(id, active);
    }
    
    @GetMapping("/rotation")
    public List<Waiter> getRotationOrder() {
        return waiterService.getRotationOrder();
    }
    
    @PostMapping("/rotation/next")
    public Waiter getNextWaiter() {
        return waiterService.getNextWaiter();
    }
    
    @PutMapping("/{id}/tables/{tableId}")
    public void assignTable(@PathVariable int id, @PathVariable int tableId) {
        waiterService.assignTable(id, tableId);
    }
    
    @DeleteMapping("/{id}/tables/{tableId}")
    public void unassignTable(@PathVariable int id, @PathVariable int tableId) {
        waiterService.unassignTable(id, tableId);
    }
}
