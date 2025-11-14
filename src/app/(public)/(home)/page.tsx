import { Metadata } from 'next';
import { HeroSection } from './_components/HeroSection';
import { FeaturesSection } from './_components/FeaturesSection';
import { HowItWorksSection } from './_components/HowItWorksSection';
import { SocialProofSection } from './_components/SocialProofSection';
import { CTASection } from './_components/CTASection';
import { ResourcesSection } from './_components/ResourcesSection';
import { appName } from '@global/config/constants';

export const metadata: Metadata = {
  title: `${appName} - Gestión Profesional para Grupos de Alabanza`,
  description:
    'Gestiona canciones, coordina músicos y proyecta letras en tiempo real. Todo lo que tu grupo de alabanza necesita en una sola plataforma.',
};

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <SocialProofSection />
      <CTASection />
      <ResourcesSection />
    </div>
  );
}
