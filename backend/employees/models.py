from django.db import models


class Employee(models.Model):
    name = models.CharField(max_length=100)
    # max_length 191: MySQL 5.6 + utf8mb4 limits unique indexes to 767 bytes
    email = models.EmailField(max_length=191, unique=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name
