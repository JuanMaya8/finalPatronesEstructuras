package com.restaurant.model.datastructure;

import java.util.*;

public class RestaurantGraph {
    private Map<Integer, List<Edge>> adjacencyList;
    private Map<Integer, String> nodeTypes;
    
    public RestaurantGraph() {
        this.adjacencyList = new HashMap<>();
        this.nodeTypes = new HashMap<>();
    }
    
    public void addNode(int nodeId, String nodeType) {
        adjacencyList.putIfAbsent(nodeId, new ArrayList<>());
        nodeTypes.put(nodeId, nodeType);
    }
    
    public void addEdge(int source, int destination, int weight) {
        if (!adjacencyList.containsKey(source) || !adjacencyList.containsKey(destination)) {
            throw new IllegalArgumentException("Source or destination node does not exist");
        }
        
        adjacencyList.get(source).add(new Edge(destination, weight));
        adjacencyList.get(destination).add(new Edge(source, weight));
    }
    
    public List<Integer> shortestPath(int source, int destination) {
        if (!adjacencyList.containsKey(source) || !adjacencyList.containsKey(destination)) {
            return new ArrayList<>();
        }
        
        Map<Integer, Integer> distances = new HashMap<>();
        Map<Integer, Integer> previous = new HashMap<>();
        PriorityQueue<Node> queue = new PriorityQueue<>(Comparator.comparingInt(n -> n.distance));
        Set<Integer> visited = new HashSet<>();
        
        for (int node : adjacencyList.keySet()) {
            distances.put(node, Integer.MAX_VALUE);
            previous.put(node, null);
        }
        
        distances.put(source, 0);
        queue.add(new Node(source, 0));
        
        while (!queue.isEmpty()) {
            Node current = queue.poll();
            int currentId = current.id;
            
            if (currentId == destination) {
                break;
            }
            
            if (visited.contains(currentId)) {
                continue;
            }
            
            visited.add(currentId);
            
            for (Edge edge : adjacencyList.get(currentId)) {
                int neighbor = edge.destination;
                int weight = edge.weight;
                int distance = distances.get(currentId) + weight;
                
                if (distance < distances.get(neighbor)) {
                    distances.put(neighbor, distance);
                    previous.put(neighbor, currentId);
                    queue.add(new Node(neighbor, distance));
                }
            }
        }
        
        List<Integer> path = new ArrayList<>();
        Integer current = destination;
        
        while (current != null) {
            path.add(0, current);
            current = previous.get(current);
        }
        
        if (path.size() <= 1 && path.get(0) != source) {
            return new ArrayList<>();
        }
        
        return path;
    }
    
    public Map<Integer, List<Integer>> getConnections() {
        Map<Integer, List<Integer>> connections = new HashMap<>();
        
        for (Map.Entry<Integer, List<Edge>> entry : adjacencyList.entrySet()) {
            int node = entry.getKey();
            List<Integer> neighbors = new ArrayList<>();
            
            for (Edge edge : entry.getValue()) {
                neighbors.add(edge.destination);
            }
            
            connections.put(node, neighbors);
        }
        
        return connections;
    }
    
    public static class Edge {
        int destination;
        int weight;
        
        public Edge(int destination, int weight) {
            this.destination = destination;
            this.weight = weight;
        }
    }
    
    private static class Node {
        int id;
        int distance;
        
        public Node(int id, int distance) {
            this.id = id;
            this.distance = distance;
        }
    }
}
