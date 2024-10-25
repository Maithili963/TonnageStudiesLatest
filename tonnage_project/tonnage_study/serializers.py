from rest_framework import serializers
from .models import TonnageStudy

class TonnageStudySerializer(serializers.ModelSerializer):
    class Meta:
        model = TonnageStudy
        fields = ['session_name', 'data']
