"use client";

import Link from "next/link";
import { Paintbrush, Palette, Layers, Image as ImageIcon, ArrowRight, Sun, Moon, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useTheme } from "next-themes";

export default function CreativePage() {
    const [lang, setLang] = useState<'es' | 'en'>('es');
    const { setTheme, theme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const { scrollY } = useScroll();

    // Parallax transforms - smoothed
    const smoothScroll = useSpring(scrollY, { stiffness: 100, damping: 30, restDelta: 0.001 });

    const y1 = useTransform(smoothScroll, [0, 1000], [0, -150]);
    const y2 = useTransform(smoothScroll, [0, 1000], [0, -300]);
    const rotate1 = useTransform(smoothScroll, [0, 1000], [0, 45]);
    const rotate2 = useTransform(smoothScroll, [0, 1000], [0, -45]);

    useEffect(() => {
        setMounted(true);
    }, []);

    const t = {
        es: {
            hero_badge: "CREATIVE STUDIO V1.0",
            hero_t1: "DISEÑA",
            hero_t2: "TU OBRA MAESTRA",
            hero_desc: "El lienzo digital donde tus ideas cobran vida. Pincelada a pincelada.",
            btn_dashboard: "IR AL ESTUDIO",
            features_title: "PALETA",
            f1_title: "MEZCLA DE COLORES",
            f1_desc: "Combina elementos para crear estilos únicos.",
            f2_title: "CAPAS DINÁMICAS",
            f2_desc: "Organiza tu trabajo con precisión milimétrica.",
            p_free: "BOCETO",
            p_pro: "LIENZO PRO $15",
            p_f1: "Pinceles Básicos",
            p_f2: "3 Capas Máx",
            p_p1: "Exportación 4K",
            p_p2: "Capas Ilimitadas",
            p_p3: "Vectores SVG",
            donate_title: "¿INSPIRADO?",
            donate_desc: "Invítanos a una pintura o un café.",
            btn_donate: "APOYAR ARTE",
            footer_copy: "Painted pixel by pixel."
        },
        en: {
            hero_badge: "CREATIVE STUDIO V1.0",
            hero_t1: "DESIGN",
            hero_t2: "YOUR MASTERPIECE",
            hero_desc: "The digital canvas where your ideas come to life. Brushstroke by brushstroke.",
            btn_dashboard: "GO TO STUDIO",
            features_title: "PALETTE",
            f1_title: "COLOR BLENDING",
            f1_desc: "Combine elements to create unique styles.",
            f2_title: "DYNAMIC LAYERS",
            f2_desc: "Organize your work with pixel-perfect precision.",
            p_free: "SKETCH",
            p_pro: "CANVAS PRO $15",
            p_f1: "Basic Brushes",
            p_f2: "3 Layers Max",
            p_p1: "4K Export",
            p_p2: "Unlimited Layers",
            p_p3: "SVG Vectors",
            donate_title: "INSPIRED?",
            donate_desc: "Buy us some paint or a coffee.",
            btn_donate: "SUPPORT ART",
            footer_copy: "Painted pixel by pixel."
        }
    };

    const toggleLang = () => setLang(prev => prev === 'es' ? 'en' : 'es');

    if (!mounted) return null;

    return (
        <div className="theme-creative bg-builder min-h-screen text-[var(--brick-dark)] overflow-x-hidden font-tech relative selection:bg-[var(--brick-red)] selection:text-white transition-colors duration-300">

            {/* Scroll Progress Paintbrush */}
            <BrushProgress />

            {/* NAV */}
            <nav className="fixed top-6 left-0 right-0 z-50 px-6 md:px-12 flex justify-between items-center pointer-events-none">
                <motion.div
                    initial={{ y: -100 }}
                    animate={{ y: 0 }}
                    className="pointer-events-auto bg-[var(--brick-white)] border-4 border-[var(--brick-dark)] p-2 shadow-[4px_4px_0px_var(--brick-dark)] -rotate-2 hover:rotate-0 transition-transform cursor-pointer"
                >
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-[var(--brick-blue)] border-2 border-[var(--brick-dark)]"></div>
                        <div className="w-5 h-5 rounded-full bg-[var(--brick-red)] border-2 border-[var(--brick-dark)] -ml-2"></div>
                        <span className="font-block text-xl ml-1 tracking-tighter text-[var(--brick-dark)]">ART</span>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ y: -100 }}
                    animate={{ y: 0 }}
                    className="pointer-events-auto flex gap-3"
                >
                    <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="btn-block btn-secondary px-3 py-2 hover:bg-gray-50 flex items-center justify-center rounded-full">
                        {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    </button>
                    <button onClick={toggleLang} className="btn-block btn-secondary px-4 py-2 text-xs font-bold hover:bg-gray-50 rounded-full">
                        {lang === 'es' ? 'ES / EN' : 'EN / ES'}
                    </button>
                </motion.div>
            </nav>

            <main className="w-full relative z-10">

                {/* HERO */}
                <section className="min-h-[90vh] flex flex-col items-center justify-center px-4 pt-20 relative">
                    <CanvasBlock className="max-w-[95vw] md:max-w-5xl w-full text-center bg-[var(--brick-white)] z-10 relative">
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-[var(--brick-blue)] border-4 border-[var(--brick-dark)] px-6 py-2 shadow-[4px_4px_0px_var(--brick-dark)] rotate-2">
                            <span className="font-block text-xs tracking-wider text-black">{t[lang].hero_badge}</span>
                        </div>

                        <h1 className="text-5xl sm:text-7xl md:text-9xl mb-8 leading-[0.9] font-block uppercase tracking-tight mt-12 break-words max-w-full text-[var(--brick-dark)]">
                            <span className="block text-[var(--brick-red)] drop-shadow-[4px_4px_0px_var(--brick-dark)] italic">{t[lang].hero_t1}</span>
                            <span className="block break-all sm:break-normal">{t[lang].hero_t2}</span>
                        </h1>

                        <p className="text-xl md:text-3xl font-medium text-[var(--brick-dark)] opacity-90 mb-12 max-w-3xl mx-auto leading-relaxed px-4 font-handwriting">
                            {t[lang].hero_desc}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center pb-8 px-4">
                            <Link href="/dashboard" className="w-full sm:w-auto">
                                <motion.button
                                    whileHover={{ scale: 1.05, boxShadow: "8px 8px 0px var(--brick-dark)" }}
                                    whileTap={{ scale: 0.95, boxShadow: "0px 0px 0px var(--brick-dark)", translate: "4px 4px" }}
                                    className="btn-block btn-primary px-10 py-5 text-xl flex items-center justify-center gap-3 font-bold border-4 w-full rounded-full bg-[var(--brick-blue)] text-black"
                                >
                                    {t[lang].btn_dashboard} <Paintbrush className="w-6 h-6" />
                                </motion.button>
                            </Link>
                        </div>
                    </CanvasBlock>
                </section>

                {/* FEATURES */}
                <section className="max-w-7xl mx-auto px-6 py-32 relative">
                    <div className="text-center mb-24">
                        <SectionTitle>{t[lang].features_title}</SectionTitle>
                    </div>

                    <div className="grid md:grid-cols-2 gap-16">
                        <FeatureCard
                            icon={<Palette className="w-10 h-10 text-black" />}
                            color="bg-[var(--brick-yellow)]"
                            title={t[lang].f1_title}
                            desc={t[lang].f1_desc}
                            delay={0.1}
                        />
                        <div className="md:mt-24">
                            <FeatureCard
                                icon={<Layers className="w-10 h-10 text-black" />}
                                color="bg-[var(--brick-red)]"
                                title={t[lang].f2_title}
                                desc={t[lang].f2_desc}
                                delay={0.3}
                            />
                        </div>
                    </div>
                </section>

                {/* PRICING */}
                <section className="max-w-5xl mx-auto px-6 py-32 relative">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <PricingCard
                            title={t[lang].p_free}
                            price="$0"
                            delay={0.1}
                            features={[t[lang].p_f1, t[lang].p_f2]}
                        />
                        <PricingCard
                            title={t[lang].p_pro}
                            price="$15"
                            pro
                            delay={0.3}
                            features={[t[lang].p_p1, t[lang].p_p2, t[lang].p_p3]}
                        />
                    </div>
                </section>

                {/* DONATION */}
                <section className="max-w-3xl mx-auto px-6 py-32 text-center">
                    <CanvasBlock className="bg-[var(--brick-dark)] text-[var(--brick-white)] p-16 border-4 border-[var(--brick-white)] shadow-[16px_16px_0px_var(--brick-blue)] rounded-[3rem]">
                        <div className="w-20 h-20 bg-[var(--brick-red)] border-4 border-[var(--brick-white)] mx-auto mb-8 flex items-center justify-center -rotate-6 text-black rounded-full">
                            <Sparkles className="w-10 h-10" />
                        </div>
                        <h3 className="text-4xl font-block mb-6 text-[var(--brick-white)]">{t[lang].donate_title}</h3>
                        <p className="text-[var(--brick-white)] opacity-80 mb-10 font-medium text-xl">{t[lang].donate_desc}</p>
                        <button className="btn-block btn-accent px-10 py-4 text-xl border-[var(--brick-white)] shadow-[6px_6px_0px_var(--brick-white)] hover:shadow-[3px_3px_0px_var(--brick-white)] font-bold rounded-full bg-[var(--brick-yellow)] text-black">
                            {t[lang].btn_donate}
                        </button>
                    </CanvasBlock>
                </section>

                {/* FOOTER */}
                <footer className="bg-[var(--brick-dark)] text-[var(--brick-white)] pt-40 pb-16 border-t-[12px] border-[var(--brick-blue)] relative overflow-hidden text-center">
                    <h2 className="text-5xl md:text-[10rem] font-block text-[var(--brick-white)] opacity-10">ART</h2>
                    <p className="font-mono text-[var(--brick-white)] opacity-50 text-sm mt-8">{t[lang].footer_copy}</p>
                </footer>
            </main>

            {/* PARALLAX BG */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <motion.div style={{ y: y1, rotate: rotate1 }} className="absolute top-[15%] left-[8%] w-32 h-32 bg-[var(--brick-blue)] border-4 border-[var(--brick-dark)] shadow-[8px_8px_0px_rgba(0,0,0,0.1)] rounded-full opacity-60" />
                <motion.div style={{ y: y2, rotate: rotate2 }} className="absolute top-[40%] right-[5%] w-48 h-48 bg-[var(--brick-red)] border-4 border-[var(--brick-dark)] shadow-[8px_8px_0px_rgba(0,0,0,0.1)] rounded-full opacity-40 mix-blend-multiply" />
                <motion.div style={{ y: y1, rotate: rotate2 }} className="absolute bottom-[20%] left-[20%] w-24 h-24 bg-[var(--brick-yellow)] border-4 border-[var(--brick-dark)] shadow-[8px_8px_0px_rgba(0,0,0,0.1)] rounded-full opacity-80" />
            </div>
        </div>
    );
}

// ---------------- COMPONENTS ----------------

function BrushProgress() {
    const { scrollYProgress } = useScroll();
    const x = useTransform(scrollYProgress, [0, 1], [-100, 100]);
    const rotate = useTransform(scrollYProgress, [0, 1], [-10, 10]);

    return (
        <motion.div style={{ top: "15%", right: "30px", x, rotate }} className="fixed z-50 pointer-events-none opacity-80 hidden md:block">
            <Paintbrush className="w-16 h-16 text-[var(--brick-blue)] drop-shadow-xl" />
        </motion.div>
    )
}

function CanvasBlock({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 30 }}
            whileInView={{ scale: 1, opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ type: "spring", bounce: 0.3, duration: 1 }}
            className={cn("block-card p-8 md:p-14 transition-colors duration-300 rounded-3xl", className)}
        >
            {children}
        </motion.div>
    )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
    return (
        <motion.h2
            initial={{ opacity: 0, rotate: -5 }}
            whileInView={{ opacity: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", bounce: 0.6 }}
            className="text-5xl md:text-7xl font-block text-[var(--brick-dark)] bg-[var(--brick-white)] inline-block border-4 border-[var(--brick-dark)] px-8 py-4 shadow-[10px_10px_0px_var(--brick-red)] rounded-full transform -rotate-2"
        >
            {children}
        </motion.h2>
    )
}

function FeatureCard({ icon, color, title, desc, delay }: any) {
    return (
        <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay, type: "spring" }}
            whileHover={{ y: -10, boxShadow: "16px 16px 0px var(--brick-dark)", rotate: 1 }}
            className="block-card p-8 bg-[var(--brick-white)] border-[var(--brick-dark)] rounded-[2rem]"
        >
            <div className={`w-20 h-20 ${color} border-4 border-[var(--brick-dark)] flex items-center justify-center mb-6 shadow-[6px_6px_0px_var(--brick-dark)] rounded-full`}>
                {icon}
            </div>
            <h3 className="text-3xl font-bold mb-4 font-block uppercase text-[var(--brick-dark)]">{title}</h3>
            <p className="text-[var(--brick-dark)] opacity-80 leading-relaxed font-medium text-lg">{desc}</p>
        </motion.div>
    )
}

