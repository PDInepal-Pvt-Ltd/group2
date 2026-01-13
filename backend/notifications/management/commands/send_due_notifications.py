from django.core.management.base import BaseCommand
from notifications.tasks import create_due_soon_notifications_for_employees

class Command(BaseCommand):
    help = 'Send due soon notifications for employees'

    def handle(self, *args, **kwargs):
        create_due_soon_notifications_for_employees()
        self.stdout.write(self.style.SUCCESS('Employee due soon notifications sent.'))
