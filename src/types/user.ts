export enum ZyUserInfoType {
    email = "email",
    text = "text"
}

export interface ZyUserInfoBase<Type extends ZyUserInfoType> {
    id: number;
    label: string;
    type: Type;
}

export type ZyTextUserInfo = ZyUserInfoBase<ZyUserInfoType.text>;
export interface ZyEmailUserInfo extends ZyUserInfoBase<ZyUserInfoType.email> {
    payload: string[];
}

export type ZyUserInfo = ZyTextUserInfo | ZyEmailUserInfo;

export interface ZyEmail {
    address: string;
    is_primary: boolean;
    user_email_id: number;
    verified: boolean;
}

export interface ZySession {
    auth_token: string;
    /** ISO-formatted date */
    expiry_date: string;
    refresh_token: string;
    user_id: number;
}

export interface ZyUser {
    accepted_tos: boolean;
    /** ISO-formatted date */
    creation_date: string;
    emails: ZyEmail[];
    evaluations_remaining: number;
    first_name: string;
    icon_url: unknown;
    institution_ids: unknown[];
    is_test: number;
    last_name: string;
    metadata: object;
    refresh_token: string;
    role: unknown;
    salesforce_contact_id: unknown;
    user_id: number;
    vip: boolean;
}

export type RedactedZyUser = Omit<ZyUser, "refresh_token">;