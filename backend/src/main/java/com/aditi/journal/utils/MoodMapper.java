package com.aditi.journal.utils;

public class MoodMapper {

    public static int toScore(String mood) {
        return switch (mood) {
            case "😊 Happy" -> 5;
            case "😌 Calm" -> 4;
            case "😐 Neutral" -> 3;
            case "😔 Sad" -> 2;
            case "😡 Angry" -> 1;
            default -> 3;
        };
    }
}
