import { NextRequest, NextResponse } from 'next/server';
import { removeProject, getProject } from '@/lib/projects-db';

export async function DELETE(
    req: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    const id = params.id;
    await removeProject(id);
    return NextResponse.json({ success: true });
}

export async function GET(
    req: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    const id = params.id;
    const project = await getProject(id);
    if (!project) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    return NextResponse.json(project);
}
