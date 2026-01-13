from django.db.models import Q
from django.contrib.auth import get_user_model
from tasks.models import Task

User = get_user_model()

def global_search(keyword, user):
    if not keyword:
        return {
            "employees": [],
            "tasks": []
        }
    
    employees_qs = User.objects.filter(role='employee')
    tasks_qs = Task.objects.all()

    if user.role == 'employee':
        tasks_qs = tasks_qs.filter(assigned_to=user)

    if user.role == 'manager':
        tasks_qs = tasks_qs.filter(
            Q(created_by=user) | Q(assigned_to=user)
        )

    employees = employees_qs.filter(
        Q(username__icontains=keyword) |
        Q(email__icontains=keyword) |
        Q(department__icontains=keyword)
    )[:10]

    tasks = tasks_qs.filter(
        Q(title__icontains=keyword) |
        Q(description__icontains=keyword)
    )[:10]

    return {
        "employees": employees,
        "tasks": tasks
    }
