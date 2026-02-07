import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
    try {
        const { projectPath, type, moduleName } = await req.json();

        if (!projectPath || !type || !moduleName) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const cleanName = moduleName.trim().replace(/\s+/g, '');
        const capitalizedName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
        const lowerName = cleanName.toLowerCase();

        if (type === 'laravel') {
            await scaffoldLaravel(projectPath, capitalizedName, lowerName);
        } else if (type === 'fastapi') {
            await scaffoldFastAPI(projectPath, capitalizedName, lowerName);
        } else {
            return NextResponse.json({ error: 'Invalid project type' }, { status: 400 });
        }

        return NextResponse.json({ success: true, message: `Module ${capitalizedName} created successfully.` });

    } catch (error: any) {
        console.error("Scaffold Error", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

async function scaffoldLaravel(projectPath: string, moduleName: string, lowerName: string) {
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

    // Create Directories
    for (const p of Object.values(paths)) {
        await ensureDir(p);
    }

    // 1. Controller
    const controllerContent = `<?php

namespace App\\Http\\Controllers\\${moduleName};

use App\\Http\\Controllers\\Controller;

class ${moduleName}Controller extends Controller
{
    public function index()
    {
        return response()->json('Welcome to ${moduleName}');
    }
}`;
    await writeFile(path.join(paths.Controllers, `${moduleName}Controller.php`), controllerContent);

    // 2. Model
    const modelContent = `<?php

namespace App\\Models\\${moduleName};

use Illuminate\\Database\\Eloquent\\Model;

class ${moduleName} extends Model
{
    protected $table = '${lowerName}';
}`;
    await writeFile(path.join(paths.Models, `${moduleName}.php`), modelContent);

    // 3. Repository
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

async function scaffoldFastAPI(projectPath: string, moduleName: string, lowerName: string) {
    const ensureDir = async (p: string) => {
        try {
            await fs.mkdir(p, { recursive: true });
        } catch (e) { }
    };

    const writeFile = async (p: string, content: string) => await fs.writeFile(p, content, 'utf8');

    const modulePath = path.join(projectPath, lowerName); // Use lower case folder name as per python convention in the request? 
    // Wait, the request used `capitalize_and_clean_folder_name` which does TitleCase. 
    // And `os.path.join(base_folder, module_name_cleaned)`.
    // Let's match the user's python script logic: TitleCase for folder.
    const moduleDirName = moduleName;
    const moduleFullPath = path.join(projectPath, moduleDirName);

    if (await fs.stat(moduleFullPath).then(() => true).catch(() => false)) {
        throw new Error(`Module ${moduleDirName} already exists.`);
    }

    await ensureDir(moduleFullPath);

    const subfolders = ["api", "models", "repositories", "services", "validations", "exports", "utils"];
    for (const sub of subfolders) {
        const subPath = path.join(moduleFullPath, sub);
        await ensureDir(subPath);

        // __init__.py with imports
        let initContent = "";
        if (sub === "validations") {
            initContent = `from .user_validation import validate_user_data\nfrom .email_validation import validate_email_format\n`;
        } else if (sub === "repositories") {
            initContent = `from .main_users_repository import create_user\n`;
        } else if (sub === "services") {
            initContent = `from .main_user_service import register_user\n`;
        } else if (sub === "models") {
            initContent = `from .user_models import UserCreateRequest, UserResponse\n`;
        }
        await writeFile(path.join(subPath, "__init__.py"), initContent);
    }

    // Root __init__.py
    await writeFile(path.join(moduleFullPath, "__init__.py"), "");

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
    return {"message": "Hola, mundo!"}
`;
    await writeFile(path.join(moduleFullPath, "api", "routes.py"), routesContent);

    // 2. Repository
    const repoContent = `# Ruta: ${moduleDirName}/repositories/main_users_repository.py

# Placeholder config import
try:
    from config import get_database, logger
except ImportError:
    # Dummy mocks if config doesn't exist yet
    def get_database(name): return None
    class Logger:
        def info(self, msg): print(msg)
    logger = Logger()

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

    // 3. Service
    const serviceContent = `# Ruta: ${moduleDirName}/services/main_user_service.py

from ${moduleDirName}.repositories.main_users_repository import create_user
from ${moduleDirName}.models.user_models import UserCreateRequest

async def register_user(user_data: UserCreateRequest):
    user_id = await create_user(user_data)
    return user_id
`;
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

    // 5. Models
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
