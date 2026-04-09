from rest_framework import serializers
from .models import Transaction

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        # This will include all fields from your model (id, user, title, amount, etc.)
        fields = '__all__'