from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    # This line connects your transactions app's URLs to the main project
    path('', include('transactions.urls')), 
]