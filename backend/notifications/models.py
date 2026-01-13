from django.db import models
from django.contrib.auth import get_user_model
from tasks.models import Task

User = get_user_model()

class Notification(models.Model):
    NOTIF_TYPES = [
        ('task_assigned', 'Task Assigned'),
        ('task_updated', 'Task Updated'),
        ('task_due', 'Task Due Soon'),
        ('task_completed', 'Task Completed'),
        ('admin_task_created', 'Admin Task Created'),
        ('admin_task_updated', 'Admin Task Updated'),
        ('manager_task_overdue', 'Manager Task Overdue'),
        ('admin_task_overdue', 'Admin Task Overdue'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    task = models.ForeignKey(Task, on_delete=models.CASCADE, null=True, blank=True)
    title = models.CharField(max_length=255, default='Notification')
    message = models.TextField()
    notif_type = models.CharField(max_length=50, choices=NOTIF_TYPES)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.notif_type}"
