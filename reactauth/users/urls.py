from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegisterView, CustomTokenObtainPairView, GradeViewSet
from rest_framework_simplejwt.views import TokenRefreshView

router = DefaultRouter()
router.register(r'grades', GradeViewSet, basename='grades')

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('', include(router.urls)), 
]
