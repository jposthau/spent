package com.jordan.spent.controller;

import com.jordan.spent.dto.AuditSummaryDTO;
import com.jordan.spent.repository.ExpenseRepository;
import com.jordan.spent.repository.UserRepository;
import com.jordan.spent.service.AuditService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users/{userId}/audit")
public class AuditController {

    private final UserRepository userRepository;
    private final ExpenseRepository expenseRepository;
    private final AuditService auditService;

    public AuditController(UserRepository userRepository,
                           ExpenseRepository expenseRepository,
                           AuditService auditService) {
        this.userRepository = userRepository;
        this.expenseRepository = expenseRepository;
        this.auditService = auditService;
    }

    @GetMapping
    public ResponseEntity<AuditSummaryDTO> getAudit(@PathVariable Long userId) {
        return userRepository.findById(userId)
            .map(user -> {
                var expenses = expenseRepository.findByUserId(userId);
                return ResponseEntity.ok(auditService.buildAudit(user, expenses));
            })
            .orElse(ResponseEntity.notFound().build());
    }
}
