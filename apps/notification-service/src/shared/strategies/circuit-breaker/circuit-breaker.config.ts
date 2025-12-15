// circuit-breaker.config.ts
export interface CircuitBreakerConfig {
    failureThreshold: number; // Number of failures before opening
    successThreshold: number; // Number of successes to close circuit
    timeout: number; // Timeout in ms for half-open to open
    resetTimeout: number; // Time before attempting to close circuit
}

export const DEFAULT_CIRCUIT_BREAKER_CONFIG: CircuitBreakerConfig = {
    failureThreshold: 5,
    successThreshold: 2,
    timeout: 5000,
    resetTimeout: 60000,
};