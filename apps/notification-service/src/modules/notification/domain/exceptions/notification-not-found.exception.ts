import { HttpException, HttpStatus } from '@nestjs/common';

// notification-not-found.exception.ts
export class NotificationNotFoundException extends HttpException {
    constructor(notificationId: string) {
        super(
            {
                statusCode: HttpStatus.NOT_FOUND,
                message: `Notification with ID ${notificationId} not found`,
                error: 'NotificationNotFound',
            },
            HttpStatus.NOT_FOUND,
        );
    }
}