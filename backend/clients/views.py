from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

from users.models import User
from users.serializers import UserSerializer
from users.permissions import IsAdminOrManager
from rest_framework.permissions import IsAuthenticated


class EmployeeListView(APIView):
    permission_classes = [IsAuthenticated, IsAdminOrManager]

    def get(self, request):
        employees = User.objects.filter(role='employee').order_by('-date_joined')
        serializer = UserSerializer(employees, many=True)
        return Response({
            "count": employees.count(),
            "employees": serializer.data
        }, status=status.HTTP_200_OK)


class EmployeeDetailView(APIView):
    permission_classes = [IsAuthenticated, IsAdminOrManager]

    def get_object(self, pk):
        return get_object_or_404(User, pk=pk, role='employee')

    def get(self, request, pk):
        employee = self.get_object(pk)
        serializer = UserSerializer(employee)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        employee = self.get_object(pk)

        serializer = UserSerializer(
            employee,
            data=request.data
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response({
            "message": "Employee updated successfully",
            "employee": serializer.data
        }, status=status.HTTP_200_OK)

    def patch(self, request, pk):
        employee = self.get_object(pk)

        serializer = UserSerializer(
            employee,
            data=request.data,
            partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response({
            "message": "Employee updated successfully",
            "employee": serializer.data
        }, status=status.HTTP_200_OK)

    def delete(self, request, pk):
        employee = self.get_object(pk)
        employee.delete()
        return Response(
            {"message": "Employee deleted successfully"},
            status=status.HTTP_200_OK
        )
