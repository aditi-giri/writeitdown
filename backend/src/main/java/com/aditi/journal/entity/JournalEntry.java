package com.aditi.journal.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(
    name = "journal_entries",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "entryDate"})
    }
)
public class JournalEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String encryptedContent;

    @Column(nullable = false)
    private String mood;

    @Column(nullable = false)
    private LocalDate entryDate;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
