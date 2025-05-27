package com.restaurant.model.pattern;

public class SpecialOfferDecorator extends MenuItemDecorator {
    private double discountPercentage;
    
    public SpecialOfferDecorator(MenuItem menuItem, double discountPercentage) {
        super(menuItem);
        this.discountPercentage = discountPercentage;
    }
    
    @Override
    public String getName() {
        return "Oferta Especial: " + super.getName();
    }
    
    @Override
    public String getDescription() {
        return super.getDescription() + " (Con " + discountPercentage + "% de descuento)";
    }
    
    @Override
    public double getPrice() {
        return super.getPrice() * (1 - discountPercentage / 100);
    }
}
