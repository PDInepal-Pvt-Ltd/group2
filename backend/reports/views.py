import csv
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from users.models import User
from users.permissions import IsAdmin, IsManager

class ReportsDownloadView(APIView):
    
    permission_classes = [IsAuthenticated]

    def get(self, request, role, pk):
        user = request.user

        if user.role == 'admin' or user.is_superuser:
            if role not in ['manager', 'employee']:
                return HttpResponse("Invalid role", status=400)
        elif user.role == 'manager':
            if role != 'employee':
                return HttpResponse("Permission denied", status=403)
        else:
            return HttpResponse("Permission denied", status=403)

        target_user = get_object_or_404(User, pk=pk, role=role)

        response = HttpResponse(content_type='text/csv')
        filename = f"{role}_{target_user.username}_report.csv"
        response['Content-Disposition'] = f'attachment; filename="{filename}"'

        writer = csv.writer(response)
        writer.writerow(['ID', 'Username', 'Email', 'Role', 'Phone', 'Company', 'Department'])

        writer.writerow([
            target_user.id,
            target_user.username,
            target_user.email,
            target_user.role,
            target_user.phone,
            target_user.company,
            target_user.department
        ])

        return response
