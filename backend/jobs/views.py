from rest_framework import status, views
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from accounts.models import User, StudentProfile, CompanyProfile
from .models import Job
from .serializers import JobSerializer, JobCreateSerializer


class JobListCreateView(views.APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        jobs = Job.objects.filter(is_active=True).select_related('company__user')
        data = []
        for job in jobs:
            data.append({
                'id': str(job.id),
                'title': job.title,
                'description': job.description,
                'required_skills': job.required_skills,
                'experience_required': job.experience_required,
                'job_type': job.job_type,
                'work_mode': job.work_mode,
                'salary_min': job.salary_min,
                'salary_max': job.salary_max,
                'location': job.location,
                'deadline': str(job.deadline) if job.deadline else None,
                'is_active': job.is_active,
                'is_featured': job.is_featured,
                'company_name': job.company.company_name if job.company else None,
                'created_at': str(job.created_at)
            })
        return Response(data)

    def post(self, request):
        if request.user.role != 'company':
            return Response({'error': 'Only companies can post jobs'}, status=status.HTTP_403_FORBIDDEN)

        try:
            company = request.user.company_profile
        except:
            return Response({'error': 'Company profile not found'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = JobCreateSerializer(data=request.data)
        if serializer.is_valid():
            job = Job.objects.create(
                company=company,
                title=serializer.validated_data['title'],
                description=serializer.validated_data['description'],
                required_skills=serializer.validated_data.get('required_skills', []),
                experience_required=serializer.validated_data.get('experience_required', 'Mid'),
                job_type=serializer.validated_data.get('job_type', 'Full-time'),
                work_mode=serializer.validated_data.get('work_mode', 'On-site'),
                salary_min=serializer.validated_data.get('salary_min'),
                salary_max=serializer.validated_data.get('salary_max'),
                location=serializer.validated_data.get('location', ''),
                deadline=serializer.validated_data.get('deadline')
            )
            return Response({'id': str(job.id), 'title': job.title}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class JobDetailView(views.APIView):
    permission_classes = [AllowAny]

    def delete(self, request, job_id):
        try:
            job = Job.objects.get(id=job_id)

            if job.company.user == request.user or request.user.is_staff:
                job.delete()
                return Response(status=status.HTTP_204_NO_CONTENT)

            return Response({'error': 'You do not have permission to delete this job.'},
                            status=status.HTTP_403_FORBIDDEN)
        except Job.DoesNotExist:
            return Response({'error': 'Job not found'}, status=status.HTTP_404_NOT_FOUND)

    def get(self, request, job_id):
        try:
            job = Job.objects.get(id=job_id)
            return Response({
                'id': str(job.id),
                'title': job.title,
                'description': job.description,
                'required_skills': job.required_skills,
                'experience_required': job.experience_required,
                'job_type': job.job_type,
                'work_mode': job.work_mode,
                'salary_min': job.salary_min,
                'salary_max': job.salary_max,
                'location': job.location,
                'deadline': str(job.deadline) if job.deadline else None,
                'is_active': job.is_active,
                'is_featured': job.is_featured,
                'company_name': job.company.company_name if job.company else None
            })
        except Job.DoesNotExist:
            return Response({'error': 'Job not found'}, status=status.HTTP_404_NOT_FOUND)


class MyJobsView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != 'company':
            return Response({'error': 'Only companies can view their jobs'}, status=status.HTTP_403_FORBIDDEN)

        try:
            company = request.user.company_profile
        except:
            return Response([])

        from jobs.models import Application
        jobs = Job.objects.filter(company=company)
        data = []
        for job in jobs:
            app_count = Application.objects.filter(job=job).count()
            data.append({
                'id': str(job.id),
                'title': job.title,
                'description': job.description,
                'required_skills': job.required_skills,
                'job_type': job.job_type,
                'is_active': job.is_active,
                'location': job.location,
                '_applications_count': app_count,
                'created_at': str(job.created_at)
            })
        return Response(data)