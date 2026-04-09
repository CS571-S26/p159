from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Transaction

# 1. Serializer for Transactions
class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        # Explicitly list the fields React needs to see/send
        # We exclude 'user' because the view will assign it automatically
        fields = ['id', 'title', 'amount', 'category', 'date']

# 2. Serializer for User Registration
class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'password', 'email')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user