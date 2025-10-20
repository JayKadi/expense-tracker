from django.urls import path, include
from rest_framework import routers
from .views import TransactionViewSet, google_login

router = routers.DefaultRouter()
router.register(r'', TransactionViewSet, basename='transaction')

urlpatterns = [
    path('', include(router.urls)),
    path('api/google-login/', google_login),
]
