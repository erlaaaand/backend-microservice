// apps/auth-service/src/shared/utils/date.util.ts

/**
 * Date utility functions
 */
export class DateUtil {
    /**
     * Add days to date
     */
    static addDays(date: Date, days: number): Date {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }

    /**
     * Add hours to date
     */
    static addHours(date: Date, hours: number): Date {
        const result = new Date(date);
        result.setHours(result.getHours() + hours);
        return result;
    }

    /**
     * Add minutes to date
     */
    static addMinutes(date: Date, minutes: number): Date {
        const result = new Date(date);
        result.setMinutes(result.getMinutes() + minutes);
        return result;
    }

    /**
     * Check if date is expired
     */
    static isExpired(date: Date): boolean {
        return date < new Date();
    }

    /**
     * Get days difference between two dates
     */
    static getDaysDifference(date1: Date, date2: Date): number {
        const diffTime = Math.abs(date2.getTime() - date1.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    /**
     * Format date to ISO string
     */
    static toISOString(date: Date): string {
        return date.toISOString();
    }

    /**
     * Check if date is today
     */
    static isToday(date: Date): boolean {
        const today = new Date();
        return (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        );
    }

    /**
     * Start of day
     */
    static startOfDay(date: Date): Date {
        const result = new Date(date);
        result.setHours(0, 0, 0, 0);
        return result;
    }

    /**
     * End of day
     */
    static endOfDay(date: Date): Date {
        const result = new Date(date);
        result.setHours(23, 59, 59, 999);
        return result;
    }
}