function PricingCard({ title, price, pro, delay, features = [] }: any) {
    return (
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay, type: "spring" }}
            whileHover={{ scale: 1.03 }}
            className={cn("block-card p-10 bg-[var(--brick-white)] rounded-[2.5rem]", pro ? "border-[var(--brick-blue)] shadow-[16px_16px_0px_var(--brick-blue)] relative z-10" : "opacity-90")}
        >
            {pro && <div className="absolute -top-5 right-6 bg-[var(--brick-red)] text-white border-2 border-[var(--brick-dark)] px-4 py-1 font-block text-sm rotate-3 shadow-md rounded-full">POPULAR</div>}
            <h3 className="font-block text-3xl text-[var(--brick-dark)] opacity-80 mb-2">{title}</h3>
            <div className="text-6xl font-bold font-block mb-8 text-[var(--brick-dark)]">{price}</div>

            {/* Features List */}
            <ul className="space-y-4 mb-10 text-left">
                {features.map((f: string, i: number) => (
                    <li key={i} className="flex items-center gap-3 font-bold text-base md:text-lg text-[var(--brick-dark)]">
                        <div className={cn("w-5 h-5 border-2 border-[var(--brick-dark)] flex-shrink-0 rounded-full", pro ? "bg-[var(--brick-green)]" : "bg-gray-300")}></div>
                        {f}
                    </li>
                ))}
            </ul>

            <button className="w-full btn-block py-4 font-bold text-xl text-[var(--brick-dark)] rounded-full hover:bg-[var(--brick-yellow)]">CHOOSE</button>
        </motion.div>
    )
}
