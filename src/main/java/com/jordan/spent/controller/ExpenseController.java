package com.jordan.spent.controller;

import com.jordan.spent.model.Expense;
import com.jordan.spent.repository.ExpenseRepository;
import com.jordan.spent.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/users/{userId}/expenses")
public class ExpenseController {

    private final UserRepository userRepository;
    private final ExpenseRepository expenseRepository;

    public ExpenseController(UserRepository userRepository, ExpenseRepository expenseRepository) {
        this.userRepository = userRepository;
        this.expenseRepository = expenseRepository;
    }

    @PostMapping
    public ResponseEntity<Expense> addExpense(@PathVariable Long userId, @RequestBody Expense expense) {
        return userRepository.findById(userId)
            .map(user -> {
                expense.setUser(user);
                Expense saved = expenseRepository.save(expense);
                URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                    .path("/{id}")
                    .buildAndExpand(saved.getId())
                    .toUri();
                return ResponseEntity.created(location).body(saved);
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<Expense>> getExpenses(@PathVariable Long userId) {
        if (!userRepository.existsById(userId)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(expenseRepository.findByUserId(userId));
    }

    @PutMapping("/{expenseId}")
    public ResponseEntity<Expense> updateExpense(@PathVariable Long userId,
                                                 @PathVariable Long expenseId,
                                                 @RequestBody Expense updates) {
        if (!userRepository.existsById(userId)) {
            return ResponseEntity.notFound().build();
        }
        return expenseRepository.findByIdAndUserId(expenseId, userId)
            .map(expense -> {
                expense.setName(updates.getName());
                expense.setCategory(updates.getCategory());
                expense.setMonthlyAmount(updates.getMonthlyAmount());
                return ResponseEntity.ok(expenseRepository.save(expense));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{expenseId}")
    public ResponseEntity<?> deleteExpense(@PathVariable Long userId, @PathVariable Long expenseId) {
        if (!userRepository.existsById(userId)) {
            return ResponseEntity.notFound().build();
        }
        return expenseRepository.findByIdAndUserId(expenseId, userId)
            .map(expense -> {
                expenseRepository.delete(expense);
                return ResponseEntity.<Void>noContent().build();
            })
            .orElse(ResponseEntity.notFound().build());
    }
}
