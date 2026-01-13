from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    TaskCreateView, TaskUpdateDeleteView,
    TaskListView, TaskDetailView,
    TaskGroupViewSet
)

router = DefaultRouter()
router.register('groups', TaskGroupViewSet, basename='task-group')

urlpatterns = [
    path('create/', TaskCreateView.as_view()),
    path('my-tasks/', TaskListView.as_view()),
    path('detail/<int:pk>/', TaskDetailView.as_view()),
    path('<int:pk>/', TaskUpdateDeleteView.as_view()),
    path('', include(router.urls)),
]
