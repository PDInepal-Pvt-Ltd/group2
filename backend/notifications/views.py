from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Notification
from .serializers import NotificationSerializer
from users.permissions import IsEmployee, IsManager,IsAdmin

class EmployeeNotificationView(APIView):
    permission_classes = [IsAuthenticated, IsEmployee]

    def get(self, request):
        notifications = Notification.objects.filter(
            user=request.user
        ).order_by('-created_at')

        return Response(NotificationSerializer(notifications, many=True).data)

    def post(self, request):
        Notification.objects.filter(
            user=request.user,
            is_read=False
        ).update(is_read=True)

        return Response({"message": "All notifications marked as read"})


class ManagerNotificationView(APIView):
    permission_classes = [IsAuthenticated, IsManager]

    def get(self, request):
        notifications = Notification.objects.filter(
            user=request.user
        ).order_by('-created_at')

        return Response(NotificationSerializer(notifications, many=True).data)

    def post(self, request):
        Notification.objects.filter(
            user=request.user,
            is_read=False
        ).update(is_read=True)

        return Response({"message": "All notifications marked as read"})

class AdminNotificationView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):
        notifications = Notification.objects.filter(
            user=request.user
        ).order_by('-created_at')

        return Response(
            NotificationSerializer(notifications, many=True).data
        )

    def post(self, request):
        Notification.objects.filter(
            user=request.user,
            is_read=False
        ).update(is_read=True)

        return Response({"message": "All admin notifications marked as read"})