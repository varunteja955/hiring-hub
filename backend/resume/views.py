from rest_framework import status, views
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
import tempfile
import os
from resume.serializers import ApplicationSerializer
from resume.analyzer import analyze_resume
from accounts.authentication import send_email


class ApplyView(views.APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        if request.user.role != 'student':
            return Response({'error': 'Only students can apply'}, status=403)

        from jobs.models import Job

        job_id = request.data.get('job')
        resume_file = request.FILES.get('resume')

        if not resume_file:
            return Response({'error': 'No resume file uploaded'}, status=400)

        if not job_id:
            return Response({'error': 'No Job ID provided'}, status=400)

        try:
            job = Job.objects.get(id=job_id)

            # Save file temporarily to analyze
            temp_dir = tempfile.gettempdir()
            temp_path = os.path.join(temp_dir, resume_file.name)
            with open(temp_path, 'wb') as f:
                for chunk in resume_file.chunks():
                    f.write(chunk)

            # Analyze resume with job requirements
            analysis = analyze_resume(temp_path, {'required_skills': job.required_skills})

            # Get match score
            match_score = analysis.get('match_percentage', analysis.get('ats_score', 0))

            from jobs.models import Application
            Application.objects.create(
                candidate=request.user.student_profile,
                job=job,
                resume=resume_file,
                match_score=match_score,
                ats_score=analysis.get('ats_score', 0),
                status='pending'
            )

            # Clean up temp file
            try:
                os.remove(temp_path)
            except:
                pass

            return Response({'message': 'Applied successfully', 'match_score': match_score}, status=201)

        except Job.DoesNotExist:
            return Response({'error': 'Job not found'}, status=404)
        except Exception as e:
            return Response({'error': str(e)}, status=500)


class MyApplicationsView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != 'student':
            return Response({'error': 'Only students can view'}, status=status.HTTP_403_FORBIDDEN)

        from jobs.models import Application
        applications = Application.objects.filter(candidate=request.user.student_profile)
        return Response(ApplicationSerializer(applications, many=True).data)


class JobApplicationsView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, job_id):
        if request.user.role != 'company':
            return Response({'error': 'Only companies can view'}, status=status.HTTP_403_FORBIDDEN)

        from jobs.models import Job, Application
        try:
            job = Job.objects.get(id=job_id, company=request.user.company_profile)
        except Job.DoesNotExist:
            return Response({'error': 'Job not found'}, status=status.HTTP_404_NOT_FOUND)

        applications = Application.objects.filter(job=job)
        return Response(ApplicationSerializer(applications, many=True).data)


class UpdateApplicationStatusView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, app_id):
        if request.user.role != 'company':
            return Response({'error': 'Only companies can update'}, status=status.HTTP_403_FORBIDDEN)

        new_status = request.data.get('status')
        if new_status not in ['pending', 'reviewed', 'shortlisted', 'rejected', 'interview', 'hired']:
            return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)

        from jobs.models import Application
        try:
            application = Application.objects.get(id=app_id, job__company=request.user.company_profile)
        except Application.DoesNotExist:
            return Response({'error': 'Application not found'}, status=status.HTTP_404_NOT_FOUND)

        application.status = new_status
        application.save()

        send_email(application.candidate.user.email, 'Status Update', f'Your application status has been updated to: {new_status}')
        return Response(ApplicationSerializer(application).data)


class AnalyzeResumeView(views.APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        resume_file = request.FILES.get('resume')
        if not resume_file:
            return Response({'error': 'Resume required'}, status=status.HTTP_400_BAD_REQUEST)

        temp_dir = tempfile.gettempdir()
        temp_path = os.path.join(temp_dir, resume_file.name)
        with open(temp_path, 'wb') as f:
            for chunk in resume_file.chunks():
                f.write(chunk)

        analysis = analyze_resume(temp_path)

        # Also save the resume to the student's profile
        if request.user.role == 'student':
            student_profile = request.user.student_profile
            student_profile.resume = resume_file
            student_profile.resume_score = analysis.get('ats_score', 0)
            if hasattr(student_profile, 'ats_score'):
                student_profile.ats_score = analysis.get('ats_score', 0)
            student_profile.save()

        return Response(analysis)