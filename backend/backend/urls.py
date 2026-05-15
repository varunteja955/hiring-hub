from django.contrib import admin
from django.http import JsonResponse, HttpResponse
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static


def favicon_redirect(request):
    svg_content = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3b82f6"/>
      <stop offset="100%" style="stop-color:#06b6d4"/>
    </linearGradient>
  </defs>
  <rect width="100" height="100" rx="20" fill="url(#grad)"/>
  <text x="50" y="65" font-family="Arial, sans-serif" font-size="50" font-weight="bold" fill="white" text-anchor="middle">H</text>
</svg>'''
    return HttpResponse(svg_content, content_type='image/svg+xml')


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
    path('favicon.ico', favicon_redirect),
    path('', api_root),
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/jobs/', include('jobs.urls')),
    path('api/resume/', include('resume.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)