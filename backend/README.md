# Backend — Django API

This folder contains the Django backend (REST API) for the ClientX project.

Quick start (Windows / PowerShell):

1. Create and activate a virtual environment:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

2. Install dependencies:

```powershell
pip install -r requirements_minimal.txt
```

3. Prepare the database and run migrations:

```powershell
python manage.py migrate
```

4. (Optional) Create a superuser:

```powershell
python manage.py createsuperuser
```

5. Run the development server:

```powershell
python manage.py runserver
```

Notes:

- The project uses SQLite by default (`db.sqlite3` in the `backend/` folder).
- Example credentials and sample data may be available in `login.json` and `register.json` — check them before seeding real data.
- For production deployments follow standard Django deployment guides (use environment variables for secrets, configure allowed hosts, use a production-ready DB and WSGI server).

See the global overview: [../GLOBAL_README.md](../GLOBAL_README.md)
