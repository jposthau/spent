package com.jordan.spent.dto;

import com.jordan.spent.model.Category;

import java.math.BigDecimal;

public record ExpenseSummaryDTO(
    String name,
    Category category,
    BigDecimal monthlyAmount,
    BigDecimal annualCost,
    BigDecimal hoursWorked,
    BigDecimal percentageOfTotalExpenses
) {}
