import { ProjectList } from "@/components/project-list";
import { Hammer } from "lucide-react";

export default function Dashboard() {
    return (
        <div className="flex-1 flex flex-col p-8 space-y-8 bg-background/50">
            <header className="flex items-center gap-3 pb-8 border-b border-border/40">
                <div className="p-3 bg-primary/10 rounded-xl">
                    <Hammer className="w-8 h-8 text-primary" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">Project Forge</h1>
                    <p className="text-muted-foreground text-sm">Manage your web application portfolio.</p>
                </div>
            </header>

            <main className="flex-1">
                <ProjectList />
            </main>
        </div>
    );
}
