package com.jordan.spent.service;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;

@Service
public class TaxCalculatorService {

    private record Bracket(BigDecimal floor, BigDecimal ceiling, BigDecimal rate) {}

    private static final Bracket[] BRACKETS = {
        new Bracket(bd("0"),       bd("11600"),  bd("0.10")),
        new Bracket(bd("11600"),   bd("47150"),  bd("0.12")),
        new Bracket(bd("47150"),   bd("100525"), bd("0.22")),
        new Bracket(bd("100525"),  bd("191950"), bd("0.24")),
        new Bracket(bd("191950"),  bd("243725"), bd("0.32")),
        new Bracket(bd("243725"),  bd("609350"), bd("0.35")),
        new Bracket(bd("609350"),  null,         bd("0.37")),
    };

    public BigDecimal effectiveTaxRate(BigDecimal grossIncome) {
        if (grossIncome.compareTo(BigDecimal.ZERO) <= 0) {
            return BigDecimal.ZERO;
        }

        BigDecimal totalTax = BigDecimal.ZERO;

        for (Bracket bracket : BRACKETS) {
            if (grossIncome.compareTo(bracket.floor()) <= 0) {
                break;
            }
            BigDecimal taxableInBracket = (bracket.ceiling() == null || grossIncome.compareTo(bracket.ceiling()) < 0)
                ? grossIncome.subtract(bracket.floor())
                : bracket.ceiling().subtract(bracket.floor());

            totalTax = totalTax.add(taxableInBracket.multiply(bracket.rate()));
        }

        return totalTax.divide(grossIncome, new MathContext(10, RoundingMode.HALF_UP)).setScale(4, RoundingMode.HALF_UP);
    }

    private static BigDecimal bd(String val) {
        return new BigDecimal(val);
    }
}
