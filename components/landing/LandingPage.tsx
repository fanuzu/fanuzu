'use client';

import { LangProvider } from '@/components/providers/LangProvider';
import { ContributionProvider } from '@/components/providers/ContributionProvider';
import { PlanetThemeProvider } from '@/components/providers/PlanetThemeProvider';
import { PreregModalProvider } from '@/components/providers/PreregModalProvider';
import PlanetAtmosphere from './PlanetAtmosphere';
import StarField from './StarField';
import MeteorShower from './MeteorShower';
import ParticleLayer from './ParticleLayer';
import Nav from './Nav';
import Hero from './Hero';
import Experience from './Experience';
import Campaign from './Campaign';
import Passport from './Passport';
import Origin from './Origin';
import Compare from './Compare';
import Prereg from './Prereg';
import Footer from './Footer';
import PreregModal from './PreregModal';
import AttributionTracker from './AttributionTracker';
import ZapButton from './ZapButton';
import ContributionToast from './ContributionToast';
import AppPreviewOverlay from './AppPreviewOverlay';

export default function LandingPage() {
  return (
    <LangProvider>
      <ContributionProvider>
        <PlanetThemeProvider>
          <PreregModalProvider>
            <div style={{ position: 'relative', width: '100%', minHeight: '100vh', background: '#05030B', color: '#FFFAFC', overflowX: 'hidden' }}>
              <AttributionTracker />
              <PlanetAtmosphere />
              <StarField />
              <MeteorShower />
              <ParticleLayer />
              <Nav />
              <Hero />
              <Experience />
              <Campaign />
              <Passport />
              <Origin />
              <Compare />
              <Prereg />
              <Footer />
              <ZapButton />
              <ContributionToast />
              <AppPreviewOverlay />
              <PreregModal />
            </div>
          </PreregModalProvider>
        </PlanetThemeProvider>
      </ContributionProvider>
    </LangProvider>
  );
}
