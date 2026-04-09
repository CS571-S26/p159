from django.urls import path
from .views import TransactionListCreate, TransactionDetail, RegisterView

urlpatterns = [
    # This becomes: http://127.0.0.1:8000/api/register/
    path('register/', RegisterView.as_view(), name='register'),

    # This becomes: http://127.0.0.1:8000/api/transactions/
    path('transactions/', TransactionListCreate.as_view(), name='transaction-list-create'),

    # This becomes: http://127.0.0.1:8000/api/transactions/<id>/
    path('transactions/<int:pk>/', TransactionDetail.as_view(), name='transaction-detail'),
]