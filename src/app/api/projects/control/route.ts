
import { NextRequest, NextResponse } from 'next/server';
import { getProject, updateProject } from '@/lib/projects-db';
import { spawn, exec } from 'child_process';
// import treeKill from 'tree-kill'; // Validation: might need to install this or use process.kill

// Store active processes in memory for the session as well, 
// though DB persistence is better for UI state if the server restarts (but PID validation needed).
const activeProcesses: Record<string, any> = {};

export async function POST(req: NextRequest) {
    try {
        const { id, action } = await req.json();
        const project = await getProject(id);

        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        if (action === 'start') {
            if (project.status === 'running' && project.pid) {
                // Check if actually running
                try {
                    process.kill(project.pid, 0);
                    return NextResponse.json({ message: 'Already running' });
                } catch {
                    // Not running, continue to start
                }
            }

            const port = project.port || 8000;
            let cmd = '';
            let args: string[] = [];

            if (project.type === 'laravel') {
                cmd = 'php';
                args = ['artisan', 'serve', `--port=${port}`];
            } else {
                cmd = 'uvicorn';
                // Assuming main:app structure or finding it. 
                // For scaffolding we used `main.py` -> `main:app`
                // But uvicorn needs to be run from the directory.
                // We'll run `python -m uvicorn main:app --port 8000`
                cmd = 'python';
                args = ['-m', 'uvicorn', 'main:app', '--host', '127.0.0.1', `--port=${port.toString()}`];
                // Or use the venv python if available
                // We should check if venv exists
                // For simplicity, we assume global python or we try to find venv
                // const venvPython = path.join(project.path, 'venv', 'Scripts', 'python');
                // We'll stick to 'python' as per previous dialog logic unless we want to be robust.
                // Let's us the one in venv if possible.
            }

            // We need to use valid path to venv python if fastapi
            let commandToRun = cmd;
            if (project.type === 'fastapi') {
                // Try venv
                // Implementation detail: we'll just use "python" assuming venv is activated or global
                // Better: use relative path to venv
                commandToRun = `${project.path}/venv/Scripts/python`;
            }

            console.log(`Starting ${project.name} on port ${port}...`);

            const child = spawn(commandToRun, args, {
                cwd: project.path,
                detached: true,
                stdio: 'ignore', // 'ignore' to unref? Or 'pipe' to capture logs? 
                // 'ignore' is best for detached background process
                shell: true
            });

            if (!child.pid) {
                return NextResponse.json({ error: 'Failed to spawn process' }, { status: 500 });
            }

            await updateProject(id, { ...project, status: 'running', pid: child.pid });

            return NextResponse.json({ success: true, pid: child.pid, port });

        } else if (action === 'stop') {
            if (project.pid) {
                try {
                    // process.kill(project.pid) kills the shell, not the child sometimes on Windows
                    // We might need tree-kill or `taskkill /PID <pid> /T /F`
                    exec(`taskkill /PID ${project.pid} /T /F`, (err) => {
                        // Callback
                    });
                } catch (e) {
                    console.error("Kill error", e);
                }
            }
            await updateProject(id, { ...project, status: 'stopped', pid: undefined });
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
