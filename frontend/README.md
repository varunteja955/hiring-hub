# AI Hiring Platform

![React](https://img.shields.io/badge/React-18-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-3-blue)
![License](https://img.shields.io/badge/License-MIT-green)

AI-Powered Hiring Platform - Smart resume screening and candidate matching.

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.9+
- PostgreSQL

### Backend Setup
```bash
cd backend
python -m venv venv
# Windows: venv\Scripts\activate
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Features
- 🎯 AI Resume Screening
- 👥 Student & Company Dashboards
- 📧 Email Notifications  
- 💬 WhatsApp Alerts
- 📊 Analytics
- 🔒 JWT Authentication

## Tech Stack
- **Frontend:** React, Tailwind CSS, Framer Motion
- **Backend:** Django, DRF, PostgreSQL
- **AI:** OpenAI, NLP

## Environment Variables

### Backend (.env)
```
SECRET_KEY=your-secret-key
DEBUG=True
DB_NAME=ai_hiring
DB_USER=postgres
DB_PASSWORD=password
EMAIL_HOST_USER=your@gmail.com
EMAIL_HOST_PASSWORD=app-password
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:8000/api
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|------------|
| POST | /api/auth/signup/ | Register user |
| POST | /api/auth/login/ | Login |
| GET | /api/auth/profile/ | Get profile |
| GET | /api/jobs/ | List jobs |
| POST | /api/jobs/ | Create job |
| POST | /api/resume/apply/ | Apply to job |
| GET | /api/resume/my/ | My applications |
| POST | /api/resume/analyze/ | Analyze resume |

## License
MIT
