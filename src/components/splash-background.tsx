"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function SplashBackground({ className }: { className?: string }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    // Generate many static splats for a "wall" effect
    const splats = Array.from({ length: 40 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 50 + Math.random() * 200,
        color: [
            "var(--primary)",
            "var(--secondary)",
            "var(--accent)",
            "var(--brick-yellow)",
            "var(--brick-blue)",
            "var(--brick-red)"
        ][Math.floor(Math.random() * 6)],
        rotation: Math.random() * 360,
        path: [
            "M40,40 Q50,10 60,40 T80,50 T60,60 T40,60 T20,50 T40,40", // Blob 1
            "M30,30 Q50,5 70,30 T90,50 T70,70 T30,70 T10,50 T30,30", // Blob 2
            "M20,20 Q60,0 80,40 T60,80 T20,60 0,40 T20,20" // Blob 3
        ][Math.floor(Math.random() * 3)]
    }));

    return (
        <div className={cn("fixed inset-0 z-0 overflow-hidden bg-[var(--background)] pointer-events-none", className)}>

            {/* Static Splats */}
            <div className="absolute inset-0 opacity-20">
                {splats.map((splat) => (
                    <div
                        key={splat.id}
                        style={{
                            position: "absolute",
                            left: `${splat.x}%`,
                            top: `${splat.y}%`,
                            width: `${splat.size}px`,
                            height: `${splat.size}px`,
                            transform: `translate(-50%, -50%) rotate(${splat.rotation}deg)`,
                            fill: splat.color,
                        }}
                    >
                        <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', fill: splat.color, filter: 'blur(10px)' }}>
                            <path d={splat.path} />
                        </svg>
                        {/* Sharper inner core for "dried paint" look */}
                        <svg viewBox="0 0 100 100" style={{ width: '80%', height: '80%', position: 'absolute', top: '10%', left: '10%', fill: splat.color, opacity: 0.8 }}>
                            <path d={splat.path} />
                        </svg>
                    </div>
                ))}
            </div>

            {/* Heavy Paper Texture Overlay */}
            <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-multiply" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}></div>
        </div>
    );
}
