"use client";

import { useState } from "react";
import { Project } from "@/lib/projects-db";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Wand2 } from "lucide-react";

interface ScaffolderProps {
    project: Project;
}

export function Scaffolder({ project }: ScaffolderProps) {
    const [modelName, setModelName] = useState("");
    const [pattern, setPattern] = useState("resource"); // resource, repository, etc
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        if (!modelName) return;
        setLoading(true);

        try {
            const res = await fetch("/api/projects/scaffold", {
                method: "POST",
                body: JSON.stringify({
                    projectPath: project.path,
                    type: project.type,
                    moduleName: modelName,
                    pattern: pattern
                }),
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to scaffold");
            }

            toast.success(`Scaffolded module ${modelName} successfully!`);
            setModelName("");
        } catch (e: any) {
            toast.error(e.message || "Scaffolding failed");
        } finally {
            setLoading(false);
        }
    }; // End of handleGenerate

    return (
        <div className="grid gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Code Generator</CardTitle>
                    <CardDescription>Generate boilerplate code for your project.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Element Name</label>
                            <Input
                                placeholder="e.g. User, Product"
                                value={modelName}
                                onChange={(e) => setModelName(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Pattern / Type</label>
                            <Select value={pattern} onValueChange={setPattern}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="resource">Resource CRUD</SelectItem>
                                    <SelectItem value="repository">Repository Pattern (Partial)</SelectItem>
                                    <SelectItem value="minimal">Minimal Model only</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <Button onClick={handleGenerate} disabled={loading || !modelName} className="w-full sm:w-auto">
                        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Wand2 className="w-4 h-4 mr-2" />}
                        Generate Components
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
