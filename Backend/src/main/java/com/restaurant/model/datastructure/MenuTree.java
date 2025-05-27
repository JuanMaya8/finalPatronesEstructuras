package com.restaurant.model.datastructure;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class MenuTree<T> {
    private TreeNode<T> root;
    
    public MenuTree() {
        this.root = new TreeNode<>("Menu", null);
    }
    
    public void insert(String category, String subCategory, T item) {
        TreeNode<T> categoryNode = findOrCreateNode(root, category);
        TreeNode<T> subCategoryNode = findOrCreateNode(categoryNode, subCategory);
        subCategoryNode.addItem(item);
    }
    
    private TreeNode<T> findOrCreateNode(TreeNode<T> parent, String name) {
        for (TreeNode<T> child : parent.getChildren()) {
            if (child.getName().equals(name)) {
                return child;
            }
        }
        
        TreeNode<T> newNode = new TreeNode<>(name, parent);
        parent.addChild(newNode);
        return newNode;
    }
    
    public List<T> getItemsByCategory(String category) {
        List<T> items = new ArrayList<>();
        TreeNode<T> categoryNode = findNode(root, category);
        
        if (categoryNode != null) {
            collectItems(categoryNode, items);
        }
        
        return items;
    }
    
    private TreeNode<T> findNode(TreeNode<T> node, String name) {
        if (node.getName().equals(name)) {
            return node;
        }
        
        for (TreeNode<T> child : node.getChildren()) {
            TreeNode<T> found = findNode(child, name);
            if (found != null) {
                return found;
            }
        }
        
        return null;
    }
    
    private void collectItems(TreeNode<T> node, List<T> items) {
        items.addAll(node.getItems());
        
        for (TreeNode<T> child : node.getChildren()) {
            collectItems(child, items);
        }
    }
    
    public static class TreeNode<T> {
        private String name;
        private TreeNode<T> parent;
        private List<TreeNode<T>> children;
        private List<T> items;
        
        public TreeNode(String name, TreeNode<T> parent) {
            this.name = name;
            this.parent = parent;
            this.children = new ArrayList<>();
            this.items = new ArrayList<>();
        }
        
        public String getName() {
            return name;
        }
        
        public TreeNode<T> getParent() {
            return parent;
        }
        
        public List<TreeNode<T>> getChildren() {
            return children;
        }
        
        public void addChild(TreeNode<T> child) {
            children.add(child);
        }
        
        public List<T> getItems() {
            return items;
        }
        
        public void addItem(T item) {
            items.add(item);
        }
    }
}
