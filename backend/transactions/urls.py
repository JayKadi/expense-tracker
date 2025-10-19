from rest_framework import routers
from .views import TransactionViewSet

router = routers.DefaultRouter()
router.register(r'', TransactionViewSet, basename='transaction')

urlpatterns = router.urls