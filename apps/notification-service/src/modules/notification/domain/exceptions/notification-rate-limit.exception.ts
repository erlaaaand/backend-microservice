import { HttpException, HttpStatus } from '@nestjs/common';

// notification-rate-limit.exception.ts
export class NotificationRateLimitException extends HttpException {
    constructor(recipient: string, retryAfter?: number) {
        super(
            {
                statusCode: HttpStatus.TOO_MANY_REQUESTS,
                message: `Rate limit exceeded for recipient: ${recipient}`,
                error: 'RateLimitExceeded',
                retryAfter: retryAfter || 60,
            },
            HttpStatus.TOO_MANY_REQUESTS,
        );
    }
}