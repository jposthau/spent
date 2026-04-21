package com.jordan.spent.controller;

import com.jordan.spent.model.SpentPrincipal;
import com.jordan.spent.model.User;
import com.jordan.spent.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.context.annotation.Profile;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.Map;

/**
 * Dev-only endpoint: creates a real Spring Security session for the seeded user,
 * bypassing OAuth. Never included in the "prod" profile.
 */
@RestController
@Profile("!prod")
public class DevLoginController {

    private final UserRepository userRepository;

    public DevLoginController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/api/dev/login/{userId}")
    public ResponseEntity<?> devLogin(@PathVariable Long userId, HttpServletRequest request) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return ResponseEntity.notFound().build();

        SpentPrincipal principal = new SpentPrincipal(user);
        Authentication auth = new UsernamePasswordAuthenticationToken(principal, null, Collections.emptyList());
        SecurityContext sc = SecurityContextHolder.createEmptyContext();
        sc.setAuthentication(auth);
        SecurityContextHolder.setContext(sc);

        HttpSession session = request.getSession(true);
        session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, sc);

        return ResponseEntity.ok(Map.of("id", user.getId(), "message", "Dev login successful"));
    }
}
