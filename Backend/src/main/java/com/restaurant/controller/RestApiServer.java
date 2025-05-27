package com.restaurant.controller;

import com.restaurant.model.pattern.RestaurantSystem;
import org.springframework.stereotype.Component;

@Component
public class RestApiServer {
    private RestaurantSystem restaurantSystem;
    private MenuController menuController;
    private OrderController orderController;
    private WaiterController waiterController;
    private TableController tableController;
    
    public RestApiServer() {
        this.restaurantSystem = RestaurantSystem.getInstance();
        this.menuController = new MenuController(restaurantSystem.getMenuService());
        this.orderController = new OrderController(restaurantSystem.getOrderService());
        this.waiterController = new WaiterController(restaurantSystem.getWaiterService());
        this.tableController = new TableController(restaurantSystem.getTableService());
    }
    
    public void start() {
        System.out.println("Servidor REST API iniciado en el puerto 8080");
    }
}
