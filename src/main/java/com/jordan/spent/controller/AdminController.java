package com.jordan.spent.controller;

import com.jordan.spent.model.User;
import com.jordan.spent.model.UserStatus;
import com.jordan.spent.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserRepository userRepository;

    public AdminController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /** List all non-admin users with their current status. */
    @GetMapping("/users")
    public List<Map<String, Object>> listUsers() {
        return userRepository.findAll().stream()
            .map(this::toDto)
            .toList();
    }

    /** Approve a pending user. */
    @PostMapping("/users/{id}/approve")
    public ResponseEntity<?> approve(@PathVariable Long id) {
        return userRepository.findById(id).map(user -> {
            user.setStatus(UserStatus.APPROVED);
            userRepository.save(user);
            return ResponseEntity.ok(toDto(user));
        }).orElse(ResponseEntity.notFound().build());
    }

    /** Deny a pending (or previously approved) user. */
    @PostMapping("/users/{id}/deny")
    public ResponseEntity<?> deny(@PathVariable Long id) {
        return userRepository.findById(id).map(user -> {
            user.setStatus(UserStatus.DENIED);
            userRepository.save(user);
            return ResponseEntity.ok(toDto(user));
        }).orElse(ResponseEntity.notFound().build());
    }

    private Map<String, Object> toDto(User user) {
        return Map.of(
            "id",     user.getId(),
            "email",  user.getEmail() != null ? user.getEmail() : "",
            "name",   user.getName()  != null ? user.getName()  : "",
            "role",   user.getRole().name(),
            "status", user.getStatus().name()
        );
    }
}
