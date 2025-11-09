from rest_framework import generics, permissions, viewsets
from .serializers import RegisterSerializer, CustomTokenObtainPairSerializer, GradeSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from .models import Grade

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class GradeViewSet(viewsets.ModelViewSet):
    queryset = Grade.objects.all()
    serializer_class = GradeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'student':
            return Grade.objects.filter(student=user)
        elif user.role == 'instructor':
            return Grade.objects.all()
        return Grade.objects.none()

    def perform_create(self, serializer):
        user = self.request.user
        if user.role == 'student':
            serializer.save(student=user)
        else:
            serializer.save()

    