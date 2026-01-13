from django.urls import path
from .views import EmployeeNotificationView, ManagerNotificationView,AdminNotificationView

urlpatterns = [
    path('employee/', EmployeeNotificationView.as_view(), name='employee-notifications'),
    path('manager/', ManagerNotificationView.as_view(), name='manager-notifications'),
    path('admin/', AdminNotificationView.as_view(),name="admin-notifications"),
]