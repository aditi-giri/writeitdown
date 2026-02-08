package com.aditi.journal.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.aditi.journal.entity.User;
import com.aditi.journal.service.AuthService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            authService.register(user);
            return ResponseEntity.ok(
                Map.of("message", "User registered successfully")
            );
        } catch (RuntimeException ex) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("message", ex.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody Map<String, String> request
    ) {

        String token = authService.loginAndCacheKey(
                request.get("email"),
                request.get("password")
        );

        return ResponseEntity.ok(Map.of(
                "token", token,
                "email", request.get("email")
        ));
    }
    
    @PostMapping("/verify")
    public ResponseEntity<?> verifyPassword(
            @RequestBody Map<String, String> request
    ) {
        authService.verifyPassword(
                request.get("email"),
                request.get("password")
        );
        return ResponseEntity.ok().build();
    }

}
