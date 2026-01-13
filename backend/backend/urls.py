from django.contrib import admin
from django.urls import path, include  
from backend.auth_views import GoogleLogin

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/', include('users.urls')),  
    path('api/tasks/', include('tasks.urls')),
    path('api/clients/', include('clients.urls')),
    path('api/dashboard/', include('dashboard.urls')),
    path('api/search/', include('search.urls')),
    path('api/auth/social/google/', GoogleLogin.as_view(), name='google_login'),
    path('api/auth/', include('dj_rest_auth.urls')),
    path('api/auth/registration/', include('dj_rest_auth.registration.urls')),
    path('api/notifications/',include('notifications.urls')),
    path('api/admin-dashboard/', include('admin_dashboard.urls')),
    path('api/employee-dashboard/', include('employee_dashboard.urls')),
    path('api/reports/', include('reports.urls')),
]
