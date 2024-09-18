from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework import viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from .models import (
    User, Case, MaterialEvidence, MaterialEvidenceEvent,
    Session, Camera, AuditEntry
)
from .serializers import (
    UserSerializer, CaseSerializer, MaterialEvidenceSerializer,
    MaterialEvidenceEventSerializer, SessionSerializer, CameraSerializer,
    AuditEntrySerializer
)

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import logout


class LogoutView(APIView):
    def post(self, request):
        logout(request)
        return Response({"detail": "Вы успешно вышли."}, status=status.HTTP_200_OK)


# Представления для моделей

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class CaseViewSet(viewsets.ModelViewSet):
    queryset = Case.objects.all()  # Добавили эту строку
    serializer_class = CaseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Возвращаем только дела, созданные текущим пользователем
        return Case.objects.filter(investigator=self.request.user)

    def perform_create(self, serializer):
        # Устанавливаем текущего пользователя как 'investigator' при создании дела
        serializer.save(investigator=self.request.user)


class MaterialEvidenceViewSet(viewsets.ModelViewSet):
    queryset = MaterialEvidence.objects.all()
    serializer_class = MaterialEvidenceSerializer


class MaterialEvidenceEventViewSet(viewsets.ModelViewSet):
    queryset = MaterialEvidenceEvent.objects.all()
    serializer_class = MaterialEvidenceEventSerializer


class SessionViewSet(viewsets.ModelViewSet):
    queryset = Session.objects.all()
    serializer_class = SessionSerializer


class CameraViewSet(viewsets.ModelViewSet):
    queryset = Camera.objects.all()
    serializer_class = CameraSerializer


class AuditEntryViewSet(viewsets.ModelViewSet):
    queryset = AuditEntry.objects.all()
    serializer_class = AuditEntrySerializer


# Заглушка для биометрической аутентификации

@api_view(['POST'])
@permission_classes([AllowAny])
def biometric_auth(request):
    # Заглушка для биометрической аутентификации
    # Здесь вы можете реализовать функционал позже
    return Response({'message': 'Biometric authentication placeholder'})


# Представления для аутентификации

@ensure_csrf_cookie
@api_view(['GET'])
@permission_classes([AllowAny])
def get_csrf_token(request):
    return JsonResponse({'detail': 'CSRF cookie set'})


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    print(f"Попытка входа: {username}")
    user = authenticate(request, username=username, password=password)
    if user is not None:
        print(f"Успешная аутентификация для пользователя: {user.username}")
        login(request, user)
        return JsonResponse({'detail': 'Authentication successful'})
    else:
        print(f"Аутентификация не удалась для пользователя: {username}")
        return JsonResponse({'detail': 'Invalid credentials'}, status=401)


@api_view(['POST'])
def logout_view(request):
    logout(request)
    return JsonResponse({'detail': 'Logout successful'})


@api_view(['GET'])
def check_auth(request):
    if request.user.is_authenticated:
        return JsonResponse({'is_authenticated': True})
    else:
        return JsonResponse({'is_authenticated': False}, status=401)
