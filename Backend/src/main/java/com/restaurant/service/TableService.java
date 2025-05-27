package com.restaurant.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.restaurant.model.Table;
import com.restaurant.model.datastructure.RestaurantGraph;
@Service 
public class TableService {
    private List<Table> tables;
    private RestaurantGraph restaurantLayout;
    
    public TableService() {
        this.tables = new ArrayList<>();
        this.restaurantLayout = new RestaurantGraph();
        initializeTables();
    }
    
    private void initializeTables() {
        tables.add(new Table(1, 1, 4));
        tables.add(new Table(2, 2, 2));
        tables.add(new Table(3, 3, 6));
        tables.add(new Table(4, 4, 4));
        tables.add(new Table(5, 5, 8));
        
        tables.get(0).setStatus("occupied");
        tables.get(2).setStatus("reserved");
        tables.get(4).setStatus("occupied");
        
        restaurantLayout.addNode(1, "table");
        restaurantLayout.addNode(2, "table");
        restaurantLayout.addNode(3, "table");
        restaurantLayout.addNode(4, "table");
        restaurantLayout.addNode(5, "table");
        restaurantLayout.addNode(6, "kitchen");
        restaurantLayout.addNode(7, "waiter_station");
        
        restaurantLayout.addEdge(1, 2, 1);
        restaurantLayout.addEdge(2, 3, 1);
        restaurantLayout.addEdge(3, 4, 1);
        restaurantLayout.addEdge(4, 5, 1);
        restaurantLayout.addEdge(1, 7, 2);
        restaurantLayout.addEdge(3, 7, 1);
        restaurantLayout.addEdge(5, 7, 2);
        restaurantLayout.addEdge(7, 6, 1);
    }
    
    public List<Table> getAllTables() {
        return new ArrayList<>(tables);
    }
    
    public Table getTableById(int id) {
        return tables.stream()
            .filter(t -> t.getId() == id)
            .findFirst()
            .orElse(null);
    }
    
    public void updateTableStatus(int id, String status) {
        Table table = getTableById(id);
        if (table != null) {
            table.setStatus(status);
        }
    }
    
    public List<Integer> getShortestPath(int sourceId, int destinationId) {
        return restaurantLayout.shortestPath(sourceId, destinationId);
    }
    
    public void addTable(int number, int capacity) {
        int id = tables.size() + 1;
        Table table = new Table(id, number, capacity);
        tables.add(table);
        
        restaurantLayout.addNode(id, "table");
        
        int nearestNode = findNearestNode(id);
        if (nearestNode > 0) {
            restaurantLayout.addEdge(id, nearestNode, 1);
        }
    }
    
    private int findNearestNode(int tableId) {
        if (tables.size() <= 1) {
            return -1;
        }
        
        return tables.get(tables.size() - 2).getId();
    }
}
