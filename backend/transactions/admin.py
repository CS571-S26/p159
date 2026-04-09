from django.contrib import admin
from .models import Transaction

# Register your model so it appears in the admin dashboard
admin.site.register(Transaction)