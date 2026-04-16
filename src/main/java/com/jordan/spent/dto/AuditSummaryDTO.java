package com.jordan.spent.dto;

import java.math.BigDecimal;
import java.util.List;

public record AuditSummaryDTO(
    BigDecimal trueHourlyRate,
    BigDecimal grossAnnualIncome,
    BigDecimal netAnnualIncome,
    BigDecimal annualHours,
    BigDecimal totalMonthlyExpenses,
    BigDecimal totalAnnualExpenses,
    BigDecimal totalHoursForExpenses,
    BigDecimal weeksWorkedForExpenses,
    BigDecimal breakEvenHour,
    BigDecimal weeksKept,
    BigDecimal percentageOfIncomeToExpenses,
    List<ExpenseSummaryDTO> expenseBreakdown
) {}
