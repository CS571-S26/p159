from django.db import models
from django.contrib.auth.models import User # Add this import

class Transaction(models.Model):
    # This link is what makes the "My Transactions" filtering work
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="transactions")
    title = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=100)
    date = models.DateField()

    def __str__(self):
        return f"{self.title} - {self.amount}"