from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, viewsets

from .models import Task
from .serializers import TaskSerializer


class TaskViewSet(viewsets.ModelViewSet):
    # select_related loads the employee in the same query (avoids one query per task)
    queryset = Task.objects.select_related('assigned_to')
    serializer_class = TaskSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['status', 'priority', 'assigned_to']
    search_fields = ['title']
