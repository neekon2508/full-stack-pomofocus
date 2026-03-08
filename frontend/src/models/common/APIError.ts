export interface ApiError extends Error {
    displayMessage: string;
    errorCode: string;
    errorDetail: string;
}

export interface ErrorResponse {
    response: {
        data: CommonError;
    };
}

export interface CommonError {
    displayMessage: string;
    errorCode: number;
    errorDetails?: string | [{ [key: string] : string}];
    detail?: string;
}