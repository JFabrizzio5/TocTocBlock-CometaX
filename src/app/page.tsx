import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Box, Layers, Terminal, Database, Container, Code2, Sparkles, LayoutTemplate } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navigation */}
      <header className="px-6 py-4 flex items-center justify-between mx-auto w-full max-w-7xl">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <Layers className="w-5 h-5" />
          </div>
          Project Forge
        </div>
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" className="font-medium">Sign In</Button>
          </Link>
          <Link href="/dashboard">
            <Button className="rounded-full px-6 shadow-lg shadow-primary/20">
              Get Started
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <section className="py-20 md:py-32 px-6 text-center relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10" />

          <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm font-medium border border-border/50">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>The modern way to scaffold projects</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground text-balance">
              Building Web Apps <br />
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Just Got Easier</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance leading-relaxed">
              Launch production-ready Laravel and FastAPI applications in seconds.
              Manage your local development environment with a beautiful, friendly interface.
            </p>

            <div className="flex items-center justify-center gap-4 pt-4">
              <Link href="/dashboard">
                <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-xl shadow-primary/25 hover:shadow-primary/40 transition-all">
                  Enter Workspace <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full border-2">
                Open Documentation
              </Button>
            </div>
          </div>
        </section>

        {/* Project Structure / Features */}
        <section className="py-24 bg-white/50 border-y border-border/50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Everything You Need</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                We handle the boring setup so you can focus on building your next big idea.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<LayoutTemplate className="w-6 h-6 text-blue-500" />}
                title="Smart Scaffolding"
                description="Instant setup for Laravel 11 and FastAPI projects with best-practice directory structures pre-configured."
              />
              <FeatureCard
                icon={<Database className="w-6 h-6 text-emerald-500" />}
                title="Database Ready"
                description="One-click configuration for MySQL, PostgreSQL, SQLite, and Redis connections out of the box."
              />
              <FeatureCard
                icon={<Terminal className="w-6 h-6 text-purple-500" />}
                title="Process Control"
                description="Manage local servers directly from the UI. Start, stop, and monitor logs with zero friction."
              />
            </div>
          </div>
        </section>

        {/* Roadmap */}
        <section className="py-24 px-6 relative">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12 bg-primary/5 rounded-[2.5rem] p-12 border border-primary/10">
              <div className="space-y-6 max-w-lg">
                <div className="inline-block px-4 py-1.5 rounded-lg bg-primary/10 text-primary font-bold text-sm uppercase tracking-wider">
                  Coming Soon
                </div>
                <h2 className="text-3xl md:text-4xl font-bold">The Future is Bright</h2>
                <p className="text-lg text-muted-foreground">
                  We are actively building the next generation of features.
                  Here is what's shipping in the next update:
                </p>
                <ul className="space-y-4">
                  <RoadmapItem icon={<Box className="w-5 h-5" />} text="Bootstrap Vue.js & Nuxt applications" />
                  <RoadmapItem icon={<Code2 className="w-5 h-5" />} text="AdonisJS Full-stack Support" />
                  <RoadmapItem icon={<Container className="w-5 h-5" />} text="Auto-generated Docker Compose files" />
                </ul>
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
                <div className="relative bg-white p-8 rounded-3xl shadow-xl border border-border/40 w-full max-w-xs rotate-3 hover:rotate-0 transition-transform duration-500">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Container className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-bold">Docker Ready</div>
                      <div className="text-xs text-muted-foreground">Automated Containerization</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 bg-muted rounded-full w-3/4" />
                    <div className="h-2 bg-muted rounded-full w-full" />
                    <div className="h-2 bg-muted rounded-full w-5/6" />
                  </div>
                  <div className="mt-6 pt-4 border-t border-border/50 flex justify-between items-center">
                    <span className="text-xs font-mono text-muted-foreground">docker-compose.yml</span>
                    <span className="text-xs font-bold text-primary">Preview</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 text-center text-muted-foreground text-sm border-t border-border/40">
        <p>© {new Date().getFullYear()} Project Forge. Built for creators.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 rounded-2xl bg-white border border-border/40 shadow-sm hover:shadow-md transition-shadow">
      <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  )
}

function RoadmapItem({ icon, text }: { icon: React.ReactNode, text: string }) {
  return (
    <li className="flex items-center gap-3 text-foreground/80 font-medium">
      <div className="p-2 rounded-lg bg-white shadow-sm border border-border/50 text-primary">
        {icon}
      </div>
      {text}
    </li>
  )
}
