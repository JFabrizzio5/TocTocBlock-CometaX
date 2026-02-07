import { NextRequest, NextResponse } from 'next/server';
import { getProjects, addProject, Project } from '@/lib/projects-db';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
    const projects = await getProjects();
    return NextResponse.json(projects);
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, path, type, description } = body;

        if (!name || !path || !type) {
            return NextResponse.json(
                { error: 'Name, path, and type are required' },
                { status: 400 }
            );
        }

        const newProject: Project = {
            id: uuidv4(),
            name,
            path,
            type,
            description,
            createdAt: new Date().toISOString(),
        };

        await addProject(newProject);
        return NextResponse.json(newProject, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
