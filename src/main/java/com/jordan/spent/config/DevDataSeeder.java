package com.jordan.spent.config;

import com.jordan.spent.model.Category;
import com.jordan.spent.model.Expense;
import com.jordan.spent.model.User;
import com.jordan.spent.model.WageType;
import com.jordan.spent.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
@Profile("!prod")
public class DevDataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DevDataSeeder.class);

    private final UserRepository userRepository;

    public DevDataSeeder(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            User existing = userRepository.findAll().getFirst();
            log.info("==============================================");
            log.info("  Seed data already present — skipping.");
            log.info("  Dev user ID: {}", existing.getId());
            log.info("==============================================");
            return;
        }

        User user = new User();
        user.setWageType(WageType.SALARY);
        user.setAnnualSalary(new BigDecimal("95000"));
        user.setHoursPerWeek(40);
        user.setWeeksPerYear(50);

        List<Expense> expenses = List.of(
            expense("Rent",              Category.HOUSING,        "2200"),
            expense("Car Payment",       Category.TRANSPORTATION, "420"),
            expense("Car Insurance",     Category.INSURANCE,      "140"),
            expense("Groceries",         Category.FOOD,           "500"),
            expense("Restaurants",       Category.FOOD,           "300"),
            expense("Health Insurance",  Category.INSURANCE,      "210"),
            expense("Student Loans",     Category.DEBT,           "380"),
            expense("Netflix",           Category.SUBSCRIPTIONS,  "18"),
            expense("Spotify",           Category.SUBSCRIPTIONS,  "11"),
            expense("Gym",               Category.SUBSCRIPTIONS,  "45"),
            expense("Gas",               Category.TRANSPORTATION, "120"),
            expense("Electric / Water",  Category.OTHER,          "95")
        );

        expenses.forEach(e -> e.setUser(user));
        user.setExpenses(expenses.stream().toList());

        User saved = userRepository.save(user);

        log.info("==============================================");
        log.info("  Dev seed data created.");
        log.info("  User ID: {}", saved.getId());
        log.info("  Paste this in the browser console to log in as the seed user:");
        log.info("  fetch('http://localhost:8080/api/dev/login/{}', {{method:'POST',credentials:'include'}}).then(()=>location.href='/audit')", saved.getId());
        log.info("==============================================");
    }

    private Expense expense(String name, Category category, String monthly) {
        Expense e = new Expense();
        e.setName(name);
        e.setCategory(category);
        e.setMonthlyAmount(new BigDecimal(monthly));
        return e;
    }
}
