from datetime import timedelta
from django.utils import timezone
from tasks.models import Task
from django.contrib.auth import get_user_model
from .models import Notification

User = get_user_model()

def create_due_soon_notifications_for_employees():
    today = timezone.now().date()
    due_soon_date = today + timedelta(days=1) 

    tasks_due_soon = Task.objects.filter(due_date=due_soon_date, status__in=['todo', 'in_progress'])

    for task in tasks_due_soon:
        for user in task.assigned_to.all():
            if user.role == "employee":
                Notification.objects.get_or_create(
                    user=user,
                    task=task,
                    message=f"Task '{task.title}' is due tomorrow!",
                    notif_type="task_due"
                )

def create_manager_notifications():
    today = timezone.now().date()
    managers = User.objects.filter(role='manager')

    overdue_tasks = Task.objects.filter(
        status__in=['todo', 'in_progress'],
        due_date__lt=today
    )

    for task in overdue_tasks:
        for manager in managers:
            Notification.objects.get_or_create(
                user=manager,
                task=task,
                notif_type="manager_task_overdue",
                message=f"Task '{task.title}' is overdue"
            )

def create_admin_overdue_notifications():
    today = timezone.now().date()
    admins = User.objects.filter(role='admin')

    overdue_tasks = Task.objects.filter(
        status__in=['todo', 'in_progress'],
        due_date__lt=today
    )

    for task in overdue_tasks:
        for admin in admins:
            Notification.objects.get_or_create(
                user=admin,
                task=task,
                notif_type="admin_task_overdue",
                message=f"Task '{task.title}' is overdue"
            )