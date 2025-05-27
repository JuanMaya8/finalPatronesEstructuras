package com.restaurant.model.pattern;

public abstract class MenuItemDecorator implements MenuItem {
    protected MenuItem menuItem;
    
    public MenuItemDecorator(MenuItem menuItem) {
        this.menuItem = menuItem;
    }
    
    @Override
    public String getName() {
        return menuItem.getName();
    }
    
    @Override
    public String getDescription() {
        return menuItem.getDescription();
    }
    
    @Override
    public double getPrice() {
        return menuItem.getPrice();
    }
}
