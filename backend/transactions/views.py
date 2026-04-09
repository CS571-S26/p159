from rest_framework import generics, permissions
from .models import Transaction
from .serializers import TransactionSerializer

class TransactionListCreate(generics.ListCreateAPIView):
    """
    Handles GET (list transactions) and POST (create transaction).
    This aligns with the 'centralized interface' mentioned in the proposal.
    """
    serializer_class = TransactionSerializer
    
    # In the final version, you will uncomment this to ensure 
    # users only see their own financial data.
    # permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Optionally restricts the returned transactions to a given user,
        by filtering against a `user` query parameter in the URL.
        """
        queryset = Transaction.objects.all()
        user_id = self.request.query_params.get('user')
        if user_id is not None:
            queryset = queryset.filter(user__id=user_id)
        return queryset

    def perform_create(self, serializer):
        """
        Saves the transaction. You can add logic here to 
        automatically associate the transaction with a user.
        """
        serializer.save()

class TransactionDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Handles GET (single), PUT (update), and DELETE.
    Useful for the 'interactive element' of the Budgetly dashboard.
    """
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer