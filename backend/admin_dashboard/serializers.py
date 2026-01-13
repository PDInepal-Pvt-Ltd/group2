from rest_framework import serializers
from django.contrib.auth import get_user_model
from tasks.models import Task

User = get_user_model()

class AdminUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'is_active', 'department', 'date_joined']

class AdminTaskSerializer(serializers.ModelSerializer):
    assigned_to = serializers.StringRelatedField(many=True)

    class Meta:
        model = Task
        fields = ['id', 'title', 'status', 'assigned_to', 'group', 'due_date', 'created_by']
        
class ChangeUserRoleSerializer(serializers.Serializer):
    user_id = serializers.IntegerField()
    new_role = serializers.ChoiceField(choices=[('employee', 'Employee'), ('manager', 'Manager')])