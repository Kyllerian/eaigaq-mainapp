from rest_framework import serializers
from .models import (
    User, Case, MaterialEvidence, MaterialEvidenceEvent,
    Session, Camera, AuditEntry
)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 'username', 'password', 'first_name', 'last_name',
            'email', 'phone_number', 'rank', 'face_data'
        ]
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = super().create(validated_data)
        if password:
            user.set_password(password)
            user.save()
        return user


class CaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Case
        fields = ['id', 'name', 'description', 'investigator', 'active', 'created', 'updated']
        read_only_fields = ['investigator', 'created', 'updated']

class MaterialEvidenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = MaterialEvidence
        fields = '__all__'


class MaterialEvidenceEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = MaterialEvidenceEvent
        fields = '__all__'


class SessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Session
        fields = '__all__'


class CameraSerializer(serializers.ModelSerializer):
    class Meta:
        model = Camera
        fields = '__all__'


class AuditEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = AuditEntry
        fields = '__all__'
