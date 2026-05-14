import uuid
from django.db import models
from django.conf import settings

class Job(models.Model):
    company = models.ForeignKey(
        'accounts.CompanyProfile',
        on_delete=models.CASCADE,
        related_name='job_listings'
    )
    title = models.CharField(max_length=255)
    description = models.TextField()

    required_skills = models.JSONField(default=list, blank=True)

    EXPERIENCE_CHOICES = [('Entry', 'Entry'), ('Mid', 'Mid'), ('Senior', 'Senior')]
    JOB_TYPE_CHOICES = [('Full-time', 'Full-time'), ('Part-time', 'Part-time'), ('Contract', 'Contract')]
    WORK_MODE_CHOICES = [('Remote', 'Remote'), ('On-site', 'On-site'), ('Hybrid', 'Hybrid')]

    experience_required = models.CharField(max_length=20, choices=EXPERIENCE_CHOICES, default='Mid')
    job_type = models.CharField(max_length=20, choices=JOB_TYPE_CHOICES, default='Full-time')
    work_mode = models.CharField(max_length=20, choices=WORK_MODE_CHOICES, default='On-site')

    location = models.CharField(max_length=255, blank=True)
    salary_min = models.IntegerField(null=True, blank=True)
    salary_max = models.IntegerField(null=True, blank=True)

    deadline = models.DateField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.company.company_name if self.company else 'No Company'}"


class Application(models.Model):
    STATUS_CHOICES = [('pending', 'Pending'), ('reviewed', 'Reviewed'), ('shortlisted', 'Shortlisted'), ('rejected', 'Rejected'), ('interview', 'Interview'), ('hired', 'Hired')]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    job = models.ForeignKey(Job, on_delete=models.CASCADE, null=True, blank=True)
    candidate = models.ForeignKey('accounts.StudentProfile', on_delete=models.CASCADE, related_name='applications')
    resume = models.FileField(upload_to='applications/resumes/', null=True, blank=True)
    cover_letter = models.TextField(blank=True)
    match_score = models.IntegerField(default=0)
    ats_score = models.IntegerField(default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    ai_notes = models.JSONField(default=list)
    interview_date = models.DateTimeField(null=True, blank=True)
    rejection_reason = models.TextField(blank=True)
    applied_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['job', 'candidate']

    def __str__(self):
        candidate_name = f"{self.candidate.first_name} {self.candidate.last_name}" if self.candidate else "Unknown"
        return f"{candidate_name} - {self.job.title if self.job else 'Unknown Job'}"