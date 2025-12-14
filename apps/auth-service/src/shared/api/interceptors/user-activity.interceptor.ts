import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Inject } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import Redis from 'ioredis';
import { REDIS_CLIENT } from '../../../shared/infrastructure/config/redis.config';

@Injectable()
export class UserActivityInterceptor implements NestInterceptor {
    constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        // Gunakan pipe 'tap' untuk melakukan side-effect tanpa mengubah response
        return next.handle().pipe(
            tap(async () => {
                // Jika user sedang login (ada di request), perbarui statusnya di Redis
                if (user && user.id) {
                    const key = `user_online:${user.id}`;
                    // Set key dengan TTL 5 menit (300 detik)
                    // Artinya: "User ini aktif sekarang. Anggap offline jika 5 menit diam."
                    await this.redis.set(key, new Date().toISOString(), 'EX', 300);
                }
            }),
        );
    }
}