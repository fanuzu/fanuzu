'use client';

import { LangProvider } from '@/components/providers/LangProvider';
import { ContributionProvider } from '@/components/providers/ContributionProvider';
import { PlanetThemeProvider } from '@/components/providers/PlanetThemeProvider';
import PlanetAtmosphere from './PlanetAtmosphere';
import StarField from './StarField';
import MeteorShower from './MeteorShower';
import ParticleLayer from './ParticleLayer';
import Nav from './Nav';
import Hero from './Hero';
import Action from './Action';
import PopIntro from './PopIntro';
import Experience from './Experience';
import GrowthSystem from './GrowthSystem';
import FandomAction from './FandomAction';
import Quest from './Quest';
import Campaign from './Campaign';
import CoreMessage from './CoreMessage';
import Passport from './Passport';
import Origin from './Origin';
import Compare from './Compare';
import Prereg from './Prereg';
import FinalCta from './FinalCta';
import Footer from './Footer';

export default function LandingPage() {
  return (
    <LangProvider>
      <ContributionProvider>
        <PlanetThemeProvider>
          <div style={{ position: 'relative', width: '100%', minHeight: '100vh', background: '#05030B', color: '#FFFAFC', overflowX: 'hidden' }}>
            <PlanetAtmosphere />
            <StarField />
            <MeteorShower />
            <ParticleLayer />
            <Nav />
            <Hero />
            <Action />
            <PopIntro />
            <Experience />
            <GrowthSystem />
            <FandomAction />
            <Quest />
            <Campaign />
            <CoreMessage />
            <Passport />
            <Origin />
            <Compare />
            <Prereg />
            <FinalCta />
            <Footer />
          </div>
        </PlanetThemeProvider>
      </ContributionProvider>
    </LangProvider>
  );
}
