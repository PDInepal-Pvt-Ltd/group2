from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from django.db.models import Count, Q
from django.utils.timezone import now
from django.shortcuts import get_object_or_404
from tasks.models import Task
from tasks.serializers import TaskSerializer
from users.permissions import IsAdminOrManager

User = get_user_model()

TASK_PROGRESS = {
    "todo": 0,
    "in_progress": 50,
    "review": 80,
    "completed": 100
}

def task_progress(status):
    return TASK_PROGRESS.get(status, 0)

def total_employees_count():
    return User.objects.filter(role='employee').count()

class TotalEmployeeView(APIView):
    permission_classes = [IsAuthenticated, IsAdminOrManager]

    def get(self, request):
        return Response({
            "total_employees": total_employees_count()
        })

class FilterEmployeesView(APIView):
    permission_classes = [IsAuthenticated, IsAdminOrManager]

    def get(self, request):
        employees = User.objects.filter(role='employee').annotate(
            task_count=Count('tasks', distinct=True)
        )

        qp = request.query_params
        if qp.get('department'):
            employees = employees.filter(department__icontains=qp['department'])

        if qp.get('min_tasks'):
            employees = employees.filter(task_count__gte=int(qp['min_tasks']))

        if qp.get('max_tasks'):
            employees = employees.filter(task_count__lte=int(qp['max_tasks']))

        if qp.get('task_status'):
            employees = employees.filter(tasks__status=qp['task_status']).distinct()

        if qp.get('joined_after'):
            employees = employees.filter(date_joined__date__gte=qp['joined_after'])

        if qp.get('joined_before'):
            employees = employees.filter(date_joined__date__lte=qp['joined_before'])
        
        if qp.get('group'):
            employees = employees.filter(tasks__group__id=qp['group'])



        data = list(employees.values(
            'id', 'username', 'email', 'department', 'phone', 'task_count', 'date_joined'
        ))

        return Response({
            "total": employees.count(),
            "employees": data
        })

class EmployeeHistoryView(APIView):
    permission_classes = [IsAuthenticated, IsAdminOrManager]

    def get(self, request, employee_id):
        employee = get_object_or_404(User, id=employee_id, role='employee')

        tasks = Task.objects.filter(
            assigned_to=employee
        ).select_related('group', 'created_by').order_by('-created_at')

        task_list = [
            {
                "id": task.id,
                "title": task.title,
                "description": task.description,
                "status": task.status,
                "group": task.group.name if task.group else None,
                "assigned_by": task.created_by.username if task.created_by else None,
                "assigned_at": task.created_at,
                "last_updated": task.updated_at
            } for task in tasks
        ]

        return Response({
            "employee": employee.username,
            "employee_id": employee.id,
            "total_tasks": tasks.count(),
            "tasks": task_list
        })

class TaskStatsView(APIView):
    permission_classes = [IsAuthenticated, IsAdminOrManager]

    def get(self, request):
        today = now().date()
        tasks = Task.objects.prefetch_related('assigned_to')

        active_tasks = tasks.filter(status__in=['todo', 'in_progress'])
        overdue_tasks = active_tasks.filter(due_date__lt=today)
        completed_tasks = tasks.filter(status='completed')

        def task_details(task_queryset):
            return [
                {
                    "id": t.id,
                    "title": t.title,
                    "assigned_to": [u.username for u in t.assigned_to.all()],
                    "status": t.status,
                    "progress_percentage": task_progress(t.status),
                    "due_date": t.due_date
                } for t in task_queryset
            ]

        return Response({
            "total_tasks": tasks.count(),
            "active_tasks_count": active_tasks.count(),
            "overdue_tasks_count": overdue_tasks.count(),
            "completed_tasks_count": completed_tasks.count(),
            "active_task_details": task_details(active_tasks),
            "overdue_task_details": task_details(overdue_tasks),
            "completed_task_details": task_details(completed_tasks),
        })

class TaskFilterView(APIView):
    permission_classes = [IsAuthenticated, IsAdminOrManager]

    def get(self, request):
        employees = User.objects.filter(role='employee').annotate(
            task_count=Count('tasks', distinct=True)
        )

        qp = request.query_params

        if qp.get('department'):
            employees = employees.filter(department__icontains=qp['department'])

        if qp.get('min_tasks'):
            employees = employees.filter(task_count__gte=int(qp['min_tasks']))

        if qp.get('max_tasks'):
            employees = employees.filter(task_count__lte=int(qp['max_tasks']))

        if qp.get('task_status'):
            employees = employees.filter(tasks__status=qp['task_status']).distinct()

        if qp.get('joined_after'):
            employees = employees.filter(date_joined__date__gte=qp['joined_after'])

        if qp.get('joined_before'):
            employees = employees.filter(date_joined__date__lte=qp['joined_before'])

        if qp.get('group'):
            employees = employees.filter(tasks__group__id=qp['group']).distinct()

        data = list(employees.values(
            'id', 'username', 'email', 'department', 'phone', 'task_count', 'date_joined'
        ))

        employees_per_group = employees.filter(tasks__group__isnull=False) \
            .values('tasks__group__name') \
            .annotate(count=Count('id', distinct=True))

        return Response({
            "total": employees.count(),
            "employees": data,
            "employees_per_group": list(employees_per_group)
        })

class AnalyticsSimpleView(APIView):
    permission_classes = [IsAuthenticated, IsAdminOrManager]

    def get(self, request):
        today = now().date()
        total_employees = total_employees_count()

        counts = Task.objects.aggregate(
            total_tasks=Count('id'),
            active_tasks=Count('id', filter=Q(status__in=['todo', 'in_progress'])),
            completed_tasks=Count('id', filter=Q(status='completed')),
            overdue_tasks=Count('id', filter=Q(status__in=['todo', 'in_progress'], due_date__lt=today))
        )

        return Response({
            "total_employees": total_employees,
            **counts
        })
