# backend/transactions/views.py
import json
import csv
from rest_framework import viewsets, permissions
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.http import HttpResponse
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Transaction
from .serializers import TransactionSerializer
from django.db.models import Q
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

@api_view(['POST'])
@permission_classes([AllowAny])
def google_login(request):
    print("=== GOOGLE LOGIN DEBUG ===")
    print("1. Request method:", request.method)
    print("2. Request headers:", dict(request.headers))
    print("3. Request body (raw):", request.body)
    print("4. Request data:", request.data)
    print("5. Content-Type:", request.content_type)
    
    token = request.data.get('credential')
    print("6. Extracted token:", token)
    print("7. Token type:", type(token))
    
    if not token:
        print("ERROR: No token found in request.data")
        return Response({
            'error': 'Missing Google credential',
            'received_data': str(request.data),
            'received_keys': list(request.data.keys()) if hasattr(request.data, 'keys') else 'N/A'
        }, status=400)
    
    try:
        google_client_id = os.environ.get('GOOGLE_CLIENT_ID')
        print("8. Google Client ID configured:", bool(google_client_id))
        
        if not google_client_id:
            return Response({'error': 'Google Client ID not configured on server'}, status=500)
        
        # Verify the Google token
        idinfo = id_token.verify_oauth2_token(
            token, 
            google_requests.Request(), 
            google_client_id
        )
        
        print("9. Token verified successfully!")
        print("10. User info:", idinfo)
        
        # Get user info from Google
        email = idinfo.get('email')
        first_name = idinfo.get('given_name', '')
        last_name = idinfo.get('family_name', '')
        google_id = idinfo.get('sub')
        
        if not email:
            return Response({'error': 'Email not provided by Google'}, status=400)
        
        # Check if user exists, create if not
        try:
            user = User.objects.get(email=email)
            print(f"11. Found existing user: {user.username}")
        except User.DoesNotExist:
            # Create username from email
            username = email.split('@')[0]
            counter = 1
            original_username = username
            while User.objects.filter(username=username).exists():
                username = f"{original_username}{counter}"
                counter += 1
            
            user = User.objects.create_user(
                username=username,
                email=email,
                first_name=first_name,
                last_name=last_name
            )
            print(f"11. Created new user: {username}")
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        
        print("12. Login successful!")
        
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email
            }
        }, status=200)
        
    except ValueError as e:
        print(f"ERROR: Token verification failed: {e}")
        return Response({'error': f'Invalid Google token: {str(e)}'}, status=400)
    except Exception as e:
        print(f"ERROR: Unexpected error: {e}")
        import traceback
        traceback.print_exc()
        return Response({'error': f'Server error: {str(e)}'}, status=500)
class TransactionViewSet(viewsets.ModelViewSet):
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        # Users only see their own transactions
        queryset = Transaction.objects.filter(user=self.request.user)
        
        # Search by category or description
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(category__icontains=search) | Q(description__icontains=search)
            )
        
        # Filter by type (income/expense)
        transaction_type = self.request.query_params.get('type', None)
        if transaction_type:
            queryset = queryset.filter(type=transaction_type)
        
        # Filter by category
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category=category)
        
        # Filter by date range
        start_date = self.request.query_params.get('start_date', None)
        end_date = self.request.query_params.get('end_date', None)
        if start_date:
            queryset = queryset.filter(date__gte=start_date)
        if end_date:
            queryset = queryset.filter(date__lte=end_date)
        
        return queryset
    
    def perform_create(self, serializer):
        # Automatically set the user when creating
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def summary(self, request):
        """Get summary of transactions"""
        transactions = self.get_queryset()
        
        total_income = sum(t.amount for t in transactions if t.type == 'income')
        total_expense = sum(t.amount for t in transactions if t.type == 'expense')
        balance = total_income - total_expense
        
        return Response({
            'total_income': total_income,
            'total_expense': total_expense,
            'balance': balance,
            'count': transactions.count()
        })
    @action(detail=False, methods=['get'])
    def export_csv(self, request):
        """Export transactions as CSV"""
        # Use the same queryset logic (respects filters)
        transactions = self.get_queryset()
        
        # Create the HttpResponse object with CSV header
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="transactions.csv"'
        
        # Create CSV writer
        writer = csv.writer(response)
        
        # Write header row
        writer.writerow(['Date', 'Type', 'Category', 'Amount', 'Description'])
        
        # Write data rows
        for txn in transactions:
            writer.writerow([
                txn.date,
                txn.type.capitalize(),
                txn.category.capitalize(),
                txn.amount,
                txn.description or ''
            ])
        
        return response

# Register endpoint
@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    username = request.data.get('username')
    email = request.data.get('email', '')
    password = request.data.get('password')
    
    if not username or not password:
        return Response({
            'error': 'Username and password required'
        }, status=400)
    
    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already exists'}, status=400)
    
    user = User.objects.create_user(username=username, email=email, password=password)
    refresh = RefreshToken.for_user(user)
    
    return Response({
        'refresh': str(refresh),
        'access': str(refresh.access_token),
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email
        }
    }, status=201)

# Login endpoint
@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    user = authenticate(username=username, password=password)
    
    if user is None:
        return Response({'error': 'Invalid credentials'}, status=401)
    
    refresh = RefreshToken.for_user(user)
    
    return Response({
        'refresh': str(refresh),
        'access': str(refresh.access_token),
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email
        }
    })