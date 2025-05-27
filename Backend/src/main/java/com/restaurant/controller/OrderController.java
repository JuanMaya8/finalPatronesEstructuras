package com.restaurant.controller;

import com.restaurant.model.OrderItem;
import com.restaurant.model.pattern.Order;
import com.restaurant.service.OrderService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private OrderService orderService;
    
    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }
    
    @GetMapping
    public List<Order> getActiveOrders() {
        return orderService.getActiveOrders();
    }
    
    @GetMapping("/kitchen")
    public List<Order> getKitchenQueue() {
        return orderService.getKitchenQueue();
    }
    
    @GetMapping("/{id}")
    public Order getOrderById(@PathVariable int id) {
        return orderService.getOrderById(id);
    }
    
    @PostMapping
    public Order createOrder(@RequestBody Map<String, Object> orderData) {
        int tableId = (int) orderData.get("tableId");
        int waiterId = (int) orderData.get("waiterId");
        List<OrderItem> items = (List<OrderItem>) orderData.get("items");
        
        return orderService.createOrder(tableId, waiterId, items);
    }
    
    @PutMapping("/{id}/status")
    public void updateOrderStatus(@PathVariable int id, @RequestBody Map<String, String> statusData) {
        String status = statusData.get("status");
        orderService.updateOrderStatus(id, status);
    }
    
    @PutMapping("/{id}/estimated-time")
    public void setOrderEstimatedTime(@PathVariable int id, @RequestBody Map<String, Integer> timeData) {
        int minutes = timeData.get("minutes");
        orderService.setOrderEstimatedTime(id, minutes);
    }
}
