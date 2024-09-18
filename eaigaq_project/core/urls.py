
from django.urls import include, path
from rest_framework import routers
from .views import (
    UserViewSet, CaseViewSet, MaterialEvidenceViewSet, MaterialEvidenceEventViewSet,
    SessionViewSet, CameraViewSet, AuditEntryViewSet, biometric_auth,
    get_csrf_token, login_view, logout_view, check_auth, LogoutView,
)

router = routers.DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'cases', CaseViewSet)
router.register(r'material-evidences', MaterialEvidenceViewSet)
router.register(r'material-evidence-events', MaterialEvidenceEventViewSet)
router.register(r'sessions', SessionViewSet)
router.register(r'cameras', CameraViewSet)
router.register(r'audit-entries', AuditEntryViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('biometric-auth/', biometric_auth, name='biometric_auth'),
    path('get-csrf-token/', get_csrf_token, name='get_csrf_token'),
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
    path('check-auth/', check_auth, name='check_auth'),
]
