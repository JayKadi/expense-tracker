from rest_framework import serializers
from .models import Transaction

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ['id', 'user', 'type', 'category', 'amount', 'description', 'date', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']  # User is set automatically, not from request