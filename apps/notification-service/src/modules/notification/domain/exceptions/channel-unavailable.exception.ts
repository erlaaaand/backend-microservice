import { HttpException, HttpStatus } from '@nestjs/common';

// channel-unavailable.exception.ts
export class ChannelUnavailableException extends HttpException {
    constructor(channel: string) {
        super(
            {
                statusCode: HttpStatus.SERVICE_UNAVAILABLE,
                message: `Notification channel ${channel} is currently unavailable`,
                error: 'ChannelUnavailable',
            },
            HttpStatus.SERVICE_UNAVAILABLE,
        );
    }
}