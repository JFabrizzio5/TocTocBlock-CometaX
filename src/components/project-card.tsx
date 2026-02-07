"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Folder, Terminal, Trash2, ArrowRight, Play, Square, Loader2, Circle } from "lucide-react";
import { Project } from "@/lib/projects-db";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
    project: Project;
    onDelete: (id: string) => void;
    onUpdate?: () => void;
}

export function ProjectCard({ project, onDelete, onUpdate }: ProjectCardProps) {
    const router = useRouter();
    const [toggling, setToggling] = useState(false);

    const handleOpen = () => {
        router.push(`/projects/${project.id}`);
    };

    const handleToggle = async (e: React.MouseEvent) => {
        e.stopPropagation();
        setToggling(true);
        try {
            const action = project.status === "running" ? "stop" : "start";
            const res = await fetch("/api/projects/control", {
                method: "POST",
                body: JSON.stringify({ id: project.id, action }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            if (data.success) {
                toast.success(action === "start" ? "Project started" : "Project stopped");
                if (onUpdate) onUpdate();
            } else if (data.message) {
                toast.info(data.message);
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to toggle process");
        } finally {
            setToggling(false);
        }
    };

    const isRunning = project.status === "running";
    const isLaravel = project.type === 'laravel';

    return (
        <Card
            className="group relative overflow-hidden border-border/50 bg-white hover:border-primary/30 transition-all duration-300 rounded-3xl shadow-sm hover:shadow-md cursor-pointer"
            onClick={handleOpen}
        >
            <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div className="space-y-1">
                    <CardTitle className="text-xl font-bold flex items-center gap-2 group-hover:text-primary transition-colors text-foreground">
                        {project.name}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                        <Folder className="w-3.5 h-3.5" />
                        <span className="truncate max-w-[150px] opacity-70" title={project.path}>{project.path}</span>
                    </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                    <Badge variant="secondary" className={cn(
                        "rounded-full px-3 font-semibold",
                        isLaravel ? "bg-red-50 text-red-600 hover:bg-red-100" : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                    )}>
                        {project.type}
                    </Badge>
                    {project.pid && isRunning && (
                        <span className="text-[10px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                            PID: {project.pid}
                        </span>
                    )}
                </div>
            </CardHeader>

            <CardContent className="pb-4">
                {project.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px] mb-4">
                        {project.description}
                    </p>
                )}

                <div className="flex items-center justify-between mt-auto">
                    {project.port && (
                        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-full">
                            <Terminal className="w-3.5 h-3.5" />
                            <span>:{project.port}</span>
                        </div>
                    )}

                    <div className={cn(
                        "flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full transition-all",
                        isRunning ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"
                    )}>
                        <Circle className={cn("w-2.5 h-2.5 fill-current", isRunning && "animate-pulse")} />
                        {isRunning ? "Live" : "Stopped"}
                    </div>
                </div>
            </CardContent>

            <CardFooter className="pt-2 pb-6 flex gap-3">
                <Button
                    variant={isRunning ? "destructive" : "default"}
                    size="sm"
                    className={cn(
                        "rounded-full flex-1 font-semibold shadow-none transition-all",
                        isRunning ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200" : "bg-primary text-primary-foreground hover:bg-primary/90"
                    )}
                    onClick={handleToggle}
                    disabled={toggling}
                >
                    {toggling ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : isRunning ? (
                        <Square className="w-4 h-4 mr-2 fill-current" />
                    ) : (
                        <Play className="w-4 h-4 mr-2 fill-current" />
                    )}
                    {isRunning ? 'Stop Server' : 'Run Server'}
                </Button>

                <Button variant="outline" size="icon" className="rounded-full w-9 h-9 border-border/50 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 transition-colors" onClick={(e) => {
                    e.stopPropagation();
                    onDelete(project.id);
                }}>
                    <Trash2 className="w-4 h-4" />
                </Button>
            </CardFooter>
        </Card>
    );
}
