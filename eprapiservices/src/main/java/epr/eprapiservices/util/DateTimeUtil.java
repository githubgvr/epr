package epr.eprapiservices.util;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * Utility class for date and time operations.
 */
public final class DateTimeUtil {

    private static final DateTimeFormatter DEFAULT_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    private static final DateTimeFormatter ISO_FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

    private DateTimeUtil() {
        // Utility class - prevent instantiation
    }

    /**
     * Get current date and time.
     */
    public static LocalDateTime now() {
        return LocalDateTime.now();
    }

    /**
     * Format LocalDateTime to string using default format.
     */
    public static String format(LocalDateTime dateTime) {
        return dateTime != null ? dateTime.format(DEFAULT_FORMATTER) : null;
    }

    /**
     * Format LocalDateTime to string using ISO format.
     */
    public static String formatIso(LocalDateTime dateTime) {
        return dateTime != null ? dateTime.format(ISO_FORMATTER) : null;
    }

    /**
     * Parse string to LocalDateTime using default format.
     */
    public static LocalDateTime parse(String dateTimeString) {
        return dateTimeString != null && !dateTimeString.trim().isEmpty() 
            ? LocalDateTime.parse(dateTimeString, DEFAULT_FORMATTER) 
            : null;
    }

    /**
     * Parse string to LocalDateTime using ISO format.
     */
    public static LocalDateTime parseIso(String dateTimeString) {
        return dateTimeString != null && !dateTimeString.trim().isEmpty() 
            ? LocalDateTime.parse(dateTimeString, ISO_FORMATTER) 
            : null;
    }
}
