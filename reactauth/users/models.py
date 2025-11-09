from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('student', 'Student'),
        ('instructor', 'Instructor'),
    )

    MAJOR_CHOICES = (
        ('artificial_intelligence_and_robotics', 'AIR'),
        ('business_mathematics', ' BM'),
        ('digital_business_technology', 'DBT'),
        ('product_design_innovation', 'PDI'),
        ('energy_business_technology', 'EBT'),
        ('food_business_technology', 'FBT'),
    )

    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=100)
    major = models.CharField(max_length=50, blank=True, null=True, choices=MAJOR_CHOICES)
    role = models.CharField(max_length=20, default='student', choices=ROLE_CHOICES)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'full_name']

    def save(self, *args, **kwargs):
        if not self.pk:
            if self.email.endswith('@student.prasetiyamulya.ac.id'):
                self.role = 'student'
            elif self.email.endswith('@prasetiyamulya.ac.id'):
                self.role = 'instructor'
        super().save(*args, **kwargs)


class Grade(models.Model):
    student = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name='grades',
        limit_choices_to={'role': 'student'},  # hanya user student
    )
    course_name = models.CharField(max_length=100)
    score = models.FloatField()
    semester = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.student.full_name} - {self.course_name} ({self.score})"


    def __str__(self):
        return self.email
    
