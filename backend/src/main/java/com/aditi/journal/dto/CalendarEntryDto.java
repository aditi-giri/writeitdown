package com.aditi.journal.dto;

import java.time.LocalDate;

public class CalendarEntryDto {

    private LocalDate date;
    private String mood;
    private boolean hasEntry;

    public CalendarEntryDto(LocalDate date, String mood) {
        this.date = date;
        this.mood = mood;
        this.hasEntry = true;
    }

    public LocalDate getDate() {
        return date;
    }

    public String getMood() {
        return mood;
    }

    public boolean isHasEntry() {
        return hasEntry;
    }
}
