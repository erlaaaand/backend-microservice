// response.interface.ts
export interface IApiResponse<T = any> {
    statusCode: number;
    message: string;
    data?: T;
    error?: string;
    timestamp: string;
}

export interface IPaginatedResponse<T> extends IApiResponse<T[]> {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}