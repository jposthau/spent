package com.jordan.spent.service;

import com.jordan.spent.model.Expense;
import com.jordan.spent.model.User;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;
import java.util.List;

@Service
public class ExpenseCalculatorService {

    private static final BigDecimal TWELVE = BigDecimal.valueOf(12);
    private static final BigDecimal DAYS_PER_YEAR = BigDecimal.valueOf(365);
    private static final MathContext MC = new MathContext(10, RoundingMode.HALF_UP);

    private final IncomeCalculatorService incomeCalculatorService;

    public ExpenseCalculatorService(IncomeCalculatorService incomeCalculatorService) {
        this.incomeCalculatorService = incomeCalculatorService;
    }

    public BigDecimal calculateAnnualCost(Expense expense) {
        return expense.getMonthlyAmount().multiply(TWELVE, MC).setScale(2, RoundingMode.HALF_UP);
    }

    public BigDecimal calculateHoursWorkedForExpense(Expense expense, User user) {
        BigDecimal hourlyRate = incomeCalculatorService.calculateTrueHourlyRate(user);
        if (hourlyRate.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }
        return calculateAnnualCost(expense).divide(hourlyRate, MC).setScale(2, RoundingMode.HALF_UP);
    }

    public BigDecimal calculateTotalMonthlyExpenses(List<Expense> expenses) {
        return expenses.stream()
            .map(Expense::getMonthlyAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add)
            .setScale(2, RoundingMode.HALF_UP);
    }

    public BigDecimal calculateTotalAnnualExpenses(List<Expense> expenses) {
        return calculateTotalMonthlyExpenses(expenses).multiply(TWELVE, MC).setScale(2, RoundingMode.HALF_UP);
    }

    public BigDecimal calculateTotalHoursForAllExpenses(List<Expense> expenses, User user) {
        BigDecimal hourlyRate = incomeCalculatorService.calculateTrueHourlyRate(user);
        if (hourlyRate.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }
        return calculateTotalAnnualExpenses(expenses).divide(hourlyRate, MC).setScale(2, RoundingMode.HALF_UP);
    }

    public BigDecimal calculateWeeksWorkedForExpenses(List<Expense> expenses, User user) {
        BigDecimal totalHours = calculateTotalHoursForAllExpenses(expenses, user);
        BigDecimal hoursPerWeek = BigDecimal.valueOf(user.getHoursPerWeek());
        if (hoursPerWeek.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }
        return totalHours.divide(hoursPerWeek, MC).setScale(2, RoundingMode.HALF_UP);
    }

    public BigDecimal calculateBreakEvenHour(List<Expense> expenses, User user) {
        BigDecimal dailyExpenses = calculateTotalAnnualExpenses(expenses).divide(DAYS_PER_YEAR, MC);
        BigDecimal hourlyRate = incomeCalculatorService.calculateTrueHourlyRate(user);
        if (hourlyRate.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }
        return dailyExpenses.divide(hourlyRate, MC).setScale(2, RoundingMode.HALF_UP);
    }
}
