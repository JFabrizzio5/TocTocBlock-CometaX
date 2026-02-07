"use client";

import Link from "next/link";
import { Brush, Palette, PaintBucket, Coffee, ArrowRight, Sun, Moon, Sparkles, Layers, Zap, Code2, Check, Grid3X3 } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTheme } from "next-themes";
import { SplashBackground } from "@/components/splash-background";

export default function LandingPage() {
  const [lang, setLang] = useState<'es' | 'en'>('es');
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const t = {
    es: {
      nav_start: "Empezar",
      hero_title: "CREA BLOQUES O PINTA TU ARQUITECTURA",
      hero_subtitle: "La CLI que transforma tu código en una obra de arte. Estructura sólida, estilo fluido.",
      btn_primary: "EMPEZAR AHORA",
      btn_secondary: "LEER DOCUMENTACIÓN",
      features_title: "¿POR QUÉ INK?",
      f1_title: "Estructura Cúbica",
      f1_desc: "Andamiaje sólido para tus proyectos Next.js. Todo encaja perfectamente.",
      f2_title: "Sistema Líquido",
      f2_desc: "Temas que fluyen y se adaptan. Cambia de modo claro a oscuro como tinta en agua.",
      f3_title: "Extensiones Plug & Play",
      f3_desc: "Añade funcionalidad como quien añade una capa de pintura.",
      pricing_title: "PRECIOS SIMPLES",
      p_hobby_title: "Hobby",
      p_hobby_price: "Donación",
      p_team_title: "Team",
      p_team_price: "$5/mes",
      p_biz_title: "Business",
      p_biz_price: "$10/mes",
      footer: "Diseñado con ❤️ y Tinta."
    },
    en: {
      nav_start: "Start",
      hero_title: "CREATE BLOCKS OR PAINT YOUR ARCHITECTURE",
      hero_subtitle: "The CLI that transforms your code into a work of art. Solid structure, fluid style.",
      btn_primary: "START NOW",
      btn_secondary: "READ DOCS",
      features_title: "WHY INK?",
      f1_title: "Cubic Structure",
      f1_desc: "Solid scaffolding for your Next.js projects. Everything fits perfectly.",
      f2_title: "Liquid System",
      f2_desc: "Themes that flow and adapt. Switch from light to dark mode like ink in water.",
      f3_title: "Plug & Play Extensions",
      f3_desc: "Add functionality like adding a layer of paint.",
      pricing_title: "SIMPLE PRICING",
      p_hobby_title: "Hobby",
      p_hobby_price: "Donation",
      p_team_title: "Team",
      p_team_price: "$5/mo",
      p_biz_title: "Business",
      p_biz_price: "$10/mo",
      footer: "Designed with ❤️ and Ink."
    }
  };

  const toggleLang = () => setLang(prev => prev === 'es' ? 'en' : 'es');

  return (
    <div className="min-h-screen text-[var(--brick-dark)] font-tech relative selection:bg-[var(--brick-yellow)] selection:text-black transition-colors duration-300">

      <SplashBackground />

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center bg-[var(--brick-white)]/80 backdrop-blur-sm border-b-4 border-[var(--brick-dark)]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[var(--brick-red)] border-2 border-[var(--brick-dark)] rounded-md rotate-3"></div>
          <span className="font-block text-xl tracking-tight text-[var(--brick-dark)]">TOC TOC BLOCK</span>
        </div>
        <div className="flex gap-4">
          <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="p-2 bg-[var(--brick-white)] border-2 border-[var(--brick-dark)] rounded-full hover:bg-[var(--brick-yellow)] transition shadow-[2px_2px_0px_var(--brick-dark)] active:translate-y-[2px] active:shadow-none">
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button onClick={toggleLang} className="text-sm font-bold px-3 py-1 bg-[var(--brick-white)] border-2 border-[var(--brick-dark)] rounded-full hover:bg-[var(--brick-blue)] hover:text-white transition shadow-[2px_2px_0px_var(--brick-dark)] active:translate-y-[2px] active:shadow-none">
            {lang.toUpperCase()}
          </button>
        </div>
      </nav>

      <main className="relative z-10 w-full">

        {/* HERO SECTION */}
        <section className="min-h-screen flex flex-col items-center justify-center text-center px-4 pt-24 relative overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: 'spring' }}
            className="max-w-5xl bg-[var(--brick-white)] p-8 md:p-16 border-4 border-[var(--brick-dark)] shadow-[12px_12px_0px_var(--brick-dark)] rounded-2xl relative overflow-visible z-10"
          >
            {/* Decorative Blocks */}
            <div className="absolute -top-6 -right-6 w-16 h-16 bg-[var(--brick-yellow)] border-4 border-[var(--brick-dark)] rounded-lg rotate-12 -z-10"></div>
            <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-[var(--brick-blue)] border-4 border-[var(--brick-dark)] rounded-full -z-10"></div>

            <h1 className="text-5xl md:text-8xl font-block uppercase leading-[0.9] text-[var(--brick-dark)] mb-8 drop-shadow-sm">
              {t[lang].hero_title}
            </h1>
            <p className="text-xl md:text-2xl font-medium opacity-100 text-[var(--brick-dark)] max-w-2xl mx-auto mb-10 leading-relaxed">
              {t[lang].hero_subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-block bg-[var(--brick-dark)] text-[var(--brick-white)] px-8 py-4 text-lg border-4 border-[var(--brick-dark)] shadow-[6px_6px_0px_var(--brick-white)] hover:shadow-[4px_4px_0px_var(--brick-white)] hover:translate-y-1 transition-all"
                >
                  {t[lang].btn_primary}
                </motion.button>
              </Link>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-block bg-[var(--brick-white)] text-[var(--brick-dark)] px-8 py-4 text-lg border-4 border-[var(--brick-dark)] shadow-[6px_6px_0px_var(--brick-dark)] hover:shadow-[4px_4px_0px_var(--brick-dark)] hover:translate-y-1 transition-all"
              >
                {t[lang].btn_secondary}
              </motion.button>
            </div>
          </motion.div>
          <div className="paint-drip-bottom bg-[var(--brick-dark)]"></div>
        </section>

        {/* FEATURES SECTION */}
        <section className="py-32 px-6 relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20 relative">
              <Brush className="absolute -top-12 left-1/2 -translate-x-32 w-16 h-16 text-[var(--brick-blue)] -rotate-12 opacity-50" />
              <div className="inline-block bg-[var(--brick-yellow)] border-4 border-[var(--brick-dark)] px-6 py-2 rounded-lg shadow-[4px_4px_0px_var(--brick-dark)] rotate-[-2deg] mb-6">
                <h2 className="text-4xl md:text-6xl font-block uppercase text-[var(--brick-dark)]">{t[lang].features_title}</h2>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Grid3X3 className="w-10 h-10 text-[var(--brick-white)]" />}
                color="bg-[var(--brick-blue)]"
                title={t[lang].f1_title}
                desc={t[lang].f1_desc}
                delay={0}
              />
              <FeatureCard
                icon={<PaintBucket className="w-10 h-10 text-[var(--brick-white)]" />}
                color="bg-[var(--brick-red)]"
                title={t[lang].f2_title}
                desc={t[lang].f2_desc}
                delay={0.2}
              />
              <FeatureCard
                icon={<Zap className="w-10 h-10 text-[var(--brick-white)]" />}
                color="bg-[var(--brick-green)]"
                title={t[lang].f3_title}
                desc={t[lang].f3_desc}
                delay={0.4}
              />
            </div>
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section className="py-32 px-6 bg-[var(--brick-yellow)]/20 border-y-4 border-[var(--brick-dark)] relative">
          <div className="paint-drip-top"></div>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <div className="inline-block bg-[var(--brick-white)] border-4 border-[var(--brick-dark)] px-6 py-2 rounded-lg shadow-[6px_6px_0px_var(--brick-dark)] rotate-[1deg] mb-6">
                <h2 className="text-4xl md:text-6xl font-block uppercase text-[var(--brick-dark)]">¿CÓMO FUNCIONA?</h2>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-12 relative">
              {/* Connecting line for desktop */}
              <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-[var(--brick-dark)] -z-10 translate-y-[-50%] opacity-20"></div>

              <StepCard
                number="01"
                title="CREA"
                desc="Define tus componentes y bloques de construcción básicos."
                icon={<Grid3X3 className="w-8 h-8" />}
                delay={0.1}
              />
              <StepCard
                number="02"
                title="PINTA"
                desc="Aplica estilos fluidos y temas dinámicos con un solo comando."
                icon={<Brush className="w-8 h-8" />}
                delay={0.3}
              />
              <StepCard
                number="03"
                title="GENERA"
                desc="Observa cómo tu arquitectura se convierte en una obra de arte."
                icon={<Sparkles className="w-8 h-8" />}
                delay={0.5}
              />
            </div>
          </div>
          <div className="paint-drip-bottom"></div>
        </section>

        {/* PRICING SECTION */}
        <section className="py-32 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <div className="inline-block bg-[var(--brick-white)] border-4 border-[var(--brick-dark)] px-6 py-2 rounded-full shadow-[4px_4px_0px_var(--brick-dark)] rotate-[1deg] mb-6 relative">
                <PaintBucket className="absolute -top-10 -right-10 w-16 h-16 text-[var(--brick-red)] rotate-12 drop-shadow-lg" />
                <h2 className="text-4xl md:text-6xl font-block uppercase text-[var(--brick-dark)]">{t[lang].pricing_title}</h2>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-8 items-end">
              <PricingCard
                title={t[lang].p_hobby_title}
                price={t[lang].p_hobby_price}
                features={["CLI Access", "Community Themes", "Public Repos"]}
              />
              <PricingCard
                title={t[lang].p_team_title}
                price={t[lang].p_team_price}
                features={["Private Repos", "Shared Configs", "Priority Support", "Advanced Analytics"]}
                featured
              />
              <PricingCard
                title={t[lang].p_biz_title}
                price={t[lang].p_biz_price}
                features={["SSO", "Audit Logs", "Dedicated CSM", "On-premise Option"]}
              />
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-24 text-center">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="inline-block bg-[var(--brick-dark)] text-white p-12 border-4 border-[var(--brick-dark)] shadow-[12px_12px_0px_var(--brick-yellow)] rounded-3xl"
          >
            <h3 className="text-4xl font-block mb-8 underline decoration-[var(--brick-yellow)] decoration-4 underline-offset-8">¿LISTO PARA EMPEZAR?</h3>
            <Link href="/dashboard">
              <button className="btn-block bg-[var(--brick-yellow)] text-[var(--brick-dark)] px-12 py-4 text-2xl font-block border-4 border-[var(--brick-dark)] shadow-[6px_6px_0px_white]">
                {t[lang].btn_primary}
              </button>
            </Link>
          </motion.div>
        </section>

        {/* FOOTER */}
        <footer className="py-12 text-center bg-[var(--brick-dark)] text-[var(--brick-white)] border-t-8 border-[var(--brick-red)]">
          <h2 className="text-9xl font-block opacity-20 mb-4 select-none">INK</h2>
          <p className="opacity-60 font-mono text-sm">{t[lang].footer}</p>
        </footer>

      </main>
    </div>
  );
}

