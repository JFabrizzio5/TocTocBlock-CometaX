"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Plus, Folder, Settings2, ArrowRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
// We'll avoid 'path' module in client component if possible or rely on string manip.

const formSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters."),
    parentPath: z.string().min(1, "Parent path is required."),
    type: z.enum(["laravel", "fastapi"]),
    port: z.coerce.number().min(1024).max(65535).default(8000),
    dbDriver: z.enum(["none", "mysql", "postgres", "sqlite", "redis"]).default("none"),
    includeTutorial: z.boolean().default(true),
});

interface CreateProjectDialogProps {
    onCreated: () => void;
    trigger?: React.ReactNode;
}

export function CreateProjectDialog({ onCreated, trigger }: CreateProjectDialogProps) {
    const [open, setOpen] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);
    const [isExecuting, setIsExecuting] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            name: "",
            parentPath: "d:/projects",
            type: "laravel",
            port: 8000,
            dbDriver: "none",
            includeTutorial: true,
        },
    });

    async function executeCommand(command: string, cwd?: string) {
        setLogs((prev) => [...prev, `> ${command}`]);
        const res = await fetch("/api/exec", {
            method: "POST",
            body: JSON.stringify({ command, cwd }),
        });
        const data = await res.json();
        if (data.stdout) setLogs((prev) => [...prev, data.stdout]);
        if (data.stderr) setLogs((prev) => [...prev, `ERR: ${data.stderr}`]); // Stderr is often just warnings
        if (!res.ok) throw new Error(data.error || data.stderr);
        return data;
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsExecuting(true);
        setLogs([]);
        const projectPath = `${values.parentPath}/${values.name}`.replace(/\\/g, "/");

        try {
            // 1. Create Directory ?? commands usually handle it.

            if (values.type === "laravel") {
                setLogs((prev) => [...prev, "🚀 Initializing Laravel Project..."]);
                // composer create-project laravel/laravel <path>
                // We use defaults (no cwd) so it runs in current process.cwd but targets the absolute path
                await executeCommand(`composer create-project laravel/laravel "${projectPath}" --prefer-dist`);
            } else {
                setLogs((prev) => [...prev, "🚀 Initializing FastAPI Project..."]);
                // 1. mkdir - use absolute path
                await executeCommand(`mkdir "${projectPath}"`);

                // 2. venv - run python from global path but target project path
                // Actually, to create venv IN the project, we can run: python -m venv "d:/path/to/project/venv"
                await executeCommand(`python -m venv "${projectPath}/venv"`);

                // 3. install
                // Use absolute path to pip in the new venv
                const pipPath = `${projectPath}/venv/Scripts/pip`;
                await executeCommand(`${pipPath} install fastapi uvicorn`);

                // 4. Create main.py
                let mainPyContent = "";
                if (values.includeTutorial) {
                    mainPyContent = `from fastapi import FastAPI\n\napp = FastAPI()\n\n@app.get('/')\ndef read_root():\n    return {'Hello': 'World'}`;
                } else {
                    mainPyContent = `from fastapi import FastAPI\n\napp = FastAPI()`;
                }

                if (values.dbDriver === "redis") {
                    mainPyContent += `\n\n# Redis Placeholder\n# import redis\n# r = redis.Redis(host='localhost', port=6379, db=0)`;
                } else if (values.dbDriver !== "none") {
                    mainPyContent += `\n\n# Database Setup (${values.dbDriver})\n# Configure your connection here`;
                }

                // Use new file write API
                setLogs((prev) => [...prev, `> Writing main.py...`]);
                await fetch("/api/files/write", {
                    method: "POST",
                    body: JSON.stringify({
                        filePath: `${projectPath}/main.py`,
                        content: mainPyContent,
                    }),
                });
            }

            setLogs((prev) => [...prev, "✅ Project Created on Disk. Registering in DB..."]);

            // Register in DB with new fields
            await fetch("/api/projects", {
                method: "POST",
                body: JSON.stringify({
                    name: values.name,
                    path: projectPath,
                    type: values.type,
                    description: "Created via Project Forge",
                    port: values.port,
                    dbDriver: values.dbDriver,
                }),
            });

            toast.success("Project created successfully!");
            setOpen(false);
            onCreated();
        } catch (error: any) {
            const errorMessage = error.message || "";
            if (errorMessage.includes("is not empty")) {
                toast.error("Error: Target directory is not empty."); // Simplified toast
                setLogs((prev) => [...prev, `❌ Error: Directory not empty.`]);
            } else {
                toast.error("Failed to create project");
                setLogs((prev) => [...prev, `❌ Error: ${errorMessage}`]);
            }
        } finally {
            setIsExecuting(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="default" className="rounded-full shadow-lg hover:shadow-xl transition-all bg-primary text-primary-foreground">
                        <Plus className="w-5 h-5 mr-2" />
                        New Project
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] bg-white rounded-3xl border-border/50 shadow-2xl">
                <DialogHeader className="space-y-3 pb-4 border-b border-border/50">
                    <DialogTitle className="text-2xl font-bold text-center text-foreground">
                        Let's Start Something New! 🚀
                    </DialogTitle>
                    <DialogDescription className="text-center text-muted-foreground text-base">
                        Configure your new project below. We'll handle the setup for you.
                    </DialogDescription>
                </DialogHeader>

                {!isExecuting ? (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-semibold text-foreground/80">Project Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="my-awesome-app" {...field} className="rounded-xl border-border/50 bg-muted/30 focus:bg-white transition-all" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="parentPath"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-semibold text-foreground/80">Location</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Folder className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                                                        <Input placeholder="D:/Projects" {...field} className="pl-10 rounded-xl border-border/50 bg-muted/30 focus:bg-white transition-all" />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="type"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-semibold text-foreground/80">Framework</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="rounded-xl border-border/50 bg-muted/30">
                                                            <SelectValue placeholder="Select framework" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent className="rounded-xl border-border/50">
                                                        <SelectItem value="laravel">
                                                            <div className="flex items-center gap-2">
                                                                <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-sm" /> Laravel
                                                            </div>
                                                        </SelectItem>
                                                        <SelectItem value="fastapi">
                                                            <div className="flex items-center gap-2">
                                                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm" /> FastAPI
                                                            </div>
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="port"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-semibold text-foreground/80">Port</FormLabel>
                                                <FormControl>
                                                    <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} className="rounded-xl border-border/50 bg-muted/30 font-mono text-sm" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="p-5 rounded-2xl bg-muted/30 border border-border/50 space-y-4">
                                    <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                                        <Settings2 className="w-4 h-4 text-primary" /> Advanced Configuration
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormField
                                            control={form.control}
                                            name="dbDriver"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs font-medium text-muted-foreground">Database Driver</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger className="h-9 text-xs rounded-lg border-border/50 bg-white">
                                                                <SelectValue placeholder="Select DB" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent className="rounded-xl">
                                                            <SelectItem value="none">None</SelectItem>
                                                            <SelectItem value="sqlite">SQLite</SelectItem>
                                                            <SelectItem value="mysql">MySQL</SelectItem>
                                                            <SelectItem value="postgres">PostgreSQL</SelectItem>
                                                            <SelectItem value="redis">Redis</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="includeTutorial"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-center justify-between rounded-lg bg-white p-3 border border-border/50">
                                                    <div className="space-y-0.5">
                                                        <FormLabel className="text-xs font-medium">Include Boilerplate</FormLabel>
                                                    </div>
                                                    <FormControl>
                                                        <Switch
                                                            checked={field.value}
                                                            onCheckedChange={field.onChange}
                                                            className="scale-75 origin-right data-[state=checked]:bg-primary"
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>

                            <DialogFooter>
                                <Button type="submit" className="w-full rounded-full bg-primary hover:bg-primary/90 text-white font-bold h-11 text-base shadow-lg shadow-primary/20 transition-all">
                                    Create Project <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                ) : (
                    <div className="space-y-4 pt-4">
                        <div className="flex flex-col items-center justify-center text-center p-6 space-y-3">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                <Loader2 className="w-6 h-6 text-primary animate-spin" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-foreground">Setting things up...</h3>
                                <p className="text-sm text-muted-foreground">
                                    Creating <strong>{form.getValues("name")}</strong> and installing dependencies.
                                </p>
                            </div>
                        </div>

                        <div className="bg-muted/30 p-4 rounded-2xl border border-border/50 font-mono text-xs h-[250px] overflow-y-auto">
                            {logs.length === 0 && <span className="text-muted-foreground/50 italic">Waiting for output...</span>}
                            {logs.map((log, i) => (
                                <div key={i} className="py-1 border-b border-border/10 last:border-0 text-foreground/80 break-words">
                                    {log.replace(/^> /, '→ ')}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
