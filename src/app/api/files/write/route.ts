
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
    try {
        const { filePath, content } = await req.json();

        if (!filePath || content === undefined) {
            return NextResponse.json({ error: 'Missing path or content' }, { status: 400 });
        }

        // Security check: Ensure we are not writing outside of allowed directories if needed. 
        // For this local dev tool, we assume the user has control, but let's be sanity checking it's an absolute path or relative to something known.
        // We will trust the absolute path for now as this is a local tool.

        const dir = path.dirname(filePath);
        await fs.mkdir(dir, { recursive: true });
        await fs.writeFile(filePath, content, 'utf-8');

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
