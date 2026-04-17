package com.jordan.spent.service;

import com.jordan.spent.dto.CostType;
import com.jordan.spent.dto.WhatIfRequest;
import com.jordan.spent.dto.WhatIfResultDTO;
import com.jordan.spent.model.User;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;

@Service
public class WhatIfService {

    private static final BigDecimal TWELVE = BigDecimal.valueOf(12);
    private static final BigDecimal EIGHT = BigDecimal.valueOf(8);
    private static final BigDecimal FIVE = BigDecimal.valueOf(5);
    private static final BigDecimal HUNDRED = BigDecimal.valueOf(100);
    private static final MathContext MC = new MathContext(10, RoundingMode.HALF_UP);

    private final IncomeCalculatorService incomeCalculatorService;

    public WhatIfService(IncomeCalculatorService incomeCalculatorService) {
        this.incomeCalculatorService = incomeCalculatorService;
    }

    public WhatIfResultDTO calculate(WhatIfRequest request, User user) {
        int years = request.getYears() != null && request.getYears() > 0 ? request.getYears() : 1;

        BigDecimal annualCost = toAnnualCost(request.getCostType(), request.getAmount());
        BigDecimal totalCost = annualCost.multiply(BigDecimal.valueOf(years), MC).setScale(2, RoundingMode.HALF_UP);

        BigDecimal trueHourlyRate = incomeCalculatorService.calculateTrueHourlyRate(user);
        BigDecimal netAnnualIncome = incomeCalculatorService.calculateNetAnnualIncome(user);

        BigDecimal totalHoursWorked = trueHourlyRate.compareTo(BigDecimal.ZERO) == 0
            ? BigDecimal.ZERO
            : totalCost.divide(trueHourlyRate, MC).setScale(2, RoundingMode.HALF_UP);

        BigDecimal workdays = totalHoursWorked.divide(EIGHT, MC).setScale(2, RoundingMode.HALF_UP);

        BigDecimal hoursPerWeek = BigDecimal.valueOf(user.getHoursPerWeek());
        BigDecimal workweeks = hoursPerWeek.compareTo(BigDecimal.ZERO) == 0
            ? BigDecimal.ZERO
            : totalHoursWorked.divide(hoursPerWeek, MC).setScale(2, RoundingMode.HALF_UP);

        BigDecimal monthlyHours = totalHoursWorked
            .divide(BigDecimal.valueOf(years), MC)
            .divide(TWELVE, MC)
            .setScale(2, RoundingMode.HALF_UP);

        BigDecimal percentageOfAnnualIncome = netAnnualIncome.compareTo(BigDecimal.ZERO) == 0
            ? BigDecimal.ZERO
            : annualCost.divide(netAnnualIncome, MC).multiply(HUNDRED).setScale(2, RoundingMode.HALF_UP);

        BigDecimal threshold = netAnnualIncome.multiply(new BigDecimal("0.05"), MC);
        boolean isSignificantCost = annualCost.compareTo(threshold) > 0;

        return new WhatIfResultDTO(
            request.getItemName(),
            request.getCostType(),
            request.getAmount(),
            years,
            totalCost,
            annualCost.setScale(2, RoundingMode.HALF_UP),
            totalHoursWorked,
            workdays,
            workweeks,
            monthlyHours,
            percentageOfAnnualIncome,
            isSignificantCost
        );
    }

    private BigDecimal toAnnualCost(CostType costType, BigDecimal amount) {
        return switch (costType) {
            case MONTHLY -> amount.multiply(TWELVE, MC);
            case ANNUAL -> amount;
            case ONE_TIME -> amount;
        };
    }
}
