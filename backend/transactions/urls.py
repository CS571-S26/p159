from django.urls import path
from .views import TransactionListCreate, TransactionDetail

urlpatterns = [
    # Path for getting all transactions or creating a new one
    path('api/transactions/', TransactionListCreate.as_view(), name='transaction-list-create'),
    # Path for getting, updating, or deleting a specific transaction by its ID
    path('api/transactions/<int:pk>/', TransactionDetail.as_view(), name='transaction-detail'),
]