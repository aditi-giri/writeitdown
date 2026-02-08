package com.aditi.journal.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Service;

import com.aditi.journal.dto.CalendarEntryDto;
import com.aditi.journal.entity.JournalEntry;
import com.aditi.journal.entity.User;
import com.aditi.journal.repository.JournalEntryRepository;
import com.aditi.journal.utils.EncryptionUtil;

@Service
public class JournalService {

	private final JournalEntryRepository journalRepo;

	public JournalService(JournalEntryRepository journalRepo) {
		this.journalRepo = journalRepo;
	}

	// 🔒 CREATE or UPDATE ENTRY
	public void saveOrUpdateEntry(User user, String plainText, String mood, SecretKey key) {

		LocalDate today = LocalDate.now();

		String encryptedText = EncryptionUtil.encrypt(plainText, key);

		JournalEntry entry = journalRepo.findByUserAndEntryDate(user, today).orElse(new JournalEntry());

		entry.setUser(user);
		entry.setEncryptedContent(encryptedText);
		entry.setMood(mood);
		entry.setEntryDate(today);

		if (entry.getCreatedAt() == null) {
			entry.setCreatedAt(LocalDateTime.now());
		}
		entry.setUpdatedAt(LocalDateTime.now());

		journalRepo.save(entry);
	}

	public List<CalendarEntryDto> getMonthlyOverview(User user, int year, int month) {

		YearMonth ym = YearMonth.of(year, month);
		LocalDate start = ym.atDay(1);
		LocalDate end = ym.atEndOfMonth();

		return journalRepo.findByUserAndEntryDateBetween(user, start, end).stream()
				.map(entry -> new CalendarEntryDto(entry.getEntryDate(), entry.getMood())).collect(Collectors.toList());
	}

	// 🔓 READ ENTRY (still password-based – Phase 5 will fix)
	public JournalEntry readEntry(User user, LocalDate date, SecretKey key) {

		JournalEntry entry = journalRepo.findByUserAndEntryDate(user, date)
				.orElseThrow(() -> new RuntimeException("No entry found"));

		String decryptedText = EncryptionUtil.decrypt(entry.getEncryptedContent(), key);

		entry.setEncryptedContent(decryptedText);
		return entry;
	}

	public List<Map<String, String>> getRecentEntries(User user) {

		return journalRepo.findTop7ByUserOrderByEntryDateDesc(user).stream()
				.map(entry -> Map.of("date", entry.getEntryDate().toString(), "mood", entry.getMood())).toList();
	}

}
