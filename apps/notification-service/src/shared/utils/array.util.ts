// array.util.ts
export class ArrayUtil {
    /**
     * Chunk array into smaller arrays
     */
    static chunk<T>(array: T[], size: number): T[][] {
        const chunks: T[][] = [];

        for (let i = 0; i < array.length; i += size) {
            chunks.push(array.slice(i, i + size));
        }

        return chunks;
    }

    /**
     * Remove duplicates from array
     */
    static unique<T>(array: T[]): T[] {
        return [...new Set(array)];
    }

    /**
     * Shuffle array randomly
     */
    static shuffle<T>(array: T[]): T[] {
        const shuffled = [...array];

        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        return shuffled;
    }

    /**
     * Get random item from array
     */
    static random<T>(array: T[]): T {
        return array[Math.floor(Math.random() * array.length)];
    }

    /**
     * Group array by key
     */
    static groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
        return array.reduce((groups, item) => {
            const groupKey = String(item[key]);

            if (!groups[groupKey]) {
                groups[groupKey] = [];
            }

            groups[groupKey].push(item);
            return groups;
        }, {} as Record<string, T[]>);
    }
}