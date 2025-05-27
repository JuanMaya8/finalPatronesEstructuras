package com.restaurant.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.restaurant.model.datastructure.MenuTree;
import com.restaurant.model.datastructure.ProductHashTable;
import com.restaurant.model.pattern.BasicMenuItem;
import com.restaurant.model.pattern.MenuItem;

@Service 
public class MenuService {
    private MenuTree<MenuItem> menuTree;
    private ProductHashTable<String, MenuItem> menuItemsTable;
    
    public MenuService() {
        this.menuTree = new MenuTree<>();
        this.menuItemsTable = new ProductHashTable<>();
        initializeMenu();
    }
    
    private void initializeMenu() {
        addMenuItem(new BasicMenuItem("Ensalada César", "Lechuga romana, crutones, queso parmesano y aderezo César", 8.99), "appetizers", "salads");
        addMenuItem(new BasicMenuItem("Carpaccio de Res", "Finas láminas de res con aceite de oliva, limón y parmesano", 12.99), "appetizers", "cold");
        addMenuItem(new BasicMenuItem("Sopa de Cebolla", "Caldo de cebolla caramelizada con queso gratinado", 7.99), "appetizers", "soups");
        
        addMenuItem(new BasicMenuItem("Filete Mignon", "Corte premium de res con salsa de vino tinto y vegetales", 29.99), "main", "beef");
        addMenuItem(new BasicMenuItem("Salmón a la Parrilla", "Filete de salmón con salsa de limón y hierbas", 24.99), "main", "fish");
        addMenuItem(new BasicMenuItem("Risotto de Hongos", "Arroz cremoso con variedad de hongos y queso parmesano", 18.99), "main", "vegetarian");
        
        addMenuItem(new BasicMenuItem("Tiramisú", "Postre italiano con café, mascarpone y cacao", 8.99), "desserts", "cakes");
        addMenuItem(new BasicMenuItem("Crème Brûlée", "Natilla cremosa con costra de azúcar caramelizada", 7.99), "desserts", "custards");
        
        addMenuItem(new BasicMenuItem("Vino Tinto", "Copa de vino tinto de la casa", 6.99), "drinks", "wine");
        addMenuItem(new BasicMenuItem("Agua Mineral", "Botella de agua mineral", 2.99), "drinks", "non-alcoholic");
    }
    
    public List<MenuItem> getMenuItemsByCategory(String category) {
        return menuTree.getItemsByCategory(category);
    }
    
    public MenuItem findItemByName(String name) {
        return menuItemsTable.get(name);
    }
    
    public List<MenuItem> getAllMenuItems() {
        return menuItemsTable.getAllValues();
    }
    
    public void addMenuItem(MenuItem item, String category, String subCategory) {
        menuTree.insert(category, subCategory, item);
        menuItemsTable.put(item.getName(), item);
    }
}
