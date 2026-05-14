from rest_framework import serializers
from jobs.models import Application

class ApplicationSerializer(serializers.ModelSerializer):
    candidate_name = serializers.SerializerMethodField()
    job_title = serializers.SerializerMethodField()
    company_name = serializers.SerializerMethodField()
    job_id = serializers.SerializerMethodField()

    class Meta:
        model = Application
        fields = ['id', 'job', 'job_id', 'job_title', 'company_name', 'candidate', 'candidate_name',
                  'resume', 'cover_letter', 'match_score', 'ats_score', 'status',
                  'ai_notes', 'interview_date', 'rejection_reason', 'applied_at']
        read_only_fields = ['id', 'applied_at']

    def get_candidate_name(self, obj):
        if obj.candidate:
            return f"{obj.candidate.first_name} {obj.candidate.last_name}"
        return "Unknown"

    def get_job_title(self, obj):
        return obj.job.title if obj.job else "Unknown"

    def get_job_id(self, obj):
        return obj.job.id if obj.job else None

    def get_company_name(self, obj):
        return obj.job.company.company_name if obj.job and obj.job.company else "Unknown"