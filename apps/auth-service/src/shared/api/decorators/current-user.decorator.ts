import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        // Mengembalikan payload user yang sudah didecode oleh Passport JWT Strategy
        return request.user;
    },
);