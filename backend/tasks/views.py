from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, viewsets
from django.shortcuts import get_object_or_404

from .models import Task, TaskGroup
from .serializers import TaskSerializer, TaskGroupSerializer
from users.permissions import IsAdminOrManager
from rest_framework.permissions import IsAuthenticated

class TaskGroupViewSet(viewsets.ModelViewSet):
    queryset = TaskGroup.objects.all()
    serializer_class = TaskGroupSerializer
    permission_classes = [IsAuthenticated, IsAdminOrManager]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

class TaskCreateView(APIView):
    permission_classes = [IsAuthenticated, IsAdminOrManager]

    def post(self, request):
        serializer = TaskSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        assigned_users = serializer.validated_data.get('assigned_to', [])
        group = serializer.validated_data.get('group')

        task = Task.objects.create(
            title=serializer.validated_data['title'],
            description=serializer.validated_data.get('description'),
            status=serializer.validated_data.get('status', 'todo'),
            due_date=serializer.validated_data.get('due_date'),
            group=group,
            created_by=request.user
        )

        final_users = set(assigned_users)
        if group:
            final_users.update(group.members.all())
        
        # Auto-assign to creator if no one else is assigned
        if not final_users:
            final_users.add(request.user)

        task.assigned_to.set(final_users)

        return Response(
            {"message": "Task created successfully", "task": TaskSerializer(task).data},
            status=status.HTTP_201_CREATED
        )

class TaskListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        group_id = request.query_params.get('group_id')

        if user.role in ['admin', 'manager']:
            tasks = Task.objects.prefetch_related('assigned_to').all()
        else:
            tasks = Task.objects.prefetch_related('assigned_to').filter(
                assigned_to=user
            )

        if group_id:
            tasks = tasks.filter(group_id=group_id)

        return Response(TaskSerializer(tasks, many=True).data)

class TaskDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        task = get_object_or_404(Task, pk=pk)

        if request.user.role == 'employee' and request.user not in task.assigned_to.all():
            return Response(
                {"error": "Task not assigned to you"},
                status=status.HTTP_403_FORBIDDEN
            )

        return Response(TaskSerializer(task).data)

class TaskUpdateDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def get_task(self, pk):
        return get_object_or_404(Task, pk=pk)

    def patch(self, request, pk):
        task = self.get_task(pk)
        user = request.user

        if user.role == 'employee':
            if user not in task.assigned_to.all():
                return Response({"error": "Not allowed"}, status=403)

            task.status = request.data.get('status', task.status)
            task.save()
            return Response(TaskSerializer(task).data)

        serializer = TaskSerializer(task, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        assigned_users = serializer.validated_data.get('assigned_to')
        group = serializer.validated_data.get('group')

        serializer.save()

        if assigned_users is not None or group is not None:
            final_users = set(assigned_users or [])
            if group:
                final_users.update(group.members.all())
            task.assigned_to.set(final_users)

        return Response(TaskSerializer(task).data)

    def delete(self, request, pk):
        task = self.get_task(pk)

        if request.user.role == 'employee':
            return Response(
                {"error": "Employees cannot delete tasks"},
                status=status.HTTP_403_FORBIDDEN
            )

        task.delete()
        return Response({"message": "Task deleted successfully"})
