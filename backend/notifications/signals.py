from django.db.models.signals import m2m_changed, post_save
from django.dispatch import receiver
from tasks.models import Task
from .models import Notification
from django.contrib.auth import get_user_model

User = get_user_model()

# When a task is assigned
@receiver(m2m_changed, sender=Task.assigned_to.through)
def task_assigned_notification(sender, instance, action, pk_set, **kwargs):
    if action == "post_add":
        for user_id in pk_set:
            Notification.objects.create(
                user_id=user_id,
                task=instance,
                title="Task Assigned",
                message=f"You have been assigned to task '{instance.title}'",
                notif_type="task_assigned"
            )
        # Admins should also get notified for assignment
        admins = User.objects.filter(role='admin')
        for admin in admins:
            Notification.objects.create(
                user=admin,
                task=instance,
                title="Task Assignment Update",
                message=f"Task '{instance.title}' assigned to {instance.assigned_to.all().count()} users",
                notif_type="admin_task_created"
            )

# When a task is updated
@receiver(post_save, sender=Task)
def task_updated_notification(sender, instance, created, **kwargs):
    if created:
        # Task created
        if instance.created_by.role == 'manager':
            Notification.objects.create(
                user=instance.created_by,
                task=instance,
                title="Task Created",
                message=f"New task '{instance.title}' created by you",
                notif_type="task_assigned"
            )
        # Admin notification
        admins = User.objects.filter(role='admin')
        for admin in admins:
            Notification.objects.create(
                user=admin,
                task=instance,
                title="New Task Created",
                message=f"New task '{instance.title}' created by {instance.created_by.username}",
                notif_type="admin_task_created"
            )
    else:
        # Task updated
        for user in instance.assigned_to.all():
            if user.role == "employee":
                Notification.objects.create(
                    user=user,
                    task=instance,
                    title="Task Updated",
                    message=f"Task '{instance.title}' has been updated",
                    notif_type="task_updated"
                )
        # Manager who created the task
        if instance.created_by.role == 'manager':
            Notification.objects.create(
                user=instance.created_by,
                task=instance,
                title="Task Activity",
                message=f"Task '{instance.title}' updated",
                notif_type="task_updated"
            )
        # Admin notification
        admins = User.objects.filter(role='admin')
        for admin in admins:
            Notification.objects.create(
                user=admin,
                task=instance,
                title="Task Update",
                message=f"Task '{instance.title}' updated by {instance.created_by.username}",
                notif_type="admin_task_updated"
            )
