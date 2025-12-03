import { HeroSection } from '@/components/home/HeroSection';
import { NewsTicker } from '@/components/home/NewsTicker';

export default function Home() {

  return (
    <main className="min-h-screen bg-background selection:bg-primary/20">
      {/* Hero Section (Liquid Glass) */}
      <HeroSection />

      {/* Dynamic News Ticker */}
      <NewsTicker />



      {/* Footer CTA */}

    </main>
  );
}
