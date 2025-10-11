from rest_framework import routers
from .views import TransactionViewSet

router = routers.DefaultRouter()
router.register(r'transactions', TransactionViewSet)

urlpatterns = router.urls
