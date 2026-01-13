from django.urls import path
from .views import AdminDashboardView,AdminAllUsersView, AdminAllTasksView,ChangeUserRoleView,DeleteUserView,AdminAnalyticsView

urlpatterns = [
    path('', AdminDashboardView.as_view(), name='admin-dashboard'),
    path('users/', AdminAllUsersView.as_view(), name='admin-all-users'),
    path('tasks/', AdminAllTasksView.as_view(), name='admin-all-tasks'),
    path('change-role/', ChangeUserRoleView.as_view(), name='change-user-role'),
    path('delete-user/<int:user_id>/', DeleteUserView.as_view(), name='delete-user'),
    path('analytics/', AdminAnalyticsView.as_view(), name='admin-analytics'),
]
