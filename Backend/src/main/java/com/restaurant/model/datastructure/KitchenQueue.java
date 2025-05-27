package com.restaurant.model.datastructure;

import java.util.ArrayList;
import java.util.List;

public class KitchenQueue<T> {
    private Node<T> front;
    private Node<T> rear;
    private int size;
    
    public KitchenQueue() {
        this.front = null;
        this.rear = null;
        this.size = 0;
    }
    
    public void enqueue(T order) {
        Node<T> newNode = new Node<>(order);
        
        if (rear == null) {
            front = newNode;
            rear = newNode;
        } else {
            rear.next = newNode;
            rear = newNode;
        }
        
        size++;
    }
    
    public T dequeue() {
        if (front == null) {
            return null;
        }
        
        T data = front.data;
        front = front.next;
        
        if (front == null) {
            rear = null;
        }
        
        size--;
        return data;
    }
    
    public T peek() {
        if (front == null) {
            return null;
        }
        
        return front.data;
    }
    
    public List<T> getAllOrders() {
        List<T> orders = new ArrayList<>();
        Node<T> current = front;
        
        while (current != null) {
            orders.add(current.data);
            current = current.next;
        }
        
        return orders;
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
