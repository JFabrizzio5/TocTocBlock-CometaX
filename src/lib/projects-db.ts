import fs from 'fs/promises';
import path from 'path';
import os from 'os';

const DB_PATH = path.join(os.homedir(), '.project-forge-projects.json');

export type ProjectType = 'laravel' | 'fastapi';

export interface Project {
    id: string;
    name: string;
    path: string;
    type: ProjectType;
    createdAt: string;
    description?: string;
    port?: number;
    dbDriver?: string;
    status?: "running" | "stopped";
    pid?: number;
}

async function ensureDb() {
    try {
        await fs.access(DB_PATH);
    } catch {
        await fs.writeFile(DB_PATH, JSON.stringify([], null, 2));
    }
}

export async function getProjects(): Promise<Project[]> {
    await ensureDb();
    const data = await fs.readFile(DB_PATH, 'utf-8');
    try {
        return JSON.parse(data);
    } catch {
        return [];
    }
}

export async function addProject(project: Project): Promise<void> {
    const projects = await getProjects();
    projects.push(project);
    await fs.writeFile(DB_PATH, JSON.stringify(projects, null, 2));
}

export async function removeProject(id: string): Promise<void> {
    const projects = await getProjects();
    const filtered = projects.filter((p) => p.id !== id);
    await fs.writeFile(DB_PATH, JSON.stringify(filtered, null, 2));
}

export async function getProject(id: string): Promise<Project | undefined> {
    const projects = await getProjects();
    return projects.find((p) => p.id === id);
}

export async function updateProject(id: string, updates: Partial<Project>): Promise<void> {
    const projects = await getProjects();
    const index = projects.findIndex((p) => p.id === id);
    if (index !== -1) {
        projects[index] = { ...projects[index], ...updates };
        await fs.writeFile(DB_PATH, JSON.stringify(projects, null, 2));
    }
}
