package com.restaurant.model.datastructure;

import java.util.ArrayList;
import java.util.List;

public class WaiterRotation<T> {
    private Node<T> current;
    private int size;
    
    public WaiterRotation() {
        this.current = null;
        this.size = 0;
    }
    
    public void add(T waiter) {
        Node<T> newNode = new Node<>(waiter);
        
        if (current == null) {
            newNode.next = newNode;
            current = newNode;
        } else {
            newNode.next = current.next;
            current.next = newNode;
        }
        
        size++;
    }
    
    public T getCurrentWaiter() {
        if (current == null) {
            return null;
        }
        
        return current.data;
    }
    
    public T rotate() {
        if (current == null) {
            return null;
        }
        
        current = current.next;
        return current.data;
    }
    
    public List<T> getRotationOrder() {
        List<T> order = new ArrayList<>();
        
        if (current == null) {
            return order;
        }
        
        Node<T> start = current;
        do {
            order.add(current.data);
            current = current.next;
        } while (current != start);
        
        return order;
    }
    
    public boolean contains(T waiter) {
        if (current == null) {
            return false;
        }
        
        Node<T> start = current;
        do {
            if (current.data.equals(waiter)) {
                return true;
            }
            current = current.next;
        } while (current != start);
        
        return false;
    }
    
    public void remove(T waiter) {
        if (current == null) {
            return;
        }
        
        Node<T> prev = current;
        Node<T> curr = current.next;
        
        if (size == 1 && current.data.equals(waiter)) {
            current = null;
            size = 0;
            return;
        }
        
        do {
            if (curr.data.equals(waiter)) {
                prev.next = curr.next;
                if (curr == current) {
                    current = prev;
                }
                size--;
                return;
            }
            prev = curr;
            curr = curr.next;
        } while (curr != current.next);
    }
    
    public int size() {
        return size;
    }
    
    private static class Node<T> {
        T data;
        Node<T> next;
        
        Node(T data) {
            this.data = data;
            this.next = null;
        }
    }
}
