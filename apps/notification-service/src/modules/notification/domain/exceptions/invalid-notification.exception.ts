import { HttpException, HttpStatus } from '@nestjs/common';
// invalid-notification.exception.ts
export class InvalidNotificationException extends HttpException {
    constructor(message: string) {
        super(
            {
                statusCode: HttpStatus.BAD_REQUEST,
                message: `Invalid notification: ${message}`,
                error: 'InvalidNotification',
            },
            HttpStatus.BAD_REQUEST,
        );
    }
}