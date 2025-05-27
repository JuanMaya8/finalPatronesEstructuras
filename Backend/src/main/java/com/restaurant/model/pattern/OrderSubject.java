package com.restaurant.model.pattern;

import java.util.ArrayList;
import java.util.List;

public class OrderSubject {
    private List<OrderObserver> observers = new ArrayList<>();
    
    public void attach(OrderObserver observer) {
        observers.add(observer);
    }
    
    public void detach(OrderObserver observer) {
        observers.remove(observer);
    }
    
    public void notifyObservers(Order order) {
        for (OrderObserver observer : observers) {
            observer.update(order);
        }
    }
}
