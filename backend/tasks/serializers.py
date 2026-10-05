from django.utils import timezone
from rest_framework import serializers

from .models import Task


class TaskSerializer(serializers.ModelSerializer):
    # Read-only name so the task list can show the employee without a second request
    assigned_to_name = serializers.CharField(source='assigned_to.name', read_only=True, allow_null=True)

    class Meta:
        model = Task
        fields = [
            'id', 'title', 'description', 'assigned_to', 'assigned_to_name',
            'priority', 'status', 'due_date', 'created_at',
        ]
        extra_kwargs = {
            'title': {'error_messages': {'required': 'Title is required.', 'blank': 'Title is required.'}},
            'due_date': {'error_messages': {'required': 'Due date is required.', 'null': 'Due date is required.'}},
        }

    def validate_due_date(self, value):
        # Only checked on create; an existing task may keep an older due date
        if self.instance is None and value < timezone.localdate():
            raise serializers.ValidationError('Due date cannot be in the past.')
        return value

    def validate(self, attrs):
        # Fall back to the saved values so partial updates (PATCH) are checked too
        status = attrs.get('status', self.instance.status if self.instance else Task.Status.PENDING)
        assigned_to = attrs.get('assigned_to', self.instance.assigned_to if self.instance else None)

        if status == Task.Status.COMPLETED and assigned_to is None:
            raise serializers.ValidationError(
                {'status': 'A task cannot be marked Completed unless it has an employee assigned.'}
            )
        return attrs