// --- COMPONENTS ---

function FeatureCard({ icon, title, desc, delay, color }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5, type: "spring" }}
      whileHover={{ y: -10, rotate: 1 }}
      className="p-8 rounded-xl bg-[var(--brick-white)] border-4 border-[var(--brick-dark)] shadow-[8px_8px_0px_var(--brick-dark)] transition-all group hover:shadow-[12px_12px_0px_var(--brick-dark)]"
    >
      <div className={`w-16 h-16 rounded-lg ${color} border-4 border-[var(--brick-dark)] flex items-center justify-center mb-6 shadow-[4px_4px_0px_var(--brick-dark)]`}>
        {icon}
      </div>
      <h3 className="text-2xl font-block uppercase mb-4 text-[var(--brick-dark)]">{title}</h3>
      <p className="text-[var(--brick-dark)] opacity-90 font-medium leading-relaxed">{desc}</p>
    </motion.div>
  )
}

function PricingCard({ title, price, features, featured }: any) {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      className={cn(
        "p-8 rounded-2xl border-4 flex flex-col relative overflow-hidden transition-all",
        featured
          ? "bg-[var(--brick-white)] border-[var(--brick-blue)] shadow-[12px_12px_0px_var(--brick-blue)] z-10 scale-105"
          : "bg-[var(--brick-white)] opacity-90 border-[var(--brick-dark)] shadow-[8px_8px_0px_var(--brick-dark)]"
      )}
    >
      {featured && (
        <div className="absolute top-4 right-4 bg-[var(--brick-red)] text-white border-2 border-[var(--brick-dark)] text-xs font-bold px-3 py-1 rounded-md rotate-3 shadow-[2px_2px_0px_var(--brick-dark)]">
          BEST VALUE
        </div>
      )}
      <h3 className={cn("text-xl font-bold uppercase mb-2 text-[var(--brick-dark)]")}>{title}</h3>
      <div className="text-4xl font-block mb-8 text-[var(--brick-dark)]">{price}</div>
      <ul className="space-y-4 mb-8 flex-1">
        {features.map((f: string, i: number) => (
          <li key={i} className="flex items-center gap-3 text-sm font-bold text-[var(--brick-dark)]">
            <div className={cn("w-5 h-5 border-2 border-[var(--brick-dark)] rounded-sm flex items-center justify-center", featured ? "bg-[var(--brick-green)]" : "bg-gray-200")}>
              <Check className="w-4 h-4 text-[var(--brick-dark)]" />
            </div>
            {f}
          </li>
        ))}
      </ul>
      <button className={cn(
        "w-full py-3 rounded-lg font-bold border-2 border-[var(--brick-dark)] transition-all shadow-[4px_4px_0px_var(--brick-dark)] active:translate-y-[2px] active:shadow-[2px_2px_0px_var(--brick-dark)]",
        featured
          ? "bg-[var(--brick-blue)] text-white hover:bg-[var(--brick-blue)]/90"
          : "bg-gray-100 text-[var(--brick-dark)] hover:bg-gray-200"
      )}>
        Select Plan
      </button>
    </motion.div>
  )
}

function StepCard({ number, title, desc, icon, delay }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="bg-[var(--brick-white)] border-4 border-[var(--brick-dark)] p-8 rounded-xl shadow-[4px_4px_0px_var(--brick-dark)] relative group"
    >
      <div className="absolute -top-4 -left-4 w-12 h-12 bg-[var(--brick-dark)] text-white flex items-center justify-center font-block text-xl rounded-lg group-hover:rotate-12 transition-transform">
        {number}
      </div>
      <div className="mb-6 text-[var(--brick-dark)] opacity-60">
        {icon}
      </div>
      <h3 className="text-2xl font-block mb-3 text-[var(--brick-dark)]">{title}</h3>
      <p className="font-medium text-[var(--brick-dark)] opacity-80">{desc}</p>
    </motion.div>
  )
}
