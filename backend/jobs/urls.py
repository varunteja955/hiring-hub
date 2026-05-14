from django.urls import path
from .views import JobListCreateView, JobDetailView, MyJobsView

urlpatterns = [
    path('', JobListCreateView.as_view(), name='job-list-create'),
    path('my/', MyJobsView.as_view(), name='my-jobs'),
    path('<str:job_id>/', JobDetailView.as_view(), name='job-detail'),
]