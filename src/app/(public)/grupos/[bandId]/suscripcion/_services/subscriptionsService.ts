import { FetchData, PostData } from '@global/services/HandleAPI';
import { Server1API } from '@global/config/constants';
import type {
    GetPlansResponse,
    GetSubscriptionResponse,
    GetLimitsResponse,
    CancelSubscriptionResponse,
} from '../_interfaces/serviceResponses';

/**
 * GET - List all active subscription plans
 */
export const getSubscriptionPlans = () => {
    return FetchData<GetPlansResponse>({
        key: ['SubscriptionPlans'],
        url: `${Server1API}/subscriptions/plans`,
    });
};

/**
 * GET - Get band's current subscription
 */
export const getBandSubscription = ({
    bandId,
    enabled = true,
}: {
    bandId: string;
    enabled?: boolean;
}) => {
    return FetchData<GetSubscriptionResponse>({
        key: ['BandSubscription', bandId],
        url: `${Server1API}/subscriptions/band/${bandId}`,
        isEnabled: !!bandId && enabled,
    });
};

/**
 * GET - Get subscription limits and current usage
 */
export const getSubscriptionLimits = ({
    bandId,
    enabled = true,
}: {
    bandId: string;
    enabled?: boolean;
}) => {
    return FetchData<GetLimitsResponse>({
        key: ['SubscriptionLimits', bandId],
        url: `${Server1API}/subscriptions/band/${bandId}/limits`,
        isEnabled: !!bandId && enabled,
    });
};

/**
 * DELETE - Cancel band's subscription
 */
export const cancelSubscriptionService = (bandId: string) => {
    return PostData<CancelSubscriptionResponse, null>({
        key: 'CancelSubscription',
        url: `${Server1API}/subscriptions/band/${bandId}`,
        method: 'DELETE',
    });
};
