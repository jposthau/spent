package com.jordan.spent.dto;

import java.math.BigDecimal;

public record WhatIfResultDTO(
    String itemName,
    CostType costType,
    BigDecimal amount,
    Integer years,
    BigDecimal totalCost,
    BigDecimal annualCost,
    BigDecimal totalHoursWorked,
    BigDecimal workdays,
    BigDecimal workweeks,
    BigDecimal monthlyHours,
    BigDecimal percentageOfAnnualIncome,
    boolean isSignificantCost
) {}
