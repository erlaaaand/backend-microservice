// notification-priority.vo.ts
import { NotificationPriority } from '../enums/notification-priority.enum';

export class NotificationPriorityVO {
    private readonly value: NotificationPriority;

    constructor(priority: NotificationPriority) {
        this.value = priority;
    }

    getValue(): NotificationPriority {
        return this.value;
    }

    getNumericValue(): number {
        const priorityMap = {
            [NotificationPriority.CRITICAL]: 1,
            [NotificationPriority.HIGH]: 2,
            [NotificationPriority.NORMAL]: 3,
            [NotificationPriority.LOW]: 4,
        };
        return priorityMap[this.value];
    }

    isHigherThan(other: NotificationPriorityVO): boolean {
        return this.getNumericValue() < other.getNumericValue();
    }
}