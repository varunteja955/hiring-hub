from rest_framework import serializers
from accounts.models import User, StudentProfile, CompanyProfile

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'role', 'is_verified', 'created_at']
        read_only_fields = ['id', 'created_at']


class StudentProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email', read_only=True)
    
    class Meta:
        model = StudentProfile
        fields = ['id', 'email', 'first_name', 'last_name', 'phone', 'location', 
                  'bio', 'resume', 'resume_score', 'skills', 'education', 'experience',
                  'certifications', 'portfolio_links', 'github_url', 'linkedin_url',
                  'profile_completion', 'is_open_to_work', 'created_at']
        read_only_fields = ['id', 'created_at']


class CompanyProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email', read_only=True)
    
    class Meta:
        model = CompanyProfile
        fields = ['id', 'email', 'company_name', 'company_role', 'company_size',
                  'industry', 'website', 'description', 'logo', 'location',
                  'founded_year', 'is_verified', 'created_at']
        read_only_fields = ['id', 'created_at']


class RegisterStudentSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(min_length=8)
    first_name = serializers.CharField(max_length=100)
    last_name = serializers.CharField(max_length=100)


class RegisterCompanySerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(min_length=8)
    company_name = serializers.CharField(max_length=200)
    company_role = serializers.CharField(max_length=20, default='HR')
    company_size = serializers.CharField(max_length=20, default='1-10')
    industry = serializers.CharField(max_length=50, default='tech')
    location = serializers.CharField(max_length=200, default='')


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()


