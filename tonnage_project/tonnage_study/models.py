from django.db import models

class TonnageStudy(models.Model):
    session_name = models.CharField(max_length=255, unique=True)
    data = models.JSONField()  # Store the JSON data
