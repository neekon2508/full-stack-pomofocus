import { devLogin } from "@/apis/session/SessionApi";
import { useReactMutation } from "@/hooks/use-react-mutation";

type LoginParams = {
    userId: string;
    userPass: string;
    langCd: string;
}

function useLoginMutation() {
    return useReactMutation(({userId, userPass, langCd}: LoginParams) => {
        return devLogin(userId, userPass, langCd);
    });
}

export {useLoginMutation};