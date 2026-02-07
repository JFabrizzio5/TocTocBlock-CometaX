import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';


export async function POST(req: NextRequest) {
    try {
        const { projectPath, type, moduleName, pattern = 'repository' } = await req.json();

        if (!projectPath || !type || !moduleName) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const cleanName = moduleName.trim().replace(/\s+/g, '');
        const capitalizedName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
        const lowerName = cleanName.toLowerCase();

        if (type === 'laravel') {
            await scaffoldLaravel(projectPath, capitalizedName, lowerName, pattern);
        } else if (type === 'fastapi') {
            await scaffoldFastAPI(projectPath, capitalizedName, lowerName, pattern);
        } else {
            return NextResponse.json({ error: 'Invalid project type' }, { status: 400 });
        }

        return NextResponse.json({ success: true, message: `Module ${capitalizedName} (${pattern}) created successfully.` });

    } catch (error: any) {
        console.error("Scaffold Error", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

async function scaffoldLaravel(projectPath: string, moduleName: string, lowerName: string, pattern: string) {
    // Helper to ensure dir exists
    const ensureDir = async (p: string) => {
        try {
            await fs.mkdir(p, { recursive: true });
        } catch (e) { }
    };

    const writeFile = async (p: string, content: string) => await fs.writeFile(p, content, 'utf8');

    // Paths
    const appPath = path.join(projectPath, 'app');
    const paths = {
        Controllers: path.join(appPath, 'Http/Controllers', moduleName),
        Models: path.join(appPath, 'Models', moduleName),
        Repositories: path.join(appPath, 'Repositories', moduleName),
        Requests: path.join(appPath, 'Http/Requests', moduleName),
        Routes: path.join(projectPath, 'routes', moduleName)
    };

    // Always create Model directory
    await ensureDir(paths.Models);

    // 2. Model
    const modelContent = `<?php

namespace App\\Models\\${moduleName};

use Illuminate\\Database\\Eloquent\\Model;

class ${moduleName} extends Model
{
    protected $table = '${lowerName}';
}`;
    await writeFile(path.join(paths.Models, `${moduleName}.php`), modelContent);

    if (pattern === 'minimal') return;

    // Create other directories if not minimal
    if (pattern === 'repository' || pattern === 'resource') {
        await ensureDir(paths.Controllers);
        await ensureDir(paths.Requests);
        await ensureDir(paths.Routes);
    }
    if (pattern === 'repository') {
        await ensureDir(paths.Repositories);
    }

    // 1. Controller
    const controllerContent = `<?php

namespace App\\Http\\Controllers\\${moduleName};

use App\\Http\\Controllers\\Controller;

class ${moduleName}Controller extends Controller
{
    public function index()
    {
        return response()->json('Welcome to ${moduleName} (${pattern})');
    }
}`;
    await writeFile(path.join(paths.Controllers, `${moduleName}Controller.php`), controllerContent);

    // 3. Repository (Only for repository pattern)
    if (pattern === 'repository') {
        const repoContent = `<?php

namespace App\\Repositories\\${moduleName};

class ${moduleName}Repository
{
    public function all()
    {
        return [];
    }
}`;
        await writeFile(path.join(paths.Repositories, `${moduleName}Repository.php`), repoContent);
    }

    // 4. Request
    const requestContent = `<?php

namespace App\\Http\\Requests\\${moduleName};

use Illuminate\\Foundation\\Http\\FormRequest;

class ${moduleName}Validations extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'rfc' => 'required|string|max:13',
            'password' => 'required|string|min:8',
        ];
    }

    public function messages()
    {
        return [
            'rfc.required' => 'El RFC es obligatorio.',
            'password.required' => 'La contraseña es obligatoria.',
        ];
    }
}`;
    await writeFile(path.join(paths.Requests, `${moduleName}Validations.php`), requestContent);

    // 5. Routes
    const routeContent = `<?php

use Illuminate\\Support\\Facades\\Route;
use App\\Http\\Controllers\\${moduleName}\\${moduleName}Controller;

Route::prefix('${lowerName}')->group(function () {
    Route::get('/', [${moduleName}Controller::class, 'index']);
});`;
    await writeFile(path.join(paths.Routes, 'api.php'), routeContent);
}

async function scaffoldFastAPI(projectPath: string, moduleName: string, lowerName: string, pattern: string) {
    const ensureDir = async (p: string) => {
        try {
            await fs.mkdir(p, { recursive: true });
        } catch (e) { }
    };

    const writeFile = async (p: string, content: string) => await fs.writeFile(p, content, 'utf8');

    const moduleDirName = moduleName;
    const moduleFullPath = path.join(projectPath, moduleDirName);

    if (await fs.stat(moduleFullPath).then(() => true).catch(() => false)) {
        throw new Error(`Module ${moduleDirName} already exists.`);
    }

    await ensureDir(moduleFullPath);

    const subfolders = ["models"]; // Always needed
    if (pattern !== 'minimal') {
        subfolders.push("api");
        subfolders.push("validations");
        subfolders.push("services");
        if (pattern === 'repository') {
            subfolders.push("repositories");
        }
    }

    for (const sub of subfolders) {
        const subPath = path.join(moduleFullPath, sub);
        await ensureDir(subPath);

        // __init__.py with imports
        let initContent = "";
        // Only generate imports if we actually generated the files
        if (sub === "validations" && pattern !== 'minimal') {
            initContent = `from .user_validation import validate_user_data\nfrom .email_validation import validate_email_format\n`;
        } else if (sub === "repositories" && pattern === 'repository') {
            initContent = `from .main_users_repository import create_user\n`;
        } else if (sub === "services" && pattern !== 'minimal') {
            // In resource pattern, service might talk directly to DB or simple logic
            // For now, we reuse service layer even in resource
            initContent = `from .main_user_service import register_user\n`;
        } else if (sub === "models") {
            initContent = `from .user_models import UserCreateRequest, UserResponse\n`;
        }
        await writeFile(path.join(subPath, "__init__.py"), initContent);
    }

    // Root __init__.py
    await writeFile(path.join(moduleFullPath, "__init__.py"), "");

    // 5. Models (Always)
    const modelsContent = `# Ruta: ${moduleDirName}/models/user_models.py

from pydantic import BaseModel

class UserCreateRequest(BaseModel):
    name: str
    email: str
    age: int

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    age: int
`;
    await writeFile(path.join(moduleFullPath, "models", "user_models.py"), modelsContent);

    if (pattern === 'minimal') return;

    // 1. Routes
    const routesContent = `# Ruta: ${moduleDirName}/api/routes.py

from fastapi import APIRouter
from ${moduleDirName}.models.user_models import UserCreateRequest
from ${moduleDirName}.services.main_user_service import register_user
from ${moduleDirName}.validations import validate_user_data, validate_email_format

router = APIRouter()

@router.post("/create")
async def create_user_endpoint(user: UserCreateRequest):
    await validate_user_data(user)
    await validate_email_format(user)
    user_data = await register_user(user)
    return user_data    

@router.get("/hola")
async def hello_user():
    return {"message": "Hola, mundo! Pattern: ${pattern}"}
`;
    await writeFile(path.join(moduleFullPath, "api", "routes.py"), routesContent);

    // 2. Repository (Only for repository)
    if (pattern === 'repository') {
        const repoContent = `# Ruta: ${moduleDirName}/repositories/main_users_repository.py

# Placeholder config import
try:
    from config import get_database, logger
except ImportError:
    # Dummy mocks if config doesn't exist yet
    def get_database(name): return None
    class Logger:
        def info(self, msg): print(msg)
    logger = Logger();

from ${moduleDirName}.models.user_models import UserCreateRequest
# from motor.motor_asyncio import AsyncIOMotorCollection

async def get_users_collection():
    db = get_database("${lowerName}_db")
    if db:
        collection = db.get_collection("${lowerName}_users")
        return collection
    return None

async def create_user(user: UserCreateRequest):
    collection = await get_users_collection()
    logger.info("Se creó el usuario.")
    # result = await collection.insert_one(user.dict())
    # return str(result.inserted_id)
    return "dummy-id"
`;
        await writeFile(path.join(moduleFullPath, "repositories", "main_users_repository.py"), repoContent);
    }

    // 3. Service
    // If resource pattern, service might just do logic without repo, but for simplicity we keep structure
    // We adjust import if repo doesn't exist?
    let serviceContent = "";
    if (pattern === 'repository') {
        serviceContent = `# Ruta: ${moduleDirName}/services/main_user_service.py

from ${moduleDirName}.repositories.main_users_repository import create_user
from ${moduleDirName}.models.user_models import UserCreateRequest

async def register_user(user_data: UserCreateRequest):
    user_id = await create_user(user_data)
    return user_id
`;
    } else {
        // Resource pattern - no repo
        serviceContent = `# Ruta: ${moduleDirName}/services/main_user_service.py

from ${moduleDirName}.models.user_models import UserCreateRequest

async def register_user(user_data: UserCreateRequest):
    # Direct logic or DB call here
    print("Registering user without repository layer")
    return "dummy-id-resource"
`;
    }

    await writeFile(path.join(moduleFullPath, "services", "main_user_service.py"), serviceContent);

    // 4. Validations
    const emailValContent = `# Ruta: ${moduleDirName}/validations/email_validation.py

from fastapi import HTTPException
from ${moduleDirName}.models.user_models import UserCreateRequest

async def validate_email_format(user: UserCreateRequest):
    if "@" not in user.email:
        raise HTTPException(status_code=400, detail="Invalid email format")
    return user
`;
    await writeFile(path.join(moduleFullPath, "validations", "email_validation.py"), emailValContent);

    const userValContent = `# Ruta: ${moduleDirName}/validations/user_validation.py

from fastapi import HTTPException
from ${moduleDirName}.models.user_models import UserCreateRequest

async def validate_user_data(user: UserCreateRequest):
    if not user.name:
        raise HTTPException(status_code=400, detail="Name is required")
    if "juan" in user.name.lower():
        raise HTTPException(status_code=400, detail="Name cannot contain 'Juan'")
    return user
`;
    await writeFile(path.join(moduleFullPath, "validations", "user_validation.py"), userValContent);

    // 6. Update main.py
    const mainPyPath = path.join(projectPath, "main.py");
    // Append to main.py
    const importLine = `\nfrom ${moduleDirName}.api.routes import router as ${lowerName}_router`;
    const includeLine = `\napp.include_router(${lowerName}_router, prefix='/${lowerName}/v1', tags=['${lowerName}'])`;

    try {
        await fs.appendFile(mainPyPath, importLine + includeLine);
    } catch {
        // If main.py doesn't exist, maybe create it? 
        // We'll skip for now as per "update_main_py" logic assuming it exists.
    }
}
