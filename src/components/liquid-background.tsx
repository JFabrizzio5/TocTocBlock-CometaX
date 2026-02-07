"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function LiquidBackground({ className }: { className?: string }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const blobs = [
        { id: 1, color: "var(--primary)", size: "40vw", x: -10, y: -10, duration: 20 },
        { id: 2, color: "var(--secondary)", size: "35vw", x: 80, y: -10, duration: 25 },
        { id: 3, color: "var(--accent)", size: "45vw", x: -10, y: 80, duration: 30 },
        { id: 4, color: "var(--brick-blue)", size: "50vw", x: 80, y: 90, duration: 35 },
        { id: 5, color: "var(--brick-yellow)", size: "30vw", x: 40, y: 40, duration: 22 },
    ];

    return (
        <div className={cn("fixed inset-0 z-0 overflow-hidden bg-[var(--background)] pointer-events-none", className)}>

            {/* SVG Filter for Gooey Liquid Effect */}
            <svg className="hidden">
                <defs>
                    <filter id="liquid-goo">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="40" result="blur" />
                        <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 60 -9" result="goo" />
                        <feBlend in="SourceGraphic" in2="goo" />
                    </filter>
                </defs>
            </svg>

            <div style={{ filter: "url(#liquid-goo)" }} className="absolute inset-0 opacity-60">
                {blobs.map((blob) => (
                    <motion.div
                        key={blob.id}
                        initial={{
                            x: `${blob.x}vw`,
                            y: `${blob.y}vh`,
                        }}
                        animate={{
                            x: [`${blob.x}vw`, `${blob.x + 20}vw`, `${blob.x - 20}vw`, `${blob.x}vw`],
                            y: [`${blob.y}vh`, `${blob.y + 20}vh`, `${blob.y - 20}vh`, `${blob.y}vh`],
                            scale: [1, 1.2, 0.8, 1],
                            rotate: [0, 90, 180, 270, 0]
                        }}
                        transition={{
                            duration: blob.duration,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        style={{
                            position: "absolute",
                            width: blob.size,
                            height: blob.size,
                            background: blob.color,
                            borderRadius: "50%",
                            top: "-15vw",
                            left: "-15vw"
                        }}
                    />
                ))}
            </div>

            {/* Grain Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}></div>
        </div>
    );
}
