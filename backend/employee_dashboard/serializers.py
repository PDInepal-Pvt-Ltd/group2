from rest_framework import serializers
from tasks.models import Task


class EmployeeTaskSubmitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['status']
