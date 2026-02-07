"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function SplatterBackground() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    // Generate random splats
    const splats = Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 100 + Math.random() * 300, // Bigger splats
        color: [
            "var(--primary)",
            "var(--secondary)",
            "var(--accent)",
            "var(--brick-yellow)",
            "#00FFFF", // Cyan
            "#FF00FF"  // Magenta
        ][Math.floor(Math.random() * 6)],
        duration: 10 + Math.random() * 20
    }));

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[var(--background)]">

            {/* SVG Filter for Gooey Effect */}
            <svg className="hidden">
                <defs>
                    <filter id="goo">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="15" result="blur" />
                        <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
                        <feBlend in="SourceGraphic" in2="goo" />
                    </filter>
                </defs>
            </svg>

            <div style={{ filter: "url(#goo)" }} className="w-full h-full relative opacity-40">
                {splats.map((splat) => (
                    <motion.div
                        key={splat.id}
                        initial={{
                            x: `${splat.x}vw`,
                            y: `${splat.y}vh`,
                            scale: 0.8
                        }}
                        animate={{
                            x: [`${splat.x}vw`, `${splat.x + (Math.random() * 20 - 10)}vw`, `${splat.x}vw`],
                            y: [`${splat.y}vh`, `${splat.y + (Math.random() * 20 - 10)}vh`, `${splat.y}vh`],
                            scale: [0.8, 1.2, 0.8],
                            rotate: [0, 90, 0]
                        }}
                        transition={{
                            duration: splat.duration,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        style={{
                            position: "absolute",
                            width: splat.size,
                            height: splat.size,
                            background: splat.color,
                            borderRadius: "50%",
                        }}
                    />
                ))}
            </div>

            {/* Pattern Overlay for Texture */}
            <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
                backgroundSize: '20px 20px'
            }}></div>
        </div>
    );
}
