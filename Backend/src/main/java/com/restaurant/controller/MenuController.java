package com.restaurant.controller;

import com.restaurant.model.pattern.MenuItem;
import com.restaurant.service.MenuService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menu")
public class MenuController {
    private MenuService menuService;
    
    public MenuController(MenuService menuService) {
        this.menuService = menuService;
    }
    
    @GetMapping
    public List<MenuItem> getAllMenuItems() {
        return menuService.getAllMenuItems();
    }
    
    @GetMapping("/category/{category}")
    public List<MenuItem> getMenuItemsByCategory(@PathVariable String category) {
        return menuService.getMenuItemsByCategory(category);
    }
    
    @GetMapping("/search/{name}")
    public MenuItem findItemByName(@PathVariable String name) {
        return menuService.findItemByName(name);
    }
    
    @PostMapping
    public void addMenuItem(@RequestBody MenuItem item, @RequestParam String category, @RequestParam String subCategory) {
        menuService.addMenuItem(item, category, subCategory);
    }
}
