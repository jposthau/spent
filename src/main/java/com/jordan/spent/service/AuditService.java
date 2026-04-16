package com.jordan.spent.service;

import com.jordan.spent.dto.AuditSummaryDTO;
import com.jordan.spent.dto.ExpenseSummaryDTO;
import com.jordan.spent.model.Expense;
import com.jordan.spent.model.User;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;
import java.util.List;

@Service
public class AuditService {

    private static final BigDecimal FIFTY_TWO = BigDecimal.valueOf(52);
    private static final BigDecimal HUNDRED = BigDecimal.valueOf(100);
    private static final MathContext MC = new MathContext(10, RoundingMode.HALF_UP);

    private final IncomeCalculatorService incomeCalculatorService;
    private final ExpenseCalculatorService expenseCalculatorService;

    public AuditService(IncomeCalculatorService incomeCalculatorService,
                        ExpenseCalculatorService expenseCalculatorService) {
        this.incomeCalculatorService = incomeCalculatorService;
        this.expenseCalculatorService = expenseCalculatorService;
    }

    public AuditSummaryDTO buildAudit(User user, List<Expense> expenses) {
        BigDecimal trueHourlyRate        = incomeCalculatorService.calculateTrueHourlyRate(user);
        BigDecimal grossAnnualIncome     = incomeCalculatorService.calculateGrossAnnualIncome(user);
        BigDecimal netAnnualIncome       = incomeCalculatorService.calculateNetAnnualIncome(user);
        BigDecimal annualHours           = incomeCalculatorService.calculateAnnualHours(user);

        BigDecimal totalMonthlyExpenses  = expenseCalculatorService.calculateTotalMonthlyExpenses(expenses);
        BigDecimal totalAnnualExpenses   = expenseCalculatorService.calculateTotalAnnualExpenses(expenses);
        BigDecimal totalHoursForExpenses = expenseCalculatorService.calculateTotalHoursForAllExpenses(expenses, user);
        BigDecimal weeksWorkedForExpenses = expenseCalculatorService.calculateWeeksWorkedForExpenses(expenses, user);
        BigDecimal breakEvenHour         = expenseCalculatorService.calculateBreakEvenHour(expenses, user);

        BigDecimal weeksKept = FIFTY_TWO.subtract(weeksWorkedForExpenses).setScale(2, RoundingMode.HALF_UP);

        BigDecimal percentageOfIncomeToExpenses = netAnnualIncome.compareTo(BigDecimal.ZERO) == 0
            ? BigDecimal.ZERO
            : totalAnnualExpenses.divide(netAnnualIncome, MC).multiply(HUNDRED).setScale(2, RoundingMode.HALF_UP);

        List<ExpenseSummaryDTO> expenseBreakdown = expenses.stream()
            .map(expense -> toExpenseSummary(expense, user, totalAnnualExpenses))
            .toList();

        return new AuditSummaryDTO(
            trueHourlyRate,
            grossAnnualIncome,
            netAnnualIncome,
            annualHours,
            totalMonthlyExpenses,
            totalAnnualExpenses,
            totalHoursForExpenses,
            weeksWorkedForExpenses,
            breakEvenHour,
            weeksKept,
            percentageOfIncomeToExpenses,
            expenseBreakdown
        );
    }

    private ExpenseSummaryDTO toExpenseSummary(Expense expense, User user, BigDecimal totalAnnualExpenses) {
        BigDecimal annualCost  = expenseCalculatorService.calculateAnnualCost(expense);
        BigDecimal hoursWorked = expenseCalculatorService.calculateHoursWorkedForExpense(expense, user);

        BigDecimal percentageOfTotalExpenses = totalAnnualExpenses.compareTo(BigDecimal.ZERO) == 0
            ? BigDecimal.ZERO
            : annualCost.divide(totalAnnualExpenses, MC).multiply(HUNDRED).setScale(2, RoundingMode.HALF_UP);

        return new ExpenseSummaryDTO(
            expense.getName(),
            expense.getCategory(),
            expense.getMonthlyAmount(),
            annualCost,
            hoursWorked,
            percentageOfTotalExpenses
        );
    }
}
