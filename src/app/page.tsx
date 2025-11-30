import Link from 'next/link';
import { MapPin, BookOpen, Users, Brain, Calendar, Globe } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" />
        <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              <span className="block">Find Support.</span>
              <span className="block">Find Answers.</span>
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Find Community.
              </span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-xl mx-auto">
              A global network connecting autistic individuals, families, and verified professionals with evidence-based information and trusted support.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/map"
                className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all hover:scale-105"
              >
                Explore the Map
              </Link>
              <Link
                href="/resources"
                className="rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground hover:bg-muted transition-all"
              >
                Browse Resources
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Daily Brief Section */}
      <section className="py-16 bg-card/30">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <Calendar className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold text-foreground">Today's Autism News</h2>
          </div>
          <div className="rounded-2xl bg-card border border-border p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <Brain className="h-10 w-10 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Daily Scientific Digest
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Get the latest autism research, clinical updates, and evidence-based news reviewed by experts. Updated every day.
                </p>
                <Link
                  href="/articles"
                  className="inline-flex items-center mt-4 text-primary hover:text-primary/80 font-medium"
                >
                  Read Today's Update →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-background">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Everything You Need, All in One Place
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Evidence-based information, global connections, and expert support.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Global Map */}
            <Link
              href="/map"
              className="group relative rounded-2xl border border-border bg-card p-8 hover:border-primary/50 hover:shadow-lg transition-all"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-6">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                Global Map
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Find verified autism centers, therapists, and professionals near you. Filter by services, languages, and insurance.
              </p>
            </Link>

            {/* Resource Library */}
            <Link
              href="/resources"
              className="group relative rounded-2xl border border-border bg-card p-8 hover:border-primary/50 hover:shadow-lg transition-all"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10 mb-6">
                <BookOpen className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-secondary transition-colors">
                Resource Library
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Explore our curated library of evidence-based articles, guides, videos, and tools for families and professionals.
              </p>
            </Link>

            {/* Professional Network */}
            <Link
              href="/auth/signin"
              className="group relative rounded-2xl border border-border bg-card p-8 hover:border-primary/50 hover:shadow-lg transition-all"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 mb-6">
                <Users className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-accent transition-colors">
                Join the Network
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Connect with verified professionals, other families, and autistic adults. Share experiences and find support.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Map Preview Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <Globe className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold text-foreground">Centers Near You</h2>
          </div>
          <div className="rounded-2xl bg-card border border-border overflow-hidden shadow-lg">
            <div className="aspect-video bg-muted flex items-center justify-center">
              <div className="text-center p-8">
                <MapPin className="h-16 w-16 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Interactive Map</h3>
                <p className="text-muted-foreground max-w-md">
                  The interactive map will show verified autism centers and professionals worldwide.
                </p>
                <Link
                  href="/map"
                  className="inline-block mt-6 rounded-full bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all"
                >
                  Open Full Map
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 bg-background">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="rounded-2xl bg-gradient-to-r from-primary to-secondary p-12 text-center shadow-xl">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of families and professionals in the global autism community.
            </p>
            <Link
              href="/auth/signin"
              className="inline-block rounded-full bg-white px-8 py-3 text-sm font-semibold text-primary shadow-sm hover:bg-white/90 transition-all hover:scale-105"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
