import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import util from 'util';

const execAsync = util.promisify(exec);

export async function POST(req: NextRequest) {
    try {
        const { command, cwd } = await req.json();

        if (!command) {
            return NextResponse.json({ error: 'Command is required' }, { status: 400 });
        }

        // SECURITY WARNING: This allows arbitrary command execution.
        // Intended for local tool use only.
        const { stdout, stderr } = await execAsync(command, { cwd: cwd || process.cwd() });

        return NextResponse.json({ stdout, stderr });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message, stderr: error.stderr, stdout: error.stdout },
            { status: 500 }
        );
    }
}
