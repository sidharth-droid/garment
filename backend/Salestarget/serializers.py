# serializers.py
from rest_framework import serializers
from .models import SalesTarget

class SalesTargetSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalesTarget
        fields = ('id', 'daily', 'monthly', 'yearly')
