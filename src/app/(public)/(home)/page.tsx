import { Metadata } from 'next';
import { HeroSection } from './_components/HeroSection';
import { FeaturesSection } from './_components/FeaturesSection';
import { ProblemSolutionSection } from './_components/ProblemSolutionSection';
import { ValuePropositionSection } from './_components/ValuePropositionSection';
import { HowItWorksSection } from './_components/HowItWorksSection';
import { SocialProofSection } from './_components/SocialProofSection';
import { CTASection } from './_components/CTASection';
import { ResourcesSection } from './_components/ResourcesSection';
import { appName, domain } from '@global/config/constants';
import { JsonLd } from '@global/components/SEO/JsonLd';

export const metadata: Metadata = {
  title: `${appName} - Gestión Profesional para Grupos de Alabanza`,
  description:
    'Gestiona canciones, coordina músicos y proyecta letras en tiempo real. Todo lo que tu grupo de alabanza necesita en una sola plataforma.',
};

export default function Home() {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: appName,
    url: domain,
    logo: `${domain}/favicon.ico`,
    sameAs: [
      'https://www.facebook.com/zamrapp',
      'https://www.instagram.com/zamr.app',
    ],
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: appName,
    operatingSystem: 'Any',
    applicationCategory: 'BusinessApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description:
      'Plataforma integral para ministerios de alabanza, gestión de canciones y eventos.',
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 transition-colors duration-300 dark:bg-gray-950">
      <JsonLd data={organizationSchema} />
      <JsonLd data={softwareSchema} />
      <HeroSection />
      <FeaturesSection />
      <ProblemSolutionSection />
      <ValuePropositionSection />
      <HowItWorksSection />
      <SocialProofSection />
      <CTASection />
      <ResourcesSection />
    </div>
  );
}
