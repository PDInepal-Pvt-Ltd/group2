from django.urls import path
from .views import (
    TotalEmployeeView,
    FilterEmployeesView,
    EmployeeHistoryView,
    TaskStatsView,
    TaskFilterView,
    AnalyticsSimpleView
)

urlpatterns = [
    path('total_employees/', TotalEmployeeView.as_view(), name="total-employees"),
    path('filter_employees/', FilterEmployeesView.as_view(), name="filter-employees"),
    path('employee_history/<int:employee_id>/', EmployeeHistoryView.as_view(), name="employee-history"),
    path('task_stats/', TaskStatsView.as_view(), name="task-stats"),
    path('task_filter/', TaskFilterView.as_view(), name="task-filter"),
    path('analytics_simple/', AnalyticsSimpleView.as_view(), name="analytics-simple"),
]
