from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from tasks.models import Task, TaskGroup
from rest_framework import status
from .serializers import AdminUserSerializer, AdminTaskSerializer,ChangeUserRoleSerializer
from users.permissions import IsAdmin, IsAdminOrManager, IsAdminManagerOrClient
from django.db.models import Count, Q, Avg
from django.utils.timezone import now

User = get_user_model()

class AdminDashboardView(APIView):
    permission_classes = [IsAuthenticated, IsAdminOrManager]

    def get(self, request):
        total_employees = User.objects.filter(Q(role='employee') | Q(role='client')).count()
        total_managers = User.objects.filter(role='manager').count()
        total_tasks = Task.objects.count()
        completed_tasks = Task.objects.filter(status='completed').count()
        active_tasks = Task.objects.filter(status__in=['todo', 'in_progress']).count()
        total_projects = TaskGroup.objects.count()

        return Response({
            "total_employees": total_employees,
            "total_managers": total_managers,
            "total_tasks": total_tasks,
            "total_projects": total_projects,
            "completed_tasks": completed_tasks,
            "active_tasks": active_tasks
        })


class AdminAllUsersView(APIView):
    permission_classes = [IsAuthenticated, IsAdminManagerOrClient]

    def get(self, request):
        users = User.objects.all()
        serializer = AdminUserSerializer(users, many=True)
        return Response(serializer.data)

class AdminAllTasksView(APIView):
    permission_classes = [IsAuthenticated, IsAdminOrManager]

    def get(self, request):
        tasks = Task.objects.prefetch_related('assigned_to').all()
        serializer = AdminTaskSerializer(tasks, many=True)
        return Response(serializer.data)

class ChangeUserRoleView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def post(self, request):
        serializer = ChangeUserRoleSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user_id = serializer.validated_data['user_id']
        new_role = serializer.validated_data['new_role']

        try:
            user = User.objects.get(id=user_id)
            user.role = new_role
            user.save()
            return Response({"message": f"{user.username}'s role changed to {new_role}"})
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

class DeleteUserView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def delete(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
            user.delete()
            return Response({"message": "User deleted successfully"})
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

class AdminAnalyticsView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):
        today = now().date()

        total_admins = User.objects.filter(role='admin').count()
        total_managers = User.objects.filter(role='manager').count()
        total_employees = User.objects.filter(role='employee').count()

        employees_with_tasks = User.objects.filter(role='employee', tasks__isnull=False).distinct().count()
        inactive_employees = total_employees - employees_with_tasks

        employees_per_department = User.objects.filter(role='employee')\
            .values('department')\
            .annotate(count=Count('id'))

        employees_per_group = User.objects.filter(role='employee', tasks__group__isnull=False)\
            .values('tasks__group__name')\
            .annotate(count=Count('id', distinct=True))

        total_tasks = Task.objects.count()
        tasks_by_status = Task.objects.values('status').annotate(count=Count('id'))

        overdue_tasks = Task.objects.filter(status__in=['todo','in_progress'], due_date__lt=today)

        tasks_by_group = Task.objects.values('group__name')\
            .annotate(count=Count('id'))

        tasks_by_employee = [
            {"employee": u.username, "tasks_count": u.tasks.count()} 
            for u in User.objects.filter(role='employee')
        ]

        task_completion_trends = Task.objects.filter(status='completed').extra({
            'day': "date(created_at)"
        }).values('day').annotate(count=Count('id')).order_by('day')

        tasks_per_manager = Task.objects.values('created_by__username').annotate(total_tasks=Count('id'))

        overdue_per_manager = Task.objects.filter(
            status__in=['todo','in_progress'], due_date__lt=today
        ).values('created_by__username').annotate(overdue_tasks=Count('id'))

        return Response({
            "user_role_analytics": {
                "total_admins": total_admins,
                "total_managers": total_managers,
                "total_employees": total_employees,
                "active_employees": employees_with_tasks,
                "inactive_employees": inactive_employees,
                "employees_per_department": list(employees_per_department),
                "employees_per_group": list(employees_per_group),
            },
            "task_analytics": {
                "total_tasks": total_tasks,
                "tasks_by_status": list(tasks_by_status),
                "overdue_tasks_count": overdue_tasks.count(),
                "tasks_by_group": list(tasks_by_group),
                "tasks_by_employee": tasks_by_employee,
                "task_completion_trends": list(task_completion_trends),
            },
            "manager_analytics": {
                "tasks_per_manager": list(tasks_per_manager),
                "overdue_tasks_per_manager": list(overdue_per_manager),
            }
        })
