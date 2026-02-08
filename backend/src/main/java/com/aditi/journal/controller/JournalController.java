package com.aditi.journal.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import javax.crypto.SecretKey;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aditi.journal.dto.CalendarEntryDto;
import com.aditi.journal.entity.JournalEntry;
import com.aditi.journal.entity.User;
import com.aditi.journal.repository.UserRepository;
import com.aditi.journal.service.AuthService;
import com.aditi.journal.service.JournalService;

@RestController
@RequestMapping("/api/journal")
public class JournalController {

	private final JournalService journalService;
	private final UserRepository userRepository;
	private final AuthService authService;

	public JournalController(JournalService journalService, UserRepository userRepository, AuthService authService) {
		this.journalService = journalService;
		this.userRepository = userRepository;
		this.authService = authService;
	}

	@PostMapping
	public Map<String, String> saveEntry(@RequestBody Map<String, String> request) {

		String email = request.get("email");

		User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

		SecretKey key = authService.getUserKey(email);

		if (key == null) {
			throw new RuntimeException("Session expired. Please login again.");
		}

		journalService.saveOrUpdateEntry(user, request.get("content"), request.get("mood"), key);

		return Map.of("message", "Journal saved securely");
	}

	@GetMapping("/calendar")
	public List<CalendarEntryDto> getCalendarData(@RequestParam int year, @RequestParam int month,
			@RequestParam String email) {

		User user = userRepository.findByEmail(email).orElseThrow();

		return journalService.getMonthlyOverview(user, year, month);
	}

	@GetMapping("/entry")
	public ResponseEntity<?> getEntryByDate(@RequestParam String email, @RequestParam String date) {

		User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

		SecretKey key = authService.getUserKey(email);

		if (key == null) {
			return ResponseEntity.status(401).body(Map.of("message", "Session expired"));
		}

		try {
			JournalEntry entry = journalService.readEntry(user, LocalDate.parse(date), key);

			return ResponseEntity.ok(Map.of("content", entry.getEncryptedContent(), "mood", entry.getMood()));

		} catch (RuntimeException ex) {
			// ✅ This means: no entry exists for that date
			return ResponseEntity.status(404).body(Map.of("message", "No entry found"));
		}
	}

	@GetMapping("/recent")
	public List<Map<String, String>> recentEntries(@RequestParam String email) {
		User user = userRepository.findByEmail(email).orElseThrow();
		return journalService.getRecentEntries(user);
	}

}
