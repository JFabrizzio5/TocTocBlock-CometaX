"use client";

import { useEffect, useState } from "react";
import { Project } from "@/lib/projects-db";
import { ProjectCard } from "./project-card";
import { toast } from "sonner";
import { CreateProjectDialog } from "./create-project-dialog";
import { Button } from "./ui/button";
import { Plus, Search, Folder, Terminal, Sparkles } from "lucide-react";
import { Input } from "./ui/input";

export function ProjectList() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const fetchProjects = async () => {
        try {
            const res = await fetch("/api/projects");
            const data = await res.json();
            setProjects(data);
        } catch (error) {
            toast.error("Failed to fetch projects");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleDelete = async (id: string) => {
        try {
            await fetch(`/api/projects/${id}`, { method: "DELETE" });
            setProjects(projects.filter((p) => p.id !== id));
            toast.success("Project deleted");
        } catch {
            toast.error("Failed to delete project");
        }
    };

    const filtered = projects.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    const runningCount = projects.filter(p => p.status === 'running').length;

    return (
        <div className="space-y-12 animate-in fade-in duration-700 pb-20">
            {/* Friendly Hero Section */}
            <div className="relative bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-border/50 overflow-hidden">
                <div className="relative z-10 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Ready to build something amazing?</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">
                        Hello, Creator!
                    </h1>
                    <p className="text-lg text-muted-foreground mb-8">
                        Manage your Laravel and FastAPI projects with ease.
                        Launch, scaffold, and deploy from one beautiful place.
                    </p>

                    <div className="flex flex-wrap gap-4">
                        <CreateProjectDialog
                            onCreated={fetchProjects}
                            trigger={
                                <Button size="lg" className="rounded-full px-8 text-base shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
                                    <Plus className="w-5 h-5 mr-2" /> New Project
                                </Button>
                            }
                        />
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                            <Input
                                placeholder="Search your projects..."
                                className="pl-12 h-12 rounded-full min-w-[300px] border-border/50 bg-background/50 focus:bg-white transition-all shadow-sm"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-primary/5 to-transparent rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                <div className="absolute bottom-0 left-20 w-64 h-64 bg-secondary/30 rounded-full blur-3xl pointer-events-none" />
            </div>

            {/* Stats Overview (Simplified) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-border/30 flex flex-col items-center justify-center text-center group hover:-translate-y-1 transition-transform">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-full mb-3 group-hover:bg-blue-100 transition-colors">
                        <Folder className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">{projects.length}</h3>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Projects</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-border/30 flex flex-col items-center justify-center text-center group hover:-translate-y-1 transition-transform">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-full mb-3 group-hover:bg-emerald-100 transition-colors">
                        <div className="w-6 h-6 flex items-center justify-center">
                            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.4)]" />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-emerald-600">{runningCount}</h3>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Active Now</p>
                </div>
                {/* Add more stats if needed */}
            </div>

            {/* Projects Grid */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold px-1">Your Workspace</h2>
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-48 rounded-3xl bg-muted/50 animate-pulse" />
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-border/50">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                            <Folder className="w-8 h-8 text-muted-foreground/50" />
                        </div>
                        <h3 className="text-lg font-bold">No projects found</h3>
                        <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                            It looks quiet here. Why not start your first master piece?
                        </p>
                        <CreateProjectDialog onCreated={fetchProjects} />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtered.map((p) => (
                            <ProjectCard key={p.id} project={p} onDelete={handleDelete} onUpdate={fetchProjects} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
