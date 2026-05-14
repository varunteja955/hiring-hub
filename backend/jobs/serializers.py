from rest_framework import serializers
from .models import Job

class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = ['id', 'title', 'description', 'required_skills', 'experience_required',
                  'job_type', 'work_mode', 'salary_min', 'salary_max',
                  'location', 'deadline', 'is_active', 'is_featured']


class JobCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = ['title', 'description', 'required_skills', 'experience_required',
                  'job_type', 'work_mode', 'salary_min', 'salary_max',
                  'location', 'deadline']