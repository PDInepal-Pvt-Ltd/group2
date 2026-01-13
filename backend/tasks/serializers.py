from rest_framework import serializers
from .models import Task, TaskGroup
from django.contrib.auth import get_user_model

User = get_user_model()


class TaskGroupSerializer(serializers.ModelSerializer):
    members = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        many=True,
        required=False
    )

    progress = serializers.SerializerMethodField()

    class Meta:
        model = TaskGroup
        fields = ['id', 'name', 'description', 'members', 'created_by', 'created_at', 'progress']
        read_only_fields = ['created_by', 'created_at']

    def get_progress(self, obj):
        tasks = obj.tasks.all()
        total_tasks = tasks.count()
        if total_tasks == 0:
            return 0.0
        completed_tasks = tasks.filter(status='completed').count()
        return completed_tasks / total_tasks


class TaskSerializer(serializers.ModelSerializer):
    assigned_to = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        many=True,
        required=False
    )
    group = serializers.PrimaryKeyRelatedField(
        queryset=TaskGroup.objects.all(),
        required=False,
        allow_null=True
    )

    class Meta:
        model = Task
        fields = [
            'id', 'title', 'description',
            'assigned_to', 'group',
            'status', 'due_date',
            'created_by', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_by', 'created_at', 'updated_at']

    def validate(self, data):
        assigned_to = data.get('assigned_to')
        group = data.get('group')

        # Check existing values if PATCH (partial update)
        if self.instance and self.partial:
            assigned_to = assigned_to if assigned_to is not None else self.instance.assigned_to.all()
            group = group if group is not None else self.instance.group

        if not assigned_to and not group:
            raise serializers.ValidationError(
                "Task must be assigned to at least one employee or a group."
            )
        return data

