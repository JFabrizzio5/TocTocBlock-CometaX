"use client";

import { useEffect, useState } from "react";
import { Project } from "@/lib/projects-db";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, RefreshCw, Trash2, Search, Package } from "lucide-react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ExtensionsManagerProps {
    project: Project;
}

export function ExtensionsManager({ project }: ExtensionsManagerProps) {
    const [packages, setPackages] = useState<{ name: string; version: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const [installing, setInstalling] = useState(false); // For adding
    const [packageName, setPackageName] = useState("");

    const fetchPackages = async () => {
        setLoading(true);
        try {
            let cmd = "";
            if (project.type === "laravel") {
                cmd = `type composer.json`; // Windows 'cat'
            } else {
                // Checking pip freeze is more accurate for installed
                // Adjust for OS, but assuming Windows based on user info
                cmd = `venv\\Scripts\\pip freeze`;
            }

            const res = await fetch("/api/exec", {
                method: "POST",
                body: JSON.stringify({ command: cmd, cwd: project.path }),
            });
            const data = await res.json();

            if (project.type === "laravel") {
                try {
                    const json = JSON.parse(data.stdout);
                    const require = json.require || {};
                    const devRequire = json['require-dev'] || {};
                    const all = { ...require, ...devRequire };
                    const mapped = Object.entries(all).map(([k, v]) => ({ name: k, version: String(v) }));
                    setPackages(mapped);
                } catch {
                    toast.error("Failed to parse composer.json");
                }
            } else {
                // Parse pip freeze output: package==version
                const lines = (data.stdout as string).split("\n").filter(Boolean);
                const mapped = lines.map(line => {
                    const [name, version] = line.split("==");
                    return { name: name || line, version: version || "latest" };
                });
                setPackages(mapped);
            }

        } catch (e) {
            console.error(e);
            toast.error("Failed to list packages");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPackages();
    }, [project]);

    const handleInstall = async () => {
        if (!packageName) return;
        setInstalling(true);
        toast.info(`Installing ${packageName}...`);

        try {
            let cmd = "";
            if (project.type === "laravel") {
                cmd = `composer require ${packageName}`;
            } else {
                cmd = `venv\\Scripts\\pip install ${packageName}`;
            }

            const res = await fetch("/api/exec", {
                method: "POST",
                body: JSON.stringify({ command: cmd, cwd: project.path }),
            });
            const data = await res.json();

            if (!res.ok || (data.stderr && data.stderr.includes("error"))) {
                // Note: composer outputs to stderr sometimes even on success, so we check status if possible, 
                // but api/exec returns stdout/stderr. 
                // Better to rely on res.ok unless api/exec throws on non-zero exit code?
                // api/exec in previous step doesn't check exit code explicitly beyond try/catch, 
                // but child_process execution error triggers catch.
                // If command fails (exit code != 0), it goes to catch block in API route.
            }

            toast.success(`Installed ${packageName}`);
            setPackageName("");
            fetchPackages();
        } catch (e) {
            toast.error("Installation failed");
        } finally {
            setInstalling(false);
        }
    };

    const handleUninstall = async (name: string) => {
        // Implement uninstall logic similar to install
        // composer remove / pip uninstall -y
        toast.info(`Uninstalling ${name}...`);
        try {
            let cmd = "";
            if (project.type === "laravel") {
                cmd = `composer remove ${name}`;
            } else {
                cmd = `venv\\Scripts\\pip uninstall -y ${name}`;
            }
            await fetch("/api/exec", {
                method: "POST",
                body: JSON.stringify({ command: cmd, cwd: project.path }),
            });
            toast.success(`Uninstalled ${name}`);
            fetchPackages();
        } catch {
            toast.error("Uninstall failed");
        }
    };

    return (
        <div className="grid gap-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="space-y-1">
                        <CardTitle>Package Management</CardTitle>
                        <CardDescription>
                            Running on {project.type === "laravel" ? "Composer" : "Pip (venv)"}
                        </CardDescription>
                    </div>
                    <Button variant="ghost" size="icon" onClick={fetchPackages} disabled={loading}>
                        <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-2 mb-6">
                        <div className="relative flex-1">
                            <Package className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder={project.type === "laravel" ? "e.g. laravel/telescope" : "e.g. pandas"}
                                className="pl-9"
                                value={packageName}
                                onChange={(e) => setPackageName(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleInstall()}
                            />
                        </div>
                        <Button onClick={handleInstall} disabled={installing || !packageName}>
                            {installing ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                            Install
                        </Button>
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Package</TableHead>
                                    <TableHead>Version</TableHead>
                                    <TableHead className="w-[100px]">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {packages.length === 0 && !loading ? (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                                            No packages found (or unable to read).
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    packages.map((pkg) => (
                                        <TableRow key={pkg.name}>
                                            <TableCell className="font-medium">{pkg.name}</TableCell>
                                            <TableCell>{pkg.version}</TableCell>
                                            <TableCell>
                                                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive/90" onClick={() => handleUninstall(pkg.name)}>
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
