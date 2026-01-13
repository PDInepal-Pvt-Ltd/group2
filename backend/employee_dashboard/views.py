from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils.timezone import now
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.db.models import Count
from tasks.models import Task
from .serializers import EmployeeTaskSubmitSerializer

class EmployeeTaskOverviewView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        today = now().date()

        tasks = Task.objects.filter(assigned_to=user)

        return Response({
            "total_tasks": tasks.count(),
            "completed_tasks": tasks.filter(status='completed').count(),
            "pending_tasks": tasks.filter(status__in=['todo', 'in_progress']).count(),
            "overdue_tasks": tasks.filter(
                status__in=['todo', 'in_progress'],
                due_date__lt=today
            ).count()
        })

class EmployeeTaskStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        status_data = Task.objects.filter(
            assigned_to=user
        ).values('status').annotate(
            count=Count('id')
        )

        return Response({
            "task_status_breakdown": list(status_data)
        })

class EmployeeGroupStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        my_tasks = Task.objects.filter(
            assigned_to=user,
            group__isnull=False
        )

        my_group_tasks = my_tasks.values(
            'group__name'
        ).annotate(
            my_tasks=Count('id')
        )

        group_totals = Task.objects.filter(
            group__in=my_tasks.values('group')
        ).values(
            'group__name'
        ).annotate(
            total_tasks=Count('id')
        )

        result = []
        for g in my_group_tasks:
            total = next(
                (t['total_tasks'] for t in group_totals
                 if t['group__name'] == g['group__name']),
                0
            )
            result.append({
                "group_name": g['group__name'],
                "my_tasks": g['my_tasks'],
                "total_tasks": total
            })

        return Response({
            "groups": result
        })

class EmployeeRecentTasksView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        recent_tasks = Task.objects.filter(
            assigned_to=user
        ).order_by('-created_at')[:5].values(
            'title', 'status', 'due_date'
        )

        return Response({
            "recent_tasks": list(recent_tasks)
        })

class EmployeeTaskSubmitView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, task_id):
        task = get_object_or_404(
            Task,
            id=task_id,
            assigned_to=request.user
        )

        serializer = EmployeeTaskSubmitSerializer(
            task,
            data=request.data,
            partial=True
        )
        serializer.is_valid(raise_exception=True)

        serializer.save()

        return Response(
            {
                "message": "Task updated successfully",
                "task": serializer.data
            },
            status=status.HTTP_200_OK
        )