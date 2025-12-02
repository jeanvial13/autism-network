import Link from 'next/link';
import { MapPin, BookOpen, Users, Brain, Calendar, Globe, ArrowRight } from 'lucide-react';
import { HeroSection } from '@/components/home/HeroSection';
import { GlassCard } from '@/components/ui/glass-card';
import { GlassButton } from '@/components/ui/glass-button';

export default function Home() {
  return (
    <main className="min-h-screen bg-background selection:bg-primary/20">
      {/* Hero Section (Liquid Glass) */}
      <HeroSection />

      {/* Daily Brief Section */}
      <section className="py-20 relative">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-lg bg-primary/10">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Today's Autism News</h2>
          </div>

          <GlassCard className="border-l-4 border-l-primary">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="p-4 rounded-2xl bg-secondary/10 text-secondary-foreground">
                <Brain className="h-8 w-8" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Daily Scientific Digest
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Get the latest autism research, clinical updates, and evidence-based news reviewed by experts. Updated every day to keep you informed.
                </p>
                <Link href="/articles" className="inline-flex items-center text-primary font-medium hover:underline">
                  Read Today's Update <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-secondary/5">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
              Everything You Need
            </h2>
            <p className="text-lg text-muted-foreground">
              Evidence-based information, global connections, and expert support all in one place.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Global Map */}
            <Link href="/map" className="block h-full">
              <GlassCard className="h-full hover:-translate-y-1 transition-transform duration-300">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6">
                  <MapPin className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Global Map</h3>
                <p className="text-muted-foreground">
                  Find verified autism centers, therapists, and professionals near you. Filter by services, languages, and insurance.
                </p>
              </GlassCard>
            </Link>

            {/* Resource Library */}
            <Link href="/resources" className="block h-full">
              <GlassCard className="h-full hover:-translate-y-1 transition-transform duration-300">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-6">
                  <BookOpen className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Resource Library</h3>
                <p className="text-muted-foreground">
                  Explore our curated library of evidence-based articles, guides, videos, and tools for families and professionals.
                </p>
              </GlassCard>
            </Link>

            {/* Professional Network */}
            <Link href="/auth/signin" className="block h-full">
              <GlassCard className="h-full hover:-translate-y-1 transition-transform duration-300">
                <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-6">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Join the Network</h3>
                <p className="text-muted-foreground">
                  Connect with verified professionals, other families, and autistic adults. Share experiences and find support.
                </p>
              </GlassCard>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5" />
        <div className="container px-4 md:px-6 mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-muted-foreground mb-10">
              Join thousands of families and professionals in the global autism community.
            </p>
            <Link href="/auth/signin">
              <GlassButton variant="primary" size="lg" className="px-12">
                Create Free Account
              </GlassButton>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
