// batch-result-response.dto.ts
export class BatchResultResponseDto {
    total: number;
    success: number;
    failed: number;
    results: Array<{
        notificationId: string;
        success: boolean;
        error?: string;
    }>;
}