import React from 'react';
import Hero from '../components/Hero';
import Intro from '../components/Intro';
import GiantReveal from '../components/GiantReveal';

import BgScrubWrapper from '../components/BgScrubWrapper';

import Societies from '../components/Societies';
import StatsBlock from '../components/StatsBlock';
import JoinCTA from '../components/JoinCTA';

export default function HomePage() {
  return (
    <BgScrubWrapper>
      <Hero />
      <Intro />
      <GiantReveal />
      
      <Societies />

      <StatsBlock />
      <JoinCTA />
    </BgScrubWrapper>
  );
}
