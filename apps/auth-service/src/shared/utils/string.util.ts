// ---------------------------------------------------------------------

// apps/auth-service/src/shared/utils/string.util.ts

/**
 * String utility functions
 */
export class StringUtil {
    /**
     * Truncate string with ellipsis
     */
    static truncate(str: string, length: number): string {
        if (str.length <= length) {
            return str;
        }
        return str.substring(0, length) + '...';
    }

    /**
     * Capitalize first letter
     */
    static capitalize(str: string): string {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    /**
     * Convert to slug (URL-friendly)
     */
    static toSlug(str: string): string {
        return str
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    /**
     * Mask sensitive data
     */
    static mask(str: string, visibleChars: number = 4): string {
        if (str.length <= visibleChars) {
            return '*'.repeat(str.length);
        }
        const visible = str.slice(-visibleChars);
        const masked = '*'.repeat(str.length - visibleChars);
        return masked + visible;
    }

    /**
     * Generate random string
     */
    static random(length: number = 16): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    /**
     * Check if string is empty or whitespace
     */
    static isEmpty(str: string): boolean {
        return !str || str.trim().length === 0;
    }

    /**
     * Remove all whitespace
     */
    static removeWhitespace(str: string): string {
        return str.replace(/\s/g, '');
    }

    /**
     * Extract initials from name
     */
    static getInitials(name: string): string {
        return name
            .split(' ')
            .map(word => word.charAt(0).toUpperCase())
            .join('')
            .substring(0, 2);
    }
}