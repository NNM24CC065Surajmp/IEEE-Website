import Hero from '../components/Hero';
import Intro from '../components/Intro';
import FeaturedEvents from '../components/FeaturedEvents';
import JoinCTA from '../components/JoinCTA';

export default function HomePage() {
  return (
    <div>
      <Hero />
      <Intro />
      <FeaturedEvents />
      <JoinCTA />
    </div>
  );
}
