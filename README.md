# AI Resume Screening & Smart Hiring Platform

## Quick Start

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
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
- AI-powered resume screening
- Automatic candidate shortlisting
- Email & WhatsApp notifications
- Student & Company dashboards
- JWT Authentication

## Tech Stack
- **Frontend:** React, Tailwind CSS, Framer Motion
- **Backend:** Django, DRF, PostgreSQL
- **AI:** OpenAI/Gemini API
- **Notifications:** Email (SMTP), WhatsApp (Twilio)

## Environment Variables
See `.env.example` in backend folder