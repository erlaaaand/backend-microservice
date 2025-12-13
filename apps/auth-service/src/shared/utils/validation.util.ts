// apps/auth-service/src/shared/utils/validation.util.ts

/**
 * Validation utility functions
 */
export class ValidationUtil {
    /**
     * Validate UUID format
     */
    static isUUID(str: string): boolean {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return uuidRegex.test(str);
    }

    /**
     * Validate email format
     */
    static isEmail(str: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(str);
    }

    /**
     * Validate URL format
     */
    static isURL(str: string): boolean {
        try {
            new URL(str);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Validate phone number (Indonesian format)
     */
    static isPhoneNumber(str: string): boolean {
        const phoneRegex = /^\+62[0-9]{9,12}$/;
        return phoneRegex.test(str);
    }

    /**
     * Validate strong password
     */
    static isStrongPassword(str: string): boolean {
        if (str.length < 8) return false;
        const hasUpperCase = /[A-Z]/.test(str);
        const hasLowerCase = /[a-z]/.test(str);
        const hasNumber = /[0-9]/.test(str);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(str);
        return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
    }

    /**
     * Sanitize string (remove HTML tags)
     */
    static sanitize(str: string): string {
        return str.replace(/<[^>]*>/g, '');
    }
}
