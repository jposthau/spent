package com.jordan.spent.controller;

import com.jordan.spent.model.SpentPrincipal;
import com.jordan.spent.model.User;
import com.jordan.spent.model.UserRole;
import com.jordan.spent.model.UserStatus;
import com.jordan.spent.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository        userRepository;
    private final PasswordEncoder       passwordEncoder;
    private final AuthenticationManager authenticationManager;

    public AuthController(UserRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          AuthenticationManager authenticationManager) {
        this.userRepository        = userRepository;
        this.passwordEncoder       = passwordEncoder;
        this.authenticationManager = authenticationManager;
    }

    // ── GET /api/auth/me ──────────────────────────────────────────────────────

    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }
        SpentPrincipal principal = (SpentPrincipal) authentication.getPrincipal();
        return ResponseEntity.ok(toDto(principal.getUser()));
    }

    // ── POST /api/auth/register ───────────────────────────────────────────────

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AuthRequest req) {
        String email = req.email().trim().toLowerCase();

        if (email.isBlank() || req.password().length() < 6) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", "Email and a password of at least 6 characters are required."));
        }

        if (userRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.status(409)
                .body(Map.of("message", "An account with that email already exists."));
        }

        User user = new User();
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(req.password()));
        user.setRole(UserRole.MEMBER);
        user.setStatus(UserStatus.PENDING);
        userRepository.save(user);

        return ResponseEntity.status(201)
            .body(Map.of("message", "Account created. You can sign in once an admin approves your request."));
    }

    // ── POST /api/auth/login ──────────────────────────────────────────────────

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest req, HttpServletRequest request) {
        try {
            return ResponseEntity.ok(createSession(req.email().trim().toLowerCase(), req.password(), request));
        } catch (DisabledException e) {
            return ResponseEntity.status(403).body(Map.of("message", "pending"));
        } catch (LockedException e) {
            return ResponseEntity.status(403).body(Map.of("message", "denied"));
        } catch (AuthenticationException e) {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid email or password."));
        }
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private Map<String, Object> createSession(String email, String password, HttpServletRequest request) {
        Authentication auth = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(email, password)
        );
        SecurityContext sc = SecurityContextHolder.createEmptyContext();
        sc.setAuthentication(auth);
        SecurityContextHolder.setContext(sc);
        HttpSession session = request.getSession(true);
        session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, sc);

        SpentPrincipal principal = (SpentPrincipal) auth.getPrincipal();
        return toDto(principal.getUser());
    }

    private Map<String, Object> toDto(User user) {
        return Map.of(
            "id",      user.getId(),
            "name",    user.getName()     != null ? user.getName()     : "",
            "email",   user.getEmail()    != null ? user.getEmail()    : "",
            "role",    user.getRole().name(),
            "status",  user.getStatus().name(),
            "isSetup", user.getWageType() != null
        );
    }

    record AuthRequest(String email, String password) {}
}
