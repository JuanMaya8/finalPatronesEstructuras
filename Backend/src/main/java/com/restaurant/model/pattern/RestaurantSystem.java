package com.restaurant.model.pattern;

import com.restaurant.service.MenuService;
import com.restaurant.service.OrderService;
import com.restaurant.service.TableService;
import com.restaurant.service.WaiterService;

public class RestaurantSystem {
    private static RestaurantSystem instance;
    private MenuService menuService;
    private OrderService orderService;
    private WaiterService waiterService;
    private TableService tableService;
    
    private RestaurantSystem() {
        this.menuService = new MenuService();
        this.orderService = new OrderService();
        this.waiterService = new WaiterService();
        this.tableService = new TableService();
    }
    
    public static synchronized RestaurantSystem getInstance() {
        if (instance == null) {
            instance = new RestaurantSystem();
        }
        return instance;
    }
    
    public MenuService getMenuService() {
        return menuService;
    }
    
    public OrderService getOrderService() {
        return orderService;
    }
    
    public WaiterService getWaiterService() {
        return waiterService;
    }
    
    public TableService getTableService() {
        return tableService;
    }
}
