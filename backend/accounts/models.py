import uuid
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils import timezone


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email is required')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = [('student', 'Student'), ('company', 'Company'), ('admin', 'Admin')]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='student')
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    class Meta:
        db_table = 'users'


class StudentProfile(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='student_profile')
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20, blank=True)
    location = models.CharField(max_length=200, blank=True)
    bio = models.TextField(blank=True)
    resume = models.FileField(upload_to='resumes/', null=True, blank=True)
    resume_score = models.IntegerField(default=0)
    skills = models.JSONField(default=list)
    education = models.JSONField(default=list)
    experience = models.JSONField(default=list)
    certifications = models.JSONField(default=list)
    portfolio_links = models.JSONField(default=list)
    github_url = models.URLField(blank=True)
    linkedin_url = models.URLField(blank=True)
    profile_completion = models.IntegerField(default=0)
    is_open_to_work = models.BooleanField(default=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"


class CompanyProfile(models.Model):
    COMPANY_ROLES = [('HR', 'HR'), ('Recruiter', 'Recruiter'), ('CEO', 'CEO'), ('Manager', 'Manager')]
    COMPANY_SIZE = [('1-10', '1-10'), ('11-50', '11-50'), ('51-200', '51-200'), ('201-500', '201-500'), ('500+', '500+')]
    INDUSTRY_CHOICES = [
        ('tech', 'Technology'), ('healthcare', 'Healthcare'), ('finance', 'Finance'),
        ('education', 'Education'), ('retail', 'Retail'), ('manufacturing', 'Manufacturing'),
        ('consulting', 'Consulting'), ('other', 'Other')
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='company_profile')
    company_name = models.CharField(max_length=200)
    company_role = models.CharField(max_length=20, choices=COMPANY_ROLES, default='HR')
    company_size = models.CharField(max_length=20, choices=COMPANY_SIZE, default='1-10')
    industry = models.CharField(max_length=50, choices=INDUSTRY_CHOICES, default='tech')
    website = models.URLField(blank=True)
    description = models.TextField(blank=True)
    logo = models.ImageField(upload_to='company_logos/', null=True, blank=True)
    location = models.CharField(max_length=200, blank=True)
    founded_year = models.IntegerField(null=True, blank=True)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.company_name


class Notification(models.Model):
    TYPE_CHOICES = [('email', 'Email'), ('whatsapp', 'WhatsApp'), ('in_app', 'In-App')]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    title = models.CharField(max_length=200)
    message = models.TextField()
    is_sent = models.BooleanField(default=False)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.type} - {self.title}"