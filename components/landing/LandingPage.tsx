'use client';

import { LangProvider } from '@/components/providers/LangProvider';
import { ContributionProvider } from '@/components/providers/ContributionProvider';
import StarField from './StarField';
import MeteorShower from './MeteorShower';
import ParticleLayer from './ParticleLayer';
import Nav from './Nav';
import Hero from './Hero';
import Why from './Why';
import PopIntro from './PopIntro';
import Experience from './Experience';
import GrowthSystem from './GrowthSystem';
import Campaign from './Campaign';
import Passport from './Passport';
import Origin from './Origin';
import Compare from './Compare';
import Prereg from './Prereg';
import Footer from './Footer';

export default function LandingPage() {
  return (
    <LangProvider>
      <ContributionProvider>
        <div style={{ position: 'relative', width: '100%', minHeight: '100vh', background: '#05030B', color: '#FFFAFC', overflowX: 'hidden' }}>
          <StarField />
          <MeteorShower />
          <ParticleLayer />
          <Nav />
          <Hero />
          <Why />
          <PopIntro />
          <Experience />
          <GrowthSystem />
          <Campaign />
          <Passport />
          <Origin />
          <Compare />
          <Prereg />
          <Footer />
        </div>
      </ContributionProvider>
    </LangProvider>
  );
}
