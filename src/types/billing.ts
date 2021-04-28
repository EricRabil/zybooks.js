import { ZyPermissions } from "./access-control";
import { ZyUserInfo } from "./user";

export interface ZyTransaction {
    access_key: string | null;
    amount_discounted: number;
    amount_paid: number;
    amount_refunded: number;
    /** ISO-formatted date */
    date_paid: string;
    discount_basis_transaction_id: number;
    /** ISO-formatted date */
    refund_date: string;
    refunding_user: unknown;
    stripe_charge_id: string;
    subscription_id: number;
    subscription_transaction_id: number;
    taxes_paid: number;
    taxes_refunded: number;
    /** ISO-formatted date */
    transaction_end_date: number;
    transaction_type_id: number;
    used_as_discount_basis: boolean;
}

export interface ZySubscription {
    /** ISO-formatted date */
    begin_date: string;
    config: object;
    /** ISO-formatted date */
    end_date: string;
    permissions: ZyPermissions;
    subscribed: boolean;
    subscription_id: number;
    transactions: ZyTransaction[];
    unsubscribed: boolean;
    userInfo: Record<number, string>;
    zybook_role: string;
}

export interface ZyPurchaseInfo {
    /** ISO-formatted date */
    availability_begin_date: string;
    /** ISO-formatted date */
    availability_end_date: string;
    description: string;
    label: string;
    permissions: ZyPermissions;
    price: number;
    /** ISO-formatted date */
    subscription_end_date: string;
    transaction_type_id: number;
}

export interface ZySubscriptionInfo {
    additional_instructions: string;
    additional_purchase_info: ZyPurchaseInfo[];
    /** ISO-formatted date */
    begin_date: string;
    /** ISO-formatted date */
    cutoff_date: string;
    duration: unknown;
    /** ISO-formatted date */
    end_date: string;
    force_access_key: boolean;
    price: number;
    renewal_discount: unknown;
    user_info: ZyUserInfo[];
}