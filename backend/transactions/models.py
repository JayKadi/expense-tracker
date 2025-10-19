# backend/transactions/models.py
from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User


class Transaction(models.Model):
    CATEGORY_CHOICES = [
        ('food', 'Food'),
        ('transport', 'Transport'),
        ('bills', 'Bills'),
        ('entertainment', 'Entertainment'),
        ('shopping', 'Shopping'),
        ('health', 'Health'),
        ('education', 'Education'),
        ('salary', 'Salary'),
        ('other', 'Other'),
    ]
    
    TYPE_CHOICES = [
        ('income', 'Income'),
        ('expense', 'Expense'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='transactions')
    type = models.CharField(max_length=10, choices=TYPE_CHOICES, default='expense')
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='other')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(blank=True)
    date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-date', '-created_at']
    
    def __str__(self):
        return f"{self.type} - {self.category} - {self.amount}"