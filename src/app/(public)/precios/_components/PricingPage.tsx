'use client';

import { Spinner } from "@heroui/spinner";
import { PricingHero } from './PricingHero';
import { PricingCards } from './PricingCards';
import { PricingFAQ } from './PricingFAQ';
import { TrialCTA } from './TrialCTA';
import { UpcomingFeaturesSection } from './UpcomingFeaturesSection';
import { usePricingData } from '../_hooks/usePricingData';

export const PricingPage = () => {
    const { monthlyPlans, annualPlans, isLoading } = usePricingData();

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <PricingHero />
            <PricingCards monthlyPlans={monthlyPlans} annualPlans={annualPlans} />
            <PricingFAQ />
            <UpcomingFeaturesSection />
            <TrialCTA />
        </div>
    );
};
