# Task Management App

Django REST Framework backend + Angular frontend, MySQL 5.6 database.

## Requirements

- Python 3.11
- MySQL 5.6 (Django 3.2 LTS is used because it is the last Django version that supports MySQL 5.6)
- Node 22 LTS (for the Angular frontend)

## Backend setup

```
cd backend
py -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

Copy `.env.example` to `.env` and fill in the database credentials, then:

```
py manage.py migrate
py manage.py createsuperuser
py manage.py runserver
```

Admin site: http://127.0.0.1:8000/admin/

## Frontend setup

Angular 22 with Angular Material. Requires Node 22.22+ (or 24.15+).

```
cd frontend
npm install
npm start
```

Open http://localhost:4200 (the backend must be running on port 8000).
The API URL is set in `frontend/src/environments/environment.ts`.
