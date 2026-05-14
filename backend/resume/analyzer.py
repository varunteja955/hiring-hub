import re
import json
import pdfplumber
from docx import Document
from typing import Dict, List
from django.conf import settings


COMMON_SKILLS = [
    'python', 'java', 'javascript', 'c++', 'c#', 'php', 'ruby', 'go', 'rust', 'swift', 'kotlin',
    'react', 'angular', 'vue', 'node', 'django', 'flask', 'spring', 'express',
    'sql', 'mongodb', 'postgresql', 'mysql', 'redis', 'elasticsearch',
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'git',
    'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'nlp', 'computer vision',
    'html', 'css', 'javascript', 'typescript', 'rest api', 'graphql',
    'agile', 'scrum', 'jira', 'confluence',
    'data analysis', 'data science', 'analytics', 'tableau', 'power bi',
    'project management', 'leadership', 'communication', 'problem solving',
    'figma', 'photoshop', 'illustrator', 'ui/ux', 'wireframing',
    'linux', 'unix', 'bash', 'shell scripting',
    'ci/cd', 'devops', 'icloud',
    'excel', 'word', 'powerpoint', 'google docs',
    'spoken', 'written', 'presentation', 'teamwork'
]

TECH_KEYWORDS = [
    'developer', 'engineer', 'manager', 'lead', 'senior', 'junior', 'intern',
    'designer', 'analyst', 'consultant', 'architect', 'director',
    'frontend', 'backend', 'fullstack', 'full-stack', 'mobile', 'web',
    'cloud', 'security', 'network', 'database', 'devops', 'data',
    'ai', 'ml', 'ml', 'blockchain', 'iot'
]


class ResumeParser:
    def __init__(self):
        self.skills = COMMON_SKILLS
        self.tech_keywords = TECH_KEYWORDS
    
    def parse(self, file_path: str) -> Dict:
        ext = file_path.lower().split('.')[-1]
        
        if ext == 'pdf':
            return self._parse_pdf(file_path)
        elif ext in ['docx', 'doc']:
            return self._parse_docx(file_path)
        else:
            return {'error': 'Unsupported file format'}
    
    def _parse_pdf(self, file_path: str) -> Dict:
        text = ''
        try:
            with pdfplumber.open(file_path) as pdf:
                for page in pdf.pages:
                    text += page.extract_text() or ''
        except Exception as e:
            return {'error': f'PDF error: {str(e)}'}
        
        return self._analyze_text(text)
    
    def _parse_docx(self, file_path: str) -> Dict:
        text = ''
        try:
            doc = Document(file_path)
            for para in doc.paragraphs:
                text += para.text + '\n'
        except Exception as e:
            return {'error': f'DOCX error: {str(e)}'}
        
        return self._analyze_text(text)
    
    def _analyze_text(self, text: str) -> Dict:
        text_lower = text.lower()
        
        skills = self._extract_skills(text_lower)
        education = self._extract_education(text)
        experience = self._extract_experience(text)
        keywords = self._extract_keywords(text_lower)
        
        return {
            'text': text[:5000],
            'skills': skills,
            'education': education,
            'experience': experience,
            'keywords_found': keywords,
            'word_count': len(text.split())
        }
    
    def _extract_skills(self, text: str) -> List[str]:
        found_skills = []
        for skill in self.skills:
            if skill.lower() in text:
                found_skills.append(skill.title() if len(skill) > 3 else skill.upper())
        return list(set(found_skills))
    
    def _extract_education(self, text: str) -> List[Dict]:
        education = []
        degree_keywords = ['bachelor', 'master', 'phd', 'degree', 'diploma', 'certificate']
        
        lines = text.split('\n')
        for line in lines:
            line_lower = line.lower()
            if any(kw in line_lower for kw in degree_keywords):
                education.append({'institution': line.strip(), 'degree': line.strip()})
        
        return education[:5]
    
    def _extract_experience(self, text: str) -> List[Dict]:
        experience = []
        exp_keywords = ['experience', 'years', 'worked', 'job', 'role', 'position']
        
        lines = text.split('\n')
        for line in lines:
            line_lower = line.lower()
            if any(kw in line_lower for kw in exp_keywords) and len(line.strip()) > 10:
                experience.append({'title': line.strip()[:200]})
        
        return experience[:5]
    
    def _extract_keywords(self, text: str) -> List[str]:
        found = []
        for kw in self.tech_keywords:
            if kw in text:
                found.append(kw)
        return list(set(found))


class AIResumeAnalyzer:
    def __init__(self):
        self.parser = ResumeParser()
    
    def analyze_resume(self, file_path: str, job_requirements: Dict = None) -> Dict:
        parsed = self.parser.parse(file_path)
        
        if 'error' in parsed:
            return parsed
        
        skills = parsed.get('skills', [])
        ats_score = self._calculate_ats_score(parsed)
        
        result = {
            'extracted_skills': skills,
            'extracted_education': parsed.get('education', []),
            'extracted_experience': parsed.get('experience', []),
            'keywords_found': parsed.get('keywords_found', []),
            'ats_score': ats_score,
            'word_count': parsed.get('word_count', 0)
        }
        
        if job_requirements:
            required_skills = job_requirements.get('required_skills', [])
            match_result = self._match_with_job(skills, required_skills)
            result.update(match_result)
        
        return result
    
    def _calculate_ats_score(self, parsed: Dict) -> int:
        score = 50
        
        word_count = parsed.get('word_count', 0)
        if 300 < word_count < 1500:
            score += 20
        elif word_count >= 1500:
            score += 15
        
        skills = parsed.get('skills', [])
        score += min(len(skills) * 3, 20)
        
        keywords = parsed.get('keywords_found', [])
        score += min(len(keywords) * 2, 10)
        
        return min(score, 100)
    
    def _match_with_job(self, candidate_skills: List, required_skills: List) -> Dict:
        if not required_skills:
            return {'match_percentage': 0, 'missing_skills': []}
        
        required = [s.lower() for s in required_skills]
        candidate = [s.lower() for s in candidate_skills]
        
        matched = [s for s in required if s in candidate]
        missing = [s for s in required if s not in candidate]
        
        match_percentage = int(len(matched) / len(required) * 100) if required else 0
        
        ai_notes = []
        if match_percentage >= 70:
            ai_notes.append('Strong match! Candidate has most required skills.')
        elif match_percentage >= 40:
            ai_notes.append('Moderate match. Consider interviewing.')
        else:
            ai_notes.append('Consider for other positions.')
        
        if missing:
            ai_notes.append(f'Missing skills: {", ".join(missing[:3])}')
        
        return {
            'match_percentage': match_percentage,
            'matched_skills': matched,
            'missing_skills': missing,
            'ai_notes': ai_notes
        }


def analyze_resume(file_path: str, job_requirements: Dict = None) -> Dict:
    analyzer = AIResumeAnalyzer()
    return analyzer.analyze_resume(file_path, job_requirements)