from django.contrib import admin
from django.http import JsonResponse
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static


def api_root(request):
    return JsonResponse({
        "message": "Welcome to the AI-Hiring-Platform Backend API",
        "status": "Running",
        "endpoints": {
            "auth": "/api/auth/",
            "jobs": "/api/jobs/",
            "resume": "/api/resume/"
        }
    })


urlpatterns = [
    path('', api_root),
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/jobs/', include('jobs.urls')),
    path('api/resume/', include('resume.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)