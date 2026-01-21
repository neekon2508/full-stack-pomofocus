import { LangType, Session } from "@/models/common/Session";
import {create} from 'zustand';

interface SessionState {
    userId: string;
    userNm: string;
    langCd: LangType | '';
    setSession: (session: Session) => void;
    resetSession: () => void;
    setLangCd: (langCd: LangType) => void;
}

export const useSessionStore = create<SessionState>((set) => {
    return {
        userId: '',
        userNm: '',
        langCd: '',

        setSession: (session: Session) => set({
            userId: session.userId,
            userNm: session.userNm,
            langCd: session.langCd,
        }),

        resetSession: async () => {
            set({
                userId: '',
                userNm: '',
                langCd: '',
            });
        },

        setLangCd: (langCd: LangType) => {
            set((prev) => ({...prev, langCd}));
        }

    };
})