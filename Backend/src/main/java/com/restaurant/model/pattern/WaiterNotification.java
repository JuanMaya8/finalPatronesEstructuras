package com.restaurant.model.pattern;

public class WaiterNotification implements OrderObserver {
    private int waiterId;
    
    public WaiterNotification(int waiterId) {
        this.waiterId = waiterId;
    }
    
    @Override
    public void update(Order order) {
        if (order.getWaiterId() == waiterId) {
            System.out.println("Notificación para mesero #" + waiterId + ": Comanda #" + order.getId() + " actualizada");
        }
    }
}
