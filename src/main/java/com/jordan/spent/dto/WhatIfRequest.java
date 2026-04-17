package com.jordan.spent.dto;

import java.math.BigDecimal;

public class WhatIfRequest {

    private String itemName;
    private CostType costType;
    private BigDecimal amount;
    private Integer years;

    public WhatIfRequest() {}

    public String getItemName() { return itemName; }
    public void setItemName(String itemName) { this.itemName = itemName; }

    public CostType getCostType() { return costType; }
    public void setCostType(CostType costType) { this.costType = costType; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public Integer getYears() { return years; }
    public void setYears(Integer years) { this.years = years; }
}
