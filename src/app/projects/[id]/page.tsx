"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Project } from "@/lib/projects-db";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Box, Code2, Settings, Terminal } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExtensionsManager } from "@/components/extensions-manager";
import { Scaffolder } from "@/components/scaffolder";

export default function ProjectPage() {
    const { id } = useParams();
    const router = useRouter();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetch(`/api/projects/${id}`)
                .then((res) => {
                    if (!res.ok) throw new Error("Not found");
                    return res.json();
                })
                .then(setProject)
                .catch(() => router.push("/dashboard")) // Redirect if not found
                .finally(() => setLoading(false));
        }
    }, [id, router]);

    if (loading) return <div className="flex justify-center items-center font-mono h-screen text-muted-foreground">Loading Project Forge...</div>;
    if (!project) return null;

    return (
        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-background">
            {/* Header */}
            <header className="border-b border-border/40 p-4 flex items-center gap-4 bg-sidebar/30 backdrop-blur-md">
                <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h1 className="text-xl font-bold flex items-center gap-2">
                        {project.name}
                        <span className="text-xs px-2 py-0.5 rounded-full bg-sidebar-primary/10 text-sidebar-primary uppercase tracking-widest border border-sidebar-primary/20">{project.type}</span>
                    </h1>
                    <p className="text-xs text-muted-foreground font-mono">{project.path}</p>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-hidden flex flex-col p-6">
                <Tabs defaultValue="extensions" className="flex-1 flex flex-col overflow-hidden">
                    <TabsList className="w-full justify-start border-b border-border/40 rounded-none bg-transparent p-0 mb-6 space-x-6">
                        <TabsTrigger value="extensions" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2 text-muted-foreground data-[state=active]:text-foreground transition-all">
                            <Box className="w-4 h-4 mr-2" /> Extensions
                        </TabsTrigger>
                        <TabsTrigger value="generator" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2 text-muted-foreground data-[state=active]:text-foreground transition-all">
                            <Code2 className="w-4 h-4 mr-2" /> Generator (Scaffold)
                        </TabsTrigger>
                        <TabsTrigger value="terminal" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2 text-muted-foreground data-[state=active]:text-foreground transition-all">
                            <Terminal className="w-4 h-4 mr-2" /> Console
                        </TabsTrigger>
                        <TabsTrigger value="settings" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2 text-muted-foreground data-[state=active]:text-foreground transition-all">
                            <Settings className="w-4 h-4 mr-2" /> Settings
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="extensions" className="flex-1 overflow-auto">
                        <ExtensionsManager project={project} />
                    </TabsContent>

                    <TabsContent value="generator" className="flex-1 overflow-auto">
                        <Scaffolder project={project} />
                    </TabsContent>

                    <TabsContent value="terminal" className="flex-1 overflow-auto">
                        <div className="h-full bg-black border border-border/40 rounded-lg p-4 font-mono text-sm text-green-400">
                            user@forge:{project.path}$ _
                        </div>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
}
