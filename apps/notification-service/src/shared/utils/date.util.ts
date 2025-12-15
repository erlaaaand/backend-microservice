// date.util.ts
export class DateUtil {
    static addHours(date: Date, hours: number): Date {
        return new Date(date.getTime() + hours * 60 * 60 * 1000);
    }

    static addMinutes(date: Date, minutes: number): Date {
        return new Date(date.getTime() + minutes * 60 * 1000);
    }

    static isExpired(date: Date): boolean {
        return new Date() > date;
    }

    static formatISO(date: Date): string {
        return date.toISOString();
    }

    static parseISO(dateString: string): Date {
        return new Date(dateString);
    }
}