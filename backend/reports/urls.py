from django.urls import path
from .views import ReportsDownloadView

urlpatterns = [
    path('download/<str:role>/<int:pk>/', ReportsDownloadView.as_view(), name='reports-download'),
]
