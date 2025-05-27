package com.restaurant.model.datastructure;

import java.util.ArrayList;
import java.util.List;

public class UpdateStack<T> {
    private Node<T> top;
    private int size;
    
    public UpdateStack() {
        this.top = null;
        this.size = 0;
    }
    
    public void push(T update) {
        Node<T> newNode = new Node<>(update);
        
        if (top == null) {
            top = newNode;
        } else {
            newNode.next = top;
            top = newNode;
        }
        
        size++;
    }
    
    public T pop() {
        if (top == null) {
            return null;
        }
        
        T data = top.data;
        top = top.next;
        size--;
        
        return data;
    }
    
    public T peek() {
        if (top == null) {
            return null;
        }
        
        return top.data;
    }
    
    public List<T> getAllUpdates() {
        List<T> updates = new ArrayList<>();
        Node<T> current = top;
        
        while (current != null) {
            updates.add(current.data);
            current = current.next;
        }
        
        return updates;
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
