from rest_framework import generics, permissions
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth.models import User

from .models import Transaction
from .serializers import TransactionSerializer, RegisterSerializer

# 1. Handle List and Create with User-Level Security
class TransactionListCreate(generics.ListCreateAPIView):
    """
    Handles GET (list transactions) and POST (create transaction).
    Restricted to authenticated users only.
    """
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Only returns transactions belonging to the currently logged-in user.
        """
        return Transaction.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """
        Automatically links the new transaction to the logged-in user.
        """
        serializer.save(user=self.request.user)


# 2. Handle Individual Transactions (Update/Delete) with Security
class TransactionDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Handles GET (single), PUT (update), and DELETE.
    Ensures a user can't edit or delete someone else's transaction.
    """
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Restricts the scope so you can only 'find' your own transactions.
        """
        return Transaction.objects.filter(user=self.request.user)


# 3. Public Registration View
class RegisterView(generics.CreateAPIView):
    """
    Allows anyone to create a new account.
    """
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer