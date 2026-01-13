from django.urls import path
from .views import (
    EmployeeTaskOverviewView,
    EmployeeTaskStatusView,
    EmployeeGroupStatsView,
    EmployeeRecentTasksView,
    EmployeeTaskSubmitView
)

urlpatterns = [
    path('task-overview/', EmployeeTaskOverviewView.as_view()),
    path('task-status/', EmployeeTaskStatusView.as_view()),
    path('group-info/', EmployeeGroupStatsView.as_view()),
    path('recent-tasks/', EmployeeRecentTasksView.as_view()),
    path('tasks/<int:task_id>/submit/',EmployeeTaskSubmitView.as_view())
]
