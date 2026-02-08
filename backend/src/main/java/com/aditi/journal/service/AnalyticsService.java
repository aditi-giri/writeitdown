package com.aditi.journal.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.aditi.journal.entity.JournalEntry;
import com.aditi.journal.entity.User;
import com.aditi.journal.repository.JournalEntryRepository;
import com.aditi.journal.utils.MoodMapper;

@Service
public class AnalyticsService {

	private final JournalEntryRepository journalRepo;

	public AnalyticsService(JournalEntryRepository journalRepo) {
		this.journalRepo = journalRepo;
	}

	public List<Map<String, Object>> dailyMoodTrend(User user, LocalDate start, LocalDate end) {
		return journalRepo.findByUserAndEntryDateBetween(user, start, end).stream().map(e -> {
			Map<String, Object> map = new java.util.HashMap<>();
			map.put("date", e.getEntryDate().toString());
			map.put("score", MoodMapper.toScore(e.getMood()));
			return map;
		}).collect(Collectors.toList());
	}

	public Map<String, Long> moodDistribution(User user, LocalDate start, LocalDate end) {
		return journalRepo.findByUserAndEntryDateBetween(user, start, end).stream()
				.collect(Collectors.groupingBy(JournalEntry::getMood, Collectors.counting()));
	}
}
