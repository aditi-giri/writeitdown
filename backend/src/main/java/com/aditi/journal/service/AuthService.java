package com.aditi.journal.service;

import java.security.SecureRandom;
import java.util.Base64;
import java.util.concurrent.ConcurrentHashMap;

import javax.crypto.SecretKey;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.aditi.journal.entity.User;
import com.aditi.journal.repository.UserRepository;
import com.aditi.journal.security.JwtUtil;
import com.aditi.journal.utils.KeyDerivationUtil;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    // TEMP (Phase 3): in-memory key cache
    private final ConcurrentHashMap<String, SecretKey> userKeys =
            new ConcurrentHashMap<>();

    public AuthService(UserRepository userRepository,
                       BCryptPasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    // ✅ REGISTER
    public void register(User user) {

        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole("USER");

        byte[] salt = new byte[16];
        new SecureRandom().nextBytes(salt);
        user.setEncryptionSalt(Base64.getEncoder().encodeToString(salt));

        userRepository.save(user);
    }

    // ✅ LOGIN + DERIVE & CACHE KEY
    public String loginAndCacheKey(String email, String password) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        SecretKey key = KeyDerivationUtil.deriveKey(
                password,
                user.getEncryptionSalt()
        );

        userKeys.put(email, key);

        return jwtUtil.generateToken(email);
    }

    // 🔑 Used by JournalController
    public SecretKey getUserKey(String email) {
        return userKeys.get(email);
    }

    // Optional: logout cleanup
    public void clearUserKey(String email) {
        userKeys.remove(email);
    }
    
    public void verifyPassword(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow();

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }
    }

}
