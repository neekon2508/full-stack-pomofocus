export interface PaginationResponse<T> {
    totalCount: number;
    list: T[];
}

export interface PaginationRequest {
    pageSize?: string;
    start?: string;
}