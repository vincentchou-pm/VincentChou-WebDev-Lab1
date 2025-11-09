from rest_framework import generics, permissions, viewsets
from .serializers import RegisterSerializer, CustomTokenObtainPairSerializer, GradeSerializer, GradeCreateSerializer, UserSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from .models import Grade
from rest_framework.exceptions import PermissionDenied

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class GradeViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        # Untuk create/update, pakai serializer yang bisa menerima student id
        if self.request.method in ['POST', 'PUT', 'PATCH']:
            return GradeCreateSerializer
        return GradeSerializer

    def get_queryset(self):
        user = self.request.user
        if user.role == 'student':
            return Grade.objects.filter(student=user)
        elif user.role == 'instructor':
            return Grade.objects.all()
        return Grade.objects.none()

    def perform_create(self, serializer):
        # Hanya instructor yang boleh menambahkan grade
        if self.request.user.role != 'instructor':
            raise PermissionDenied("Only instructors can add grades.")
        serializer.save()
    
class UserViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Viewset untuk menampilkan daftar user.
    Hanya instructor yang bisa melihat semua student.
    """
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == "instructor":
            return User.objects.filter(role="student")
        return User.objects.none()