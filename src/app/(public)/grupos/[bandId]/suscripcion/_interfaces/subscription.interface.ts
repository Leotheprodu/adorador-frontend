/**
 * Subscription Plan Types
 */
export enum PlanType {
    TRIAL = 'TRIAL',
    BASIC = 'BASIC',
    PROFESSIONAL = 'PROFESSIONAL',
    PREMIUM = 'PREMIUM',
}

export interface SubscriptionPlan {
    id: number;
    name: string;
    type: PlanType;
    price: number;
    currency: string;
    maxMembers: number;
    maxSongs: number;
    maxEventsPerMonth: number;
    maxPeoplePerEvent: number;
    durationDays: number | null; // null = monthly, 15 = trial, 30 = existing bands, 365 = annual
    active: boolean;
    createdAt: string;
    updatedAt: string;
}

/**
 * Subscription Status Enum
 */
export enum SubscriptionStatus {
    TRIAL = 'TRIAL',
    ACTIVE = 'ACTIVE',
    PAYMENT_PENDING = 'PAYMENT_PENDING',
    GRACE_PERIOD = 'GRACE_PERIOD',
    EXPIRED = 'EXPIRED',
    CANCELLED = 'CANCELLED',
}

/**
 * Band Subscription
 */
export interface BandSubscription {
    id: number;
    bandId: number;
    planId: number;
    status: SubscriptionStatus;
    currentPeriodStart: string;
    currentPeriodEnd: string;
    gracePeriodEnd: string | null;
    cancelledAt: string | null;
    createdAt: string;
    updatedAt: string;
    plan: SubscriptionPlan;
}

/**
 * Subscription Limits and Usage
 */
export interface SubscriptionLimits {
    maxMembers: number;
    maxSongs: number;
    maxEventsPerMonth: number;
    maxPeoplePerEvent: number;
    currentMembers: number;
    currentSongs: number;
    currentEventsThisMonth: number;
}

/**
 * Subscription Limit Check Response
 */
export interface LimitCheckResponse {
    allowed: boolean;
    limit: number;
    current: number;
    remaining: number;
    message?: string;
}
