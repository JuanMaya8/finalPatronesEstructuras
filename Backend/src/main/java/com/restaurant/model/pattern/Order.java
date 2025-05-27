package com.restaurant.model.pattern;

import com.restaurant.model.OrderItem;
import com.restaurant.model.OrderUpdate;
import com.restaurant.model.datastructure.OrderList;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class Order implements OrderList.HasId {
    private final int id;
    private final int tableId;
    private final int waiterId;
    private final List<OrderItem> items;
    private final Date timestamp;
    private String status;
    private List<OrderUpdate> updates;
    
    private Order(OrderBuilder builder) {
        this.id = builder.id;
        this.tableId = builder.tableId;
        this.waiterId = builder.waiterId;
        this.items = builder.items;
        this.timestamp = builder.timestamp;
        this.status = builder.status;
        this.updates = builder.updates;
    }
    
    @Override
    public int getId() {
        return id;
    }
    
    public int getTableId() {
        return tableId;
    }
    
    public int getWaiterId() {
        return waiterId;
    }
    
    public List<OrderItem> getItems() {
        return items;
    }
    
    public Date getTimestamp() {
        return timestamp;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    public List<OrderUpdate> getUpdates() {
        return updates;
    }
    
    public static class OrderBuilder {
        private final int id;
        private final int tableId;
        private final int waiterId;
        private List<OrderItem> items = new ArrayList<>();
        private Date timestamp = new Date();
        private String status = "pending";
        private List<OrderUpdate> updates = new ArrayList<>();
        
        public OrderBuilder(int id, int tableId, int waiterId) {
            this.id = id;
            this.tableId = tableId;
            this.waiterId = waiterId;
        }
        
        public OrderBuilder withItems(List<OrderItem> items) {
            this.items = items;
            return this;
        }
        
        public OrderBuilder withTimestamp(Date timestamp) {
            this.timestamp = timestamp;
            return this;
        }
        
        public OrderBuilder withStatus(String status) {
            this.status = status;
            return this;
        }
        
        public OrderBuilder withUpdates(List<OrderUpdate> updates) {
            this.updates = updates;
            return this;
        }
        
        public Order build() {
            return new Order(this);
        }
    }
}
