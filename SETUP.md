# AI Hiring Platform - Backend

## Start Backend
```bash
cd C:\Users\varun\Documents\AI-Hiring-Platform\backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

## API Endpoints
- POST /api/auth/signup/ - Register
- POST /api/auth/login/ - Login
- GET /api/auth/me/ - Current User
- POST /api/jobs/ - Create Job (Company)
- GET /api/jobs/ - List Jobs
- POST /api/applications/ - Apply (Student)
- GET /api/applications/ - View Applications (Company)
- POST /api/resume/analyze/ - AI Resume Analysis

## Frontend
```bash
cd C:\Users\varun\Documents\AI-Hiring-Platform\frontend
npm install
npm run dev
```

## Required Environment Variables
Create `backend/.env`:
```
SECRET_KEY=your-secret-key
DEBUG=True
DB_NAME=ai_hiring
DB_USER=postgres
DB_PASSWORD=yourpassword
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
OPENAI_API_KEY=your-key
TWILIO_ACCOUNT_SID=your-sid
TWILIO_AUTH_TOKEN=your-token
```

This gives you a complete hiring platform foundation. I'll continue building the full frontend and all features. Want me to proceed with the complete React frontend now?