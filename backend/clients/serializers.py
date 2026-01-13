from rest_framework import serializers
from users.models import User

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        exclude = ['password', 'is_superuser', 'is_staff', 'groups', 'user_permissions', 'role']
