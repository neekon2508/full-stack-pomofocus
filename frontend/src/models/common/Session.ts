export type LangType = 'en' | 'vi';

export enum LanguageCode {
    en = 'en',
    vi = 'vi',
}

export interface Session {
    userId?: string;
    userNm?: string;
    langCd?: LanguageCode;
}