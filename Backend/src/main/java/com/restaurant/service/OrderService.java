package com.restaurant.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.stereotype.Service;

import com.restaurant.model.OrderItem;
import com.restaurant.model.OrderUpdate;
import com.restaurant.model.datastructure.KitchenQueue;
import com.restaurant.model.datastructure.OrderList;
import com.restaurant.model.pattern.KitchenDisplay;
import com.restaurant.model.pattern.Order;
import com.restaurant.model.pattern.OrderSubject;
@Service 
public class OrderService {
    private OrderList<Order> activeOrders;
    private KitchenQueue<Order> kitchenQueue;
    private OrderSubject orderSubject;
    private int nextOrderId = 1;
    
    public OrderService() {
        this.activeOrders = new OrderList<>();
        this.kitchenQueue = new KitchenQueue<>();
        this.orderSubject = new OrderSubject();
        
        orderSubject.attach(new KitchenDisplay());
    }
    
    public Order createOrder(int tableId, int waiterId, List<OrderItem> items) {
        Order order = new Order.OrderBuilder(nextOrderId++, tableId, waiterId)
            .withItems(items)
            .build();
        
        activeOrders.addOrder(order);
        kitchenQueue.enqueue(order);
        orderSubject.notifyObservers(order);
        
        return order;
    }
    
    public void updateOrderStatus(int orderId, String status) {
        Order order = activeOrders.getOrder(orderId);
        if (order != null) {
            OrderUpdate update = new OrderUpdate("Status changed to " + status, new Date());
            order.getUpdates().add(update);
            order.setStatus(status);
            
            orderSubject.notifyObservers(order);
        }
    }
    
    public List<Order> getActiveOrders() {
        List<Order> orders = new ArrayList<>();
        activeOrders.traverseForward(orders::add);
        return orders;
    }
    
    public List<Order> getKitchenQueue() {
        return kitchenQueue.getAllOrders();
    }
    
    public Order getOrderById(int orderId) {
        return activeOrders.getOrder(orderId);
    }
    
    public void setOrderEstimatedTime(int orderId, int minutes) {
        Order order = activeOrders.getOrder(orderId);
        if (order != null) {
            OrderUpdate update = new OrderUpdate("Estimated time set to " + minutes + " minutes", new Date());
            order.getUpdates().add(update);
            
            orderSubject.notifyObservers(order);
        }
    }
}
