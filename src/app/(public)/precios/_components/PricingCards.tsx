'use client';

import { useState } from 'react';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { Button } from '@heroui/button';
import { Chip } from '@heroui/chip';
import Link from 'next/link';
import type { SubscriptionPlan } from '@bands/[bandId]/suscripcion/_interfaces/subscription.interface';
import {
  badges,
  getBillingPeriodLabel,
  calculateAnnualSavings,
  planBenefits,
} from '../_content/pricingContent';
import { PlanType } from '@bands/[bandId]/suscripcion/_interfaces/subscription.interface';
import {
  ChatIcon,
  CheckIcon,
  DownloadIcon,
  HeartIcon,
  MusicNoteIcon,
  UsersIcon,
  WrenchIcon,
} from '@global/icons';

interface PricingCardsProps {
  monthlyPlans: SubscriptionPlan[];
  annualPlans: SubscriptionPlan[];
}

export const PricingCards = ({
  monthlyPlans,
  annualPlans,
}: PricingCardsProps) => {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>(
    'annual',
  );

  const displayedPlans =
    billingPeriod === 'annual' ? annualPlans : monthlyPlans;

  // Determinar el plan más popular (típicamente el del medio)
  const mostPopularIndex = Math.floor(displayedPlans.length / 2);

  const getPlanBadge = (plan: SubscriptionPlan, index: number) => {
    if (index === mostPopularIndex) {
      return (
        <Chip
          color="primary"
          variant="solid"
          className="absolute -top-3 left-1/2 -translate-x-1/2"
        >
          {badges.mostPopular}
        </Chip>
      );
    }

    if (billingPeriod === 'annual' && monthlyPlans.length > 0) {
      const monthlyPlan = monthlyPlans.find((p) => p.type === plan.type);
      if (monthlyPlan) {
        const savings = calculateAnnualSavings(
          Number(plan.price),
          Number(monthlyPlan.price),
        );
        if (savings.percentage > 0) {
          return (
            <Chip
              color="success"
              variant="solid"
              className="absolute -top-3 left-1/2 -translate-x-1/2"
            >
              {badges.bestValue} - Ahorra {savings.percentage}%
            </Chip>
          );
        }
      }
    }

    return null;
  };

  const getFeaturesList = (planType: PlanType): string[] => {
    return planBenefits[planType] || [];
  };

  return (
    <section className="bg-white px-4 py-24 transition-colors duration-300 dark:bg-gray-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Billing Period Toggle */}
        <div className="mb-16 flex justify-center">
          <div className="inline-flex rounded-lg bg-gray-100 p-1 transition-colors duration-300 dark:bg-brand-purple-900">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`rounded-md px-6 py-2 text-sm font-medium transition-all duration-200 ${
                billingPeriod === 'monthly'
                  ? 'bg-white text-brand-purple-700 shadow-sm dark:bg-brand-purple-800 dark:text-brand-purple-200'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              Mensual
            </button>
            <button
              onClick={() => setBillingPeriod('annual')}
              className={`flex items-center gap-2 rounded-md px-6 py-2 text-sm font-medium transition-all duration-200 ${
                billingPeriod === 'annual'
                  ? 'bg-white text-brand-purple-700 shadow-sm dark:bg-brand-purple-800 dark:text-brand-purple-200'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              Anual
              <span className="rounded-full bg-success-100 px-2 py-0.5 text-xs text-success-700 dark:bg-success-900 dark:text-success-200">
                Ahorra más
              </span>
            </button>
          </div>
        </div>

        {/* Universal Benefits Banner */}
        <div className="mb-12 overflow-hidden rounded-2xl bg-gradient-to-r from-brand-purple-900 to-brand-purple-800 p-8 text-white shadow-xl dark:from-brand-purple-950 dark:to-brand-purple-900">
          <div className="flex flex-col items-center gap-6 text-center md:flex-row md:justify-between md:text-left">
            <div className="max-w-xl">
              <h3 className="mb-2 text-2xl font-bold">
                ¿Eres músico o cantante? ¡Esto es gratis para ti!
              </h3>
              <p className="text-brand-purple-100">
                Todos los usuarios de Zamr disfrutan de beneficios gratuitos
                para su desarrollo personal, independientemente del plan de su
                grupo.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-x-8 gap-y-2 text-left sm:grid-cols-2">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-sm">
                  <MusicNoteIcon className="h-4 w-4" />
                </span>
                <span className="text-sm font-medium">
                  Acceder a cualquier canción
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-sm">
                  <UsersIcon className="h-4 w-4" />
                </span>
                <span className="text-sm font-medium">
                  Acceso al Feed Social
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-sm">
                  <DownloadIcon className="h-4 w-4" />
                </span>
                <span className="text-sm font-medium">
                  Guardar canciones favoritas
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid gap-8 pt-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-12">
          {displayedPlans.map((plan, index) => {
            const isPopular = index === mostPopularIndex;
            const features = getFeaturesList(plan.type);

            return (
              <Card
                key={plan.id}
                className={`relative overflow-visible transition-all duration-300 ${
                  isPopular
                    ? 'scale-105 border-2 border-brand-purple-500 shadow-2xl dark:border-brand-purple-400'
                    : 'border border-gray-200 shadow-lg hover:shadow-xl dark:border-brand-purple-800'
                } ${
                  isPopular
                    ? 'bg-gradient-to-br from-brand-purple-50 to-white dark:from-brand-purple-900 dark:to-brand-purple-950'
                    : 'bg-white dark:bg-brand-purple-900'
                }`}
              >
                {getPlanBadge(plan, index)}

                <CardHeader className="flex-col items-start gap-2 pb-6 pt-8">
                  <h3 className="text-2xl font-bold text-gray-900 transition-colors duration-300 dark:text-gray-100">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-brand-purple-700 dark:text-brand-purple-400">
                      ${plan.price}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      /{getBillingPeriodLabel(plan.durationDays)}
                    </span>
                  </div>

                  {/* Savings Display for Annual */}
                  {billingPeriod === 'annual' && monthlyPlans.length > 0 && (
                    <>
                      {(() => {
                        const monthlyPlan = monthlyPlans.find(
                          (p) => p.type === plan.type,
                        );
                        if (monthlyPlan) {
                          const savings = calculateAnnualSavings(
                            Number(plan.price),
                            Number(monthlyPlan.price),
                          );
                          if (savings.amount > 0) {
                            return (
                              <p className="text-sm font-semibold text-success-600 dark:text-success-400">
                                Ahorras ${savings.amount.toFixed(2)} al año
                              </p>
                            );
                          }
                        }
                        return null;
                      })()}
                    </>
                  )}
                </CardHeader>

                <CardBody className="gap-6">
                  {/* Active Group Benefits - HIGHLIGHTED */}
                  <div className="rounded-xl border border-brand-purple-200 bg-brand-purple-50 p-4 dark:border-brand-purple-700 dark:bg-brand-purple-900/40">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-purple-600 text-xs text-white">
                        <WrenchIcon className="h-4 w-4" />
                      </span>
                      <h4 className="font-bold text-brand-purple-800 dark:text-brand-purple-200">
                        Herramientas para Músicos
                      </h4>
                    </div>
                    <p className="mb-3 text-xs leading-relaxed text-brand-purple-700 dark:text-brand-purple-300">
                      Tus miembros podrán usar estas herramientas para ensayar
                      en casa:
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
                        <span className="text-brand-purple-500">
                          <CheckIcon className="h-4 w-4" />
                        </span>
                        Metrónomo Inteligente
                      </li>
                      <li className="flex items-start gap-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
                        <span className="text-brand-purple-500">
                          <CheckIcon className="h-4 w-4" />
                        </span>
                        Sincronización Letra/Acordes
                      </li>
                    </ul>
                  </div>

                  {/* Features List */}
                  <ul className="space-y-3">
                    {features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckIcon className="h-4 w-4" />

                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Limits Display */}
                  <div className="rounded-lg bg-gray-50 p-4 transition-colors duration-300 dark:bg-brand-purple-800/50">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Límites del Plan
                    </p>
                    <div className="grid grid-cols-2 gap-x-2 gap-y-3 text-sm">
                      <div className="col-span-2 flex items-center justify-between rounded bg-white p-2 shadow-sm dark:bg-brand-purple-900/50">
                        <span className="text-gray-600 dark:text-gray-300">
                          Personas simultáneas por evento:
                        </span>
                        <span className="font-bold text-brand-purple-700 dark:text-brand-purple-300">
                          {plan.maxPeoplePerEvent}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-gray-100 pb-1 dark:border-gray-700">
                        <span className="text-gray-600 dark:text-gray-400">
                          Miembros:
                        </span>
                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                          {plan.maxMembers}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-gray-100 pb-1 dark:border-gray-700">
                        <span className="text-gray-600 dark:text-gray-400">
                          Canciones:
                        </span>
                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                          {plan.maxSongs}
                        </span>
                      </div>
                      <div className="col-span-2 flex justify-between pt-1">
                        <span className="text-gray-600 dark:text-gray-400">
                          Eventos mensuales:
                        </span>
                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                          {plan.maxEventsPerMonth}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Button
                    as={Link}
                    href="/auth/sign-up"
                    color={isPopular ? 'primary' : 'default'}
                    variant={isPopular ? 'solid' : 'bordered'}
                    size="lg"
                    className="w-full font-semibold"
                  >
                    Prueba gratis 15 días
                  </Button>

                  <p className="text-center text-xs text-gray-500 dark:text-gray-400">
                    Sin tarjeta de crédito • Úsalo en eventos reales
                  </p>
                </CardBody>
              </Card>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Todos los planes incluyen modo proyector con fondos animados y
            soporte por WhatsApp
          </p>
        </div>
      </div>
    </section>
  );
};
