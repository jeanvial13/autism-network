import Link from 'next/link';
export const dynamic = 'force-dynamic';
import { MapPin, BookOpen, Users, Brain, Calendar, Globe, ArrowRight } from 'lucide-react';
import { HeroSection } from '@/components/home/HeroSection';
import { GlassCard } from '@/components/ui/glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import { NewsTicker } from '@/components/home/NewsTicker';
import { useTranslations } from 'next-intl';
import { auth } from '@/auth';

export default async function Home() {
  const t = useTranslations('home');
  const session = await auth();

  return (
    <main className="min-h-screen bg-background selection:bg-primary/20">
      {/* Hero Section (Liquid Glass) */}
      <HeroSection />

      {/* Dynamic News Ticker */}
      <NewsTicker />



      {/* Footer CTA */}
      {!session && (
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5" />
          <div className="container px-4 md:px-6 mx-auto relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                {t('cta.title')}
              </h2>
              <p className="text-xl text-muted-foreground mb-10">
                {t('cta.subtitle')}
              </p>
              <Link href="/auth/signin">
                <GlassButton variant="primary" size="lg" className="px-12">
                  {t('cta.button')}
                </GlassButton>
              </Link>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
