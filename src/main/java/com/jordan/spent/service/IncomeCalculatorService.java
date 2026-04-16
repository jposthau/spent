package com.jordan.spent.service;

import com.jordan.spent.model.User;
import com.jordan.spent.model.WageType;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;

@Service
public class IncomeCalculatorService {

    private static final MathContext MC = new MathContext(10, RoundingMode.HALF_UP);

    private final TaxCalculatorService taxCalculatorService;

    public IncomeCalculatorService(TaxCalculatorService taxCalculatorService) {
        this.taxCalculatorService = taxCalculatorService;
    }

    public BigDecimal calculateGrossAnnualIncome(User user) {
        if (user.getWageType() == WageType.HOURLY) {
            return user.getHourlyRate()
                .multiply(BigDecimal.valueOf(user.getHoursPerWeek()), MC)
                .multiply(BigDecimal.valueOf(user.getWeeksPerYear()), MC);
        }
        return user.getAnnualSalary();
    }

    public BigDecimal calculateNetAnnualIncome(User user) {
        BigDecimal gross = calculateGrossAnnualIncome(user);
        BigDecimal effectiveRate = taxCalculatorService.effectiveTaxRate(gross);
        BigDecimal taxOwed = gross.multiply(effectiveRate, MC);
        return gross.subtract(taxOwed).setScale(2, RoundingMode.HALF_UP);
    }

    public BigDecimal calculateAnnualHours(User user) {
        if (user.getWageType() == WageType.HOURLY) {
            return BigDecimal.valueOf((long) user.getHoursPerWeek() * user.getWeeksPerYear());
        }
        return BigDecimal.valueOf((long) user.getHoursPerWeek() * user.getWeeksPerYear());
    }

    public BigDecimal calculateTrueHourlyRate(User user) {
        BigDecimal annualHours = calculateAnnualHours(user);
        if (annualHours.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }
        return calculateNetAnnualIncome(user).divide(annualHours, MC).setScale(2, RoundingMode.HALF_UP);
    }
}
