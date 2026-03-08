export enum Method {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    PATCH = 'PATCH',
    DELETE = 'DELETE',
}

export enum SuccessOrNot {
    Y = 'Y',
    N = 'N',
}

export enum ServiceName {
    BACK_END_SERVICE_NAME = 'backend',
}

export interface CommonRequest {
    url: string;
    method?: Method;
    serviceName: ServiceName;
    queryParams?: URLSearchParams;
    bodyParams: object;
    headers?: object;
    responseType?: XMLHttpRequestResponseType;
}

export interface CommonResponse<T = any> {
    successOrNot: SuccessOrNot;
    statusCode: string;
    data?: T;
}

export interface DmlResponse {
    insertedRows?: number;
    updatedRows?: number;
    deletedRows?: number;
}

export enum StatusCode {
    SUCCESS = "SUCCESS",
    UNKNOWN_ERROR = 'UNKNOWN_ERROR',
    SESSION_EXPIRE = 'SESSION_EXPIRE',
    MANDATORY_PARAM_ERROR = 'MANDATORY_PARAM_ERROR',
    BAD_REQUEST_ERROR = 'BAD_REQUEST_ERROR',
    TIMEOUT = 'TIMEOUT',
    NOT_AUTHORIZED_EXCEPTION = 'NOT_AUTHORIZED_EXCEPTION',
    ERR_NETWORK = 'ERR_NETWORK',
    CONTINUOUS_LOGIN_FAILURE = 'CONTINUOUS_LOGIN_FAILURE',
    LOGIN_LOCKED = 'LOGIN_LOCKED',
}