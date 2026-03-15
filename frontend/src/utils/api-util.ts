import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import {
  CommonRequest,
  CommonResponse,
  Method,
  StatusCode,
  SuccessOrNot,
} from "@/models/common/RestApi";

axios.defaults.withCredentials = true;

const getBaseURL = (): string => {
  const domainURL = process.env.API_BASE_URL || "";
  const ipURL = process.env.API_BASE_URL_IP || "";
  if (!ipURL) return domainURL;
  const currentHost = window.location.hostname;
  const ipPattern = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
  if (ipPattern.test(currentHost)) return ipURL;
  return domainURL;
};

const getInstance = (request: CommonRequest): AxiosInstance => {
  const baseURL = getBaseURL();

  let config = {};
  switch (request.method) {
    case Method.GET:
      config = {
        baseURL: baseURL,
        headers: request?.headers || {
          Accept: "application/json",
        },
        params: request?.queryParams || {},
        responseType: request?.responseType || "json",
      };
      break;
    case Method.DELETE:
      config = {
        baseURL: baseURL,
        timeout: 2000,
        headers: {
          Accept: "application/json",
          ...(request?.bodyParams
            ? { "Content-Type": "application/json" }
            : {}),
          ...(request?.headers || {}),
        },
        params: request?.queryParams || {},
        responseType: request?.responseType || "json",
      };
      break;
    case Method.POST:
    case Method.PUT:
    case Method.PATCH:
      config = {
        baseURL: baseURL,
        timeout: 3600000,
        headers: request?.headers || {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        responseType: request?.responseType || "json",
      };
      break;
    default:
  }
  const instance = axios.create(config);

  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      config.headers["x-original-path"] = window.location.pathname;
      config.headers["x-language"] = localStorage.getItem("langCode");
      config.headers["accept-language"] = localStorage.getItem("langCode");
      return config;
    },
    (error: any) => {
      return Promise.reject(error);
    },
  );

  instance.interceptors.response.use(
    async (response: any): Promise<any> => {
      const commonResponse: CommonResponse = response.data as CommonResponse;

      if (
        commonResponse.statusCode &&
        commonResponse.statusCode === StatusCode.SESSION_EXPIRE
      ) {
        sessionStorage.clear();
        window.location.assign("/login");
      } else if (
        commonResponse.statusCode &&
        commonResponse.statusCode === StatusCode.NOT_AUTHORIZED_EXCEPTION
      ) {
        window.location.assign("/*");
        return;
      }
      return commonResponse;
    },
    async (error: any): Promise<any> => {
      const backendStatusCode = error.response?.data?.statusCode;
      const errorResponse: CommonResponse = {
        successOrNot: SuccessOrNot.N,
        statusCode: backendStatusCode || StatusCode.UNKNOWN_ERROR,
        data: error.response?.data?.data || {},
      };
      console.log(error.config?.url);
      if (
        error.status == 401 &&
        backendStatusCode === StatusCode.SESSION_EXPIRE &&
        error.config?.url == "/api/v1/session"
      ) {
        sessionStorage.clear();
        window.location.assign("/login");
      }

      if (error.code === "ECONNABORTED") {
        errorResponse.statusCode = StatusCode.TIMEOUT;
        console.log(error.message);
      }

      return errorResponse;
    },
  );
  return instance;
};

export const callApi = async (
  apiRequest: CommonRequest,
): Promise<CommonResponse> => {
  let response: CommonResponse = {
    successOrNot: SuccessOrNot.N,
    statusCode: StatusCode.BAD_REQUEST_ERROR,
    data: {},
  };

  apiRequest.url = `/api${apiRequest.url}`;
  switch (apiRequest.method) {
    case Method.GET:
      response = await getInstance(apiRequest).get(apiRequest.url);
      break;
    case Method.POST:
      response = await getInstance(apiRequest).post(
        apiRequest.url,
        apiRequest.bodyParams || {},
      );
      break;
    case Method.PUT:
      response = await getInstance(apiRequest).put(
        apiRequest.url,
        apiRequest.bodyParams || {},
      );
      break;
    case Method.DELETE:
      // bodyParams가 있으면 body로 전달 (Content-Type은 getInstance에서 자동 추가됨)
      if (apiRequest.bodyParams) {
        response = await getInstance(apiRequest).delete(apiRequest.url, {
          data: apiRequest.bodyParams,
        });
      } else {
        response = await getInstance(apiRequest).delete(apiRequest.url);
      }
      break;
    case Method.PATCH:
      response = await getInstance(apiRequest).patch(
        apiRequest.url,
        apiRequest.bodyParams || {},
      );
      break;
    default:
      break;
  }
  return response;
};
