package com.aditi.journal.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aditi.journal.entity.JournalEntry;
import com.aditi.journal.entity.User;

public interface JournalEntryRepository
        extends JpaRepository<JournalEntry, Long> {

    Optional<JournalEntry> findByUserAndEntryDate(User user, LocalDate entryDate);
    List<JournalEntry> findByUserAndEntryDateBetween(
            User user,
            LocalDate start,
            LocalDate end
    );
    
    List<JournalEntry> findTop7ByUserOrderByEntryDateDesc(User user);

}
