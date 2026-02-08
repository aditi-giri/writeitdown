package com.aditi.journal.controller;

import java.time.LocalDate;
import java.util.Map;

import javax.crypto.SecretKey;

import org.springframework.web.bind.annotation.*;

import com.aditi.journal.entity.User;
import com.aditi.journal.repository.UserRepository;
import com.aditi.journal.service.AnalyticsService;
import com.aditi.journal.service.AuthService;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;
    private final UserRepository userRepository;
    private final AuthService authService;

    public AnalyticsController(
            AnalyticsService analyticsService,
            UserRepository userRepository,
            AuthService authService
    ) {
        this.analyticsService = analyticsService;
        this.userRepository = userRepository;
        this.authService = authService;
    }

    @GetMapping("/monthly")
    public Map<String, Object> monthlyAnalytics(
            @RequestParam String email,
            @RequestParam int year,
            @RequestParam int month
    ) {

        User user = userRepository.findByEmail(email).orElseThrow();

        // auth check
        SecretKey key = authService.getUserKey(email);
        if (key == null) {
            throw new RuntimeException("Session expired");
        }

        LocalDate start = LocalDate.of(year, month, 1);
        LocalDate end = start.withDayOfMonth(start.lengthOfMonth());

        return Map.of(
                "trend",
                analyticsService.dailyMoodTrend(user, start, end),
                "distribution",
                analyticsService.moodDistribution(user, start, end)
        );
    }
}
