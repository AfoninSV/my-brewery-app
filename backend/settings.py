from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
TEMPLATE_DIR = BASE_DIR / "frontend" / "build"
STATIC_DIR = BASE_DIR / "frontend" / "build" / "static"
DB_URI = f"sqlite:///{BASE_DIR.absolute()}/database.sqlite"
