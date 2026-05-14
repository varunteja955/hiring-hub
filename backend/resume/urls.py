from django.urls import path
from .views import ApplyView, MyApplicationsView, JobApplicationsView, UpdateApplicationStatusView, AnalyzeResumeView

urlpatterns = [
    path('apply/', ApplyView.as_view(), name='apply'),
    path('my-applications/', MyApplicationsView.as_view(), name='my-applications'),
    path('job/<str:job_id>/applications/', JobApplicationsView.as_view(), name='job-applications'),
    path('<uuid:app_id>/update/', UpdateApplicationStatusView.as_view(), name='update-application'),
    path('analyze/', AnalyzeResumeView.as_view(), name='analyze-resume'),
    path('upload/', ApplyView.as_view(), name='resume-upload'),
]