import {
    Injectable,
    ExecutionContext,
    UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    /**
     * Override default behavior to control
     * what happens after JWT validation
     */
    handleRequest(
        err: any,
        user: any,
        info: any,
        context: ExecutionContext,
    ) {
        // Jika terjadi error dari strategy
        if (err) {
            throw err;
        }

        // Jika token tidak valid / tidak ada user
        if (!user) {
            throw new UnauthorizedException(
                info?.message || 'Unauthorized access',
            );
        }

        // Jika valid → user akan disimpan di request.user
        return user;
    }
}
