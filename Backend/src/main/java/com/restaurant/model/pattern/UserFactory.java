package com.restaurant.model.pattern;

import com.restaurant.model.Chef;
import com.restaurant.model.Manager;
import com.restaurant.model.User;
import com.restaurant.model.Waiter;

public abstract class UserFactory {
    public static User createUser(String type, String name, int id) {
        switch (type.toLowerCase()) {
            case "waiter":
                return new Waiter(id, name);
            case "chef":
                return new Chef(id, name);
            case "manager":
                return new Manager(id, name);
            default:
                throw new IllegalArgumentException("Usuario de tipo desconocido: " + type);
        }
    }
}
