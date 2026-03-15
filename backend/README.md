# GiftByte Backend

Minimal notes for setting up and running the FastAPI backend in an isolated virtual environment (venv).

## 1. Create and activate a virtualenv (Git Bash on Windows)

From the `backend` directory:

```bash
cd backend

# create venv (Python 3.11 recommended)
python -m venv .venv

# activate it in Git Bash
source .venv/Scripts/activate
```

You should now see something like `(.venv)` at the start of your shell prompt.

## 2. Install dependencies

With the venv **activated** and still in the `backend` folder:

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

The `requirements.txt` file pins password hashing dependencies (`passlib[bcrypt]` and `bcrypt`) to safe, tested versions so auth works reliably and consistently across machines.

## 3. Run the backend

With the venv still active:

```bash
uvicorn app.main:app --reload
```

The API will be available (by default) at:

- `http://localhost:8000/`
- `http://localhost:8000/docs` (interactive Swagger UI)

Always make sure the virtual environment is activated before running any backend commands so you don't accidentally use a global Python interpreter.

