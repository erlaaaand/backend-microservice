import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Centralized cache key builder untuk konsistensi naming
 * Pattern: {prefix}:{namespace}:{identifier}:{subkey}
 */
@Injectable()
export class CacheKeyBuilder {
  private readonly prefix: string;

  constructor(private readonly configService: ConfigService) {
    this.prefix = this.configService.get('redis.keyPrefix') || 'notification:';
  }

  // Notification keys
  notificationStatus(notificationId: string): string {
    return `${this.prefix}notification:status:${notificationId}`;
  }

  notificationHistory(userId: string, page: number): string {
    return `${this.prefix}notification:history:${userId}:page:${page}`;
  }

  notificationMetadata(notificationId: string): string {
    return `${this.prefix}notification:metadata:${notificationId}`;
  }

  // Rate limiting keys
  rateLimitEmail(email: string): string {
    return `${this.prefix}rate-limit:email:${email}`;
  }

  rateLimitIP(ip: string): string {
    return `${this.prefix}rate-limit:ip:${ip}`;
  }

  rateLimitUser(userId: string): string {
    return `${this.prefix}rate-limit:user:${userId}`;
  }

  // Throttle keys
  throttleRequest(key: string): string {
    return `${this.prefix}throttle:${key}`;
  }

  // Template keys
  template(templateName: string): string {
    return `${this.prefix}template:${templateName}`;
  }

  templateList(): string {
    return `${this.prefix}template:list`;
  }

  // User keys
  userPreferences(userId: string): string {
    return `${this.prefix}user:preferences:${userId}`;
  }

  userNotificationSettings(userId: string): string {
    return `${this.prefix}user:settings:${userId}`;
  }

  // Stats keys
  statsDaily(date: string): string {
    return `${this.prefix}stats:daily:${date}`;
  }

  statsHourly(date: string, hour: number): string {
    return `${this.prefix}stats:hourly:${date}:${hour}`;
  }

  statsChannel(channel: string): string {
    return `${this.prefix}stats:channel:${channel}`;
  }

  // Lock keys (untuk distributed locking)
  lock(resource: string): string {
    return `${this.prefix}lock:${resource}`;
  }

  // Session/Token keys
  session(sessionId: string): string {
    return `${this.prefix}session:${sessionId}`;
  }

  token(tokenType: string, token: string): string {
    return `${this.prefix}token:${tokenType}:${token}`;
  }

  // Queue-related keys
  queueStats(queueName: string): string {
    return `${this.prefix}queue:stats:${queueName}`;
  }

  queueHealth(queueName: string): string {
    return `${this.prefix}queue:health:${queueName}`;
  }

  // Circuit breaker keys
  circuitBreaker(serviceName: string): string {
    return `${this.prefix}circuit-breaker:${serviceName}`;
  }

  // Feature flags
  featureFlag(flagName: string): string {
    return `${this.prefix}feature:${flagName}`;
  }

  // Custom key builder
  custom(...parts: string[]): string {
    return `${this.prefix}${parts.join(':')}`;
  }

  // Wildcard pattern untuk batch operations
  pattern(namespace: string): string {
    return `${this.prefix}${namespace}:*`;
  }

  // Helper: Extract parts from key
  extractParts(key: string): string[] {
    return key.replace(this.prefix, '').split(':');
  }

  // Helper: Check if key matches pattern
  matchesPattern(key: string, pattern: string): boolean {
    const regex = new RegExp('^' + pattern.replace('*', '.*') + '$');
    return regex.test(key);
  }
}