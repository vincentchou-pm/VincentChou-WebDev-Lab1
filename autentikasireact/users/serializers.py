from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
import re
from .models import Grade

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password_confirm = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})

    class Meta:
        model = User
        fields = ('email', 'username', 'full_name', 'major', 'role', 'password', 'password_confirm')
        extra_kwargs = {
            'password': {'write_only': True, 'style': {'input_type': 'password'}},
            'full_name': {'required': True},
            'major': {'required': False, 'allow_blank': True},   # ubah jadi False untuk required, akan dicek di validate
            'role': {'required': False},
            'username': {'required': False},
        }

    def validate_email(self, value):
        email = value.lower()
        student_pattern = re.compile(r'^[a-zA-Z0-9._%+-]+@student\.prasetiyamulya\.ac\.id')
        instructor_pattern = re.compile(r'^[a-zA-Z0-9._%+-]+@prasetiyamulya\.ac\.id$')

        if student_pattern.match(email) or instructor_pattern.match(email):
            if User.objects.filter(email=email).exists():
                raise serializers.ValidationError("Email is already in use.")
            return email
        
        raise serializers.ValidationError("Email must be a valid student or instructor email address.")
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Password and Confirm Password do not match.")
        
        # validasi major hanya untuk student
        email = attrs.get('email', '').lower()
        if email.endswith('@student.prasetiyamulya.ac.id') and not attrs.get('major'):
            raise serializers.ValidationError("Student must select a major.")
        
        return attrs
    
    def create(self, validated_data):
        email = validated_data['email'].lower()
        username = email.split('@')[0]

        # otomatis set role berdasarkan email
        if email.endswith('@student.prasetiyamulya.ac.id'):
            auto_role = 'student'
        elif email.endswith('@prasetiyamulya.ac.id'):
            auto_role = 'instructor'
        else:
            auto_role = 'student'

        role = validated_data.get('role', auto_role)

        user = User.objects.create_user(
            email=email,
            username=username,
            full_name=validated_data['full_name'],
            major=validated_data.get('major', ''),  # instructor boleh kosong
            role=role,
            password=validated_data['password']
        )
        return user

    
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['email'] = user.email
        token['username'] = user.username
        token['full_name'] = user.full_name
        token['major'] = user.major
        token['role'] = user.role

        return token
    
    def validate(self, attrs):
        data = super().validate(attrs)

        token_data = {
            'access': data['access'],
            'refresh': data['refresh'],
        }

        data.update(
            {
                'email': self.user.email,
                'username': self.user.username,
                'full_name': self.user.full_name,
                'major': self.user.major,
                'role': self.user.role,
                'token': token_data
            }
        )

        return data
    
class GradeSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.full_name', read_only=True)

    class Meta:
        model = Grade
        fields = ['id', 'student', 'student_name', 'course_name', 'score', 'semester']
        read_only_fields = ['student', 'student_name']

class GradeCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Grade
        fields = ['student', 'course_name', 'score', 'semester']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "email", "full_name", "major", "role"]