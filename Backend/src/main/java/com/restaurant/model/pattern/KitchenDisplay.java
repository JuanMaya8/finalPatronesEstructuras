package com.restaurant.model.pattern;

public class KitchenDisplay implements OrderObserver {
    @Override
    public void update(Order order) {
        System.out.println("Cocina: Nueva actualización para la comanda #" + order.getId());
    }
}
