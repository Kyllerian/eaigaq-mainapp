from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone


class User(AbstractUser):
    phone_number = models.CharField(max_length=20, blank=True)
    rank = models.CharField(max_length=50, blank=True)
    # Поле для хранения данных лица (пока оставим как заглушку)
    face_data = models.BinaryField(blank=True, null=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name} - ({self.rank})"


class Case(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    investigator = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='cases'
    )
    active = models.BooleanField(default=True)
    created = models.DateTimeField(default=timezone.now)
    updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class MaterialEvidenceStatus(models.TextChoices):
    IN_STORAGE = 'IN_STORAGE', 'На хранении'
    DESTROYED = 'DESTROYED', 'Уничтожен'
    TAKEN = 'TAKEN', 'Взят'
    ON_EXAMINATION = 'ON_EXAMINATION', 'На экспертизе'
    ARCHIVED = 'ARCHIVED', 'В архиве'


class MaterialEvidence(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    case = models.ForeignKey(
        Case, on_delete=models.SET_NULL, null=True, related_name='material_evidences'
    )
    created_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, related_name='material_evidences_created'
    )
    status = models.CharField(
        max_length=20,
        choices=MaterialEvidenceStatus.choices,
        default=MaterialEvidenceStatus.IN_STORAGE,
    )
    barcode = models.CharField(max_length=255, unique=True)
    created = models.DateTimeField(default=timezone.now)
    updated = models.DateTimeField(auto_now=True)
    active = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class MaterialEvidenceEvent(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    material_evidence = models.ForeignKey(
        MaterialEvidence, on_delete=models.CASCADE, related_name='events'
    )
    action = models.CharField(
        max_length=20,
        choices=MaterialEvidenceStatus.choices,
    )
    created = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.action} - {self.user} - {self.created.strftime('%Y-%m-%d %H:%M:%S')}"


class Session(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sessions')
    login = models.DateTimeField(default=timezone.now)
    logout = models.DateTimeField(null=True, blank=True)
    active = models.BooleanField(default=True)

    def __str__(self):
        return f"Сессия пользователя {self.user} от {self.login.strftime('%Y-%m-%d %H:%M:%S')}"


class CameraType(models.TextChoices):
    FACE_ID = 'FACE_ID', 'Аутентификация по лицу'
    REC = 'REC', 'Запись видео'
    DEFAULT = 'DEFAULT', 'Обычная камера'


class Camera(models.Model):
    device_id = models.IntegerField(unique=True)
    name = models.CharField(max_length=255)
    type = models.CharField(
        max_length=20,
        choices=CameraType.choices,
        default=CameraType.DEFAULT,
    )
    created = models.DateTimeField(default=timezone.now)
    updated = models.DateTimeField(auto_now=True)
    active = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class AuditEntry(models.Model):
    object_id = models.IntegerField()
    table_name = models.CharField(max_length=255)
    class_name = models.CharField(max_length=255)
    action = models.CharField(max_length=10)
    fields = models.TextField()
    data = models.TextField()
    created = models.DateTimeField(default=timezone.now)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"Аудит {self.action} на {self.class_name} пользователем {self.user}"
