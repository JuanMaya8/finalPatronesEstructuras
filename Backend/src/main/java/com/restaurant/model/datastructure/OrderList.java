package com.restaurant.model.datastructure;

import java.util.function.Consumer;

public class OrderList<T> {
    private Node<T> head;
    private Node<T> tail;
    private int size;
    
    public OrderList() {
        this.head = null;
        this.tail = null;
        this.size = 0;
    }
    
    public void addOrder(T order) {
        Node<T> newNode = new Node<>(order);
        
        if (head == null) {
            head = newNode;
            tail = newNode;
        } else {
            tail.next = newNode;
            newNode.prev = tail;
            tail = newNode;
        }
        
        size++;
    }
    
    public T getOrder(int id) {
        Node<T> current = head;
        
        while (current != null) {
            if (current.data instanceof HasId && ((HasId) current.data).getId() == id) {
                return current.data;
            }
            current = current.next;
        }
        
        return null;
    }
    
    public void updateOrder(int id, T newOrder) {
        Node<T> current = head;
        
        while (current != null) {
            if (current.data instanceof HasId && ((HasId) current.data).getId() == id) {
                current.data = newOrder;
                return;
            }
            current = current.next;
        }
    }
    
    public void traverseForward(Consumer<T> consumer) {
        Node<T> current = head;
        
        while (current != null) {
            consumer.accept(current.data);
            current = current.next;
        }
    }
    
    public void traverseBackward(Consumer<T> consumer) {
        Node<T> current = tail;
        
        while (current != null) {
            consumer.accept(current.data);
            current = current.prev;
        }
    }
    
    public int size() {
        return size;
    }
    
    public interface HasId {
        int getId();
    }
    
    private static class Node<T> {
        T data;
        Node<T> prev;
        Node<T> next;
        
        Node(T data) {
            this.data = data;
            this.prev = null;
            this.next = null;
        }
    }
}
