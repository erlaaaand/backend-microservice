/**
 * Interface standar untuk Use Case (Logika Bisnis).
 * TRequest: Bentuk data input (DTO).
 * TResponse: Bentuk data output.
 */
export interface UseCase<TRequest, TResponse> {
    execute(request?: TRequest): Promise<TResponse> | TResponse;
}