// string.util.ts
export class StringUtil {
    /**
     * Truncate string with ellipsis
     */
    static truncate(text: string, maxLength: number, suffix: string = '...'): string {
        if (text.length <= maxLength) {
            return text;
        }
        return text.substring(0, maxLength - suffix.length) + suffix;
    }

    /**
     * Convert to slug (URL-friendly)
     */
    static slugify(text: string): string {
        return text
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    /**
     * Capitalize first letter
     */
    static capitalize(text: string): string {
        if (!text) return text;
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    }

    /**
     * Convert to title case
     */
    static titleCase(text: string): string {
        return text
            .toLowerCase()
            .split(' ')
            .map((word) => this.capitalize(word))
            .join(' ');
    }

    /**
     * Mask sensitive data (email, phone, etc.)
     */
    static mask(text: string, visibleChars: number = 4, maskChar: string = '*'): string {
        if (text.length <= visibleChars) {
            return maskChar.repeat(text.length);
        }

        const visible = text.slice(-visibleChars);
        const masked = maskChar.repeat(text.length - visibleChars);
        return masked + visible;
    }

    /**
     * Mask email address
     */
    static maskEmail(email: string): string {
        const [localPart, domain] = email.split('@');
        const maskedLocal = this.mask(localPart, 2);
        return `${maskedLocal}@${domain}`;
    }

    /**
     * Generate random string
     */
    static random(length: number = 10, chars?: string): string {
        const characters = chars || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';

        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }

        return result;
    }

    /**
     * Extract initials from name
     */
    static getInitials(name: string, maxInitials: number = 2): string {
        return name
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase())
            .slice(0, maxInitials)
            .join('');
    }

    /**
     * Check if string is valid JSON
     */
    static isJSON(text: string): boolean {
        try {
            JSON.parse(text);
            return true;
        } catch {
            return false;
        }
    }
}