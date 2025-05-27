package com.restaurant.controller;

import com.restaurant.model.Table;
import com.restaurant.service.TableService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tables")
public class TableController {
    private TableService tableService;
    
    public TableController(TableService tableService) {
        this.tableService = tableService;
    }
    
    @GetMapping
    public List<Table> getAllTables() {
        return tableService.getAllTables();
    }
    
    @GetMapping("/{id}")
    public Table getTableById(@PathVariable int id) {
        return tableService.getTableById(id);
    }
    
    @PutMapping("/{id}/status")
    public void updateTableStatus(@PathVariable int id, @RequestBody Map<String, String> statusData) {
        String status = statusData.get("status");
        tableService.updateTableStatus(id, status);
    }
    
    @GetMapping("/path/{sourceId}/{destinationId}")
    public List<Integer> getShortestPath(@PathVariable int sourceId, @PathVariable int destinationId) {
        return tableService.getShortestPath(sourceId, destinationId);
    }
    
    @PostMapping
    public void addTable(@RequestBody Map<String, Integer> tableData) {
        int number = tableData.get("number");
        int capacity = tableData.get("capacity");
        tableService.addTable(number, capacity);
    }
}
