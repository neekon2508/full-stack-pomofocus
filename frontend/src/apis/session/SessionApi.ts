import { CommonRequest, CommonResponse, Method, ServiceName } from "@/models/common/RestApi"
import { Session } from "@/models/common/Session";
import { callApi } from "@/utils/api-util";

export const devLogin = async (userId: string, userPass: string | undefined, langCd: string) => {
    const request:  CommonRequest = {
        method: Method.POST,
        url: '/login',
        serviceName: ServiceName.BACK_END_SERVICE_NAME,
        bodyParams: {userId: userId, userPass: userPass, langCd: langCd},
    };
    const response: CommonResponse<Session> = await callApi(request);
}